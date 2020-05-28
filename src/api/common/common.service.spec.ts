import { HttpModule, HttpService, HttpStatus, ValidationError } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import * as assert from 'assert';
import { S3 } from 'aws-sdk';
import { fromFile } from 'file-type';
import { promises as pfs } from 'fs';
import mock from 'mock-fs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { from } from 'rxjs';
import { getConnectionManager, Repository } from 'typeorm';

import { merge } from '../../lib/utils/easy-pdf-merge';
import { Conversation } from '../conversations/entity/conversation.entity';
import { WebInquiryResponseFields } from '../web-inquiry/dto/web-inquiry.contact.status.detail.dto copy';
import { CommonService } from './common.service';
import { AuditRecordEntity } from './entity/audit.record.entity';
import {
  AuthorizationOwnerEntity,
  CatalogAuthorizationEntity,
  CatalogConfigurationEntity,
  CatalogEntity,
  CatalogInstanceEntity,
  CatalogMailroomEntity
} from './entity/catalog.entity';

jest.mock('../../lib/utils/easy-pdf-merge');
jest.mock('file-type');
const mS3Instance = {
  upload: jest.fn(),
  getObject: jest.fn(),
  deleteObject: jest.fn()
};
jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn(() => mS3Instance)
  };
});

describe('CommonService', () => {
  let service: CommonService;
  const mongod = new MongoMemoryServer();
  let auditRecordEntityRepository: Repository<AuditRecordEntity>;
  const mockPostFunction = jest.fn();
  const mockPutFunction = jest.fn();
  const mockGetFunction = jest.fn();
  let module: TestingModule;

  async function initCommonService(): Promise<void> {
    module = await Test.createTestingModule({
      imports: [
        HttpModule,
        TypeOrmModule.forRoot({
          name: 'WM_CCC',
          type: 'mongodb',
          url: await mongod.getUri(),
          entities: [AuditRecordEntity],
          synchronize: true,
          useUnifiedTopology: true,
          keepConnectionAlive: true
        }),
        TypeOrmModule.forFeature([AuditRecordEntity], 'WM_CCC'),
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '3600s' }
        })
      ],
      providers: [CommonService]
    })
      .overrideProvider(HttpService)
      .useValue({ post: mockPostFunction, get: mockGetFunction, put: mockPutFunction })
      .compile();

    service = module.get<CommonService>(CommonService);
    auditRecordEntityRepository = module.get<Repository<AuditRecordEntity>>(getRepositoryToken(AuditRecordEntity, 'WM_CCC'));
  }

  async function cleanupResources(): Promise<void> {
    await getConnectionManager().connections[0].close();
    await mongod.stop();

    mockGetFunction.mockReset();
    mockPostFunction.mockReset();
  }

  it('should create temp folder success if temp folder does not exist', async () => {
    // use ./temp folder defined in process.env to test mkdir behavior
    mock({});

    new CommonService((null as unknown) as HttpService, (null as unknown) as Repository<any>, (null as unknown) as JwtService);

    expect(true);

    mock.restore();
  });

  it('should initialize CommonService success with empty env config', async () => {
    const copiedEnv = Object.assign({}, process.env);
    process.env.WM_CCC_ROOT_URI_DOCUMENT_API = '';
    process.env.WM_CC_ROOT_URI_DYNAMICS_ROOT = '';
    process.env.WM_CC_ROOT_URI_LCA_ROOT = '';
    process.env.WM_CCC_OBJECT_STORAGE_TYPE = '';
    process.env.WM_CCC_OBJECT_STORAGE_S3_BUCKET = '';
    process.env.WM_CC_TEMPORARY_PATH = '';
    process.env.WM_CRMWBI_ROOT_URI_CONTACT_API = '';
    process.env.WM_CCC_OBJECT_STORAGE_S3_REGION = '';
    // force S3 initialization before mock-fs to avoid issues
    new S3({
      apiVersion: '2006-03-01',
      accessKeyId: process.env.WM_CCC_OBJECT_STORAGE_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.WM_CCC_OBJECT_STORAGE_S3_SECRET_ACCESS_KEY,
      region: process.env.WM_CCC_OBJECT_STORAGE_S3_REGION || '',
      params: {
        Bucket: ''
      },
      signatureVersion: 'v4'
    });
    mock({});

    new CommonService((null as unknown) as HttpService, (null as unknown) as Repository<any>, (null as unknown) as JwtService);

    expect(true);

    mock.restore();
    // recover process.env values
    process.env = copiedEnv;
  });

  describe('localStore', () => {
    beforeEach(async () => {
      process.env.WM_CCC_OBJECT_STORAGE_TYPE = 'local';
      await initCommonService();
    });

    afterEach(async () => {
      await cleanupResources();
    });

    describe('getCatalogList', () => {
      it('should get CatalogList success for cache not hit', async () => {
        // for coverage
        new CatalogConfigurationEntity();
        new CatalogInstanceEntity();
        new AuthorizationOwnerEntity();
        new CatalogAuthorizationEntity();
        new CatalogMailroomEntity();
        new CatalogEntity();

        mockGetFunction.mockImplementation(() => {
          return from([{ status: 200, data: [] }]);
        });
        const ret = await service.getCatalogList('test_role');

        expect(ret).toStrictEqual([]);
        expect(mockGetFunction).toBeCalledTimes(1);
      });

      it('should get CatalogList success for cache hit', async () => {
        mockGetFunction.mockImplementation(() => {
          return from([{ status: 200, data: [] }]);
        });
        let ret = await service.getCatalogList('test_role');
        expect(ret).toStrictEqual([]);
        expect(mockGetFunction).toBeCalledTimes(1);

        ret = await service.getCatalogList('test_role');
        expect(ret).toStrictEqual([]);
        expect(mockGetFunction).toBeCalledTimes(1);
      });

      it('should not get CatalogList success for http send failed', async () => {
        mockGetFunction.mockImplementation(() => {
          throw new Error('test');
        });

        try {
          await service.getCatalogList('test_role');
          assert.fail('should not be here');
        } catch (error) {
          expect(error.message.message).toBe('test');
        }

        expect(mockGetFunction).toBeCalledTimes(1);
      });

      it('should not get CatalogList success http get return status not 200', async () => {
        mockGetFunction.mockImplementation(() => {
          return from([{ status: 400 }]);
        });
        try {
          await service.getCatalogList('test_role');
          assert.fail('should not be here');
        } catch (error) {
          expect(error.message.message).toBe('send catalog failed');
        }

        expect(mockGetFunction).toBeCalledTimes(1);
      });

      it('should not get CatalogList success http get return data is null', async () => {
        mockGetFunction.mockImplementation(() => {
          return from([{ status: 200 }]);
        });
        try {
          await service.getCatalogList('test_role');
          assert.fail('should not be here');
        } catch (error) {
          expect(error.message.message).toBe('send catalog failed');
        }

        expect(mockGetFunction).toBeCalledTimes(1);
      });
    });

    describe('getTemplateById', () => {
      it('should get TemplateById success', async () => {
        mockGetFunction.mockImplementation(() => {
          return from([{ status: 200, data: [] }]);
        });
        const ret = await service.getTemplateById('test_role');

        expect(ret).toStrictEqual([]);
        expect(mockGetFunction).toBeCalledTimes(1);
      });
      it('should not get TemplateById success for http send failed', async () => {
        mockGetFunction.mockImplementation(() => {
          throw new Error('test');
        });

        try {
          await service.getTemplateById('test_role');
          assert.fail('should not be here');
        } catch (error) {
          expect(error.message.message).toBe('test');
        }

        expect(mockGetFunction).toBeCalledTimes(1);
      });

      it('should not get TemplateById success http get return status not 200', async () => {
        mockGetFunction.mockImplementation(() => {
          return from([{ status: 400 }]);
        });
        try {
          await service.getTemplateById('test_role');
          assert.fail('should not be here');
        } catch (error) {
          expect(error.message.message).toBe('send template failed');
        }

        expect(mockGetFunction).toBeCalledTimes(1);
      });

      it('should not get TemplateById success http get return data is null', async () => {
        mockGetFunction.mockImplementation(() => {
          return from([{ status: 200 }]);
        });
        try {
          await service.getTemplateById('test_role');
          assert.fail('should not be here');
        } catch (error) {
          expect(error.message.message).toBe('send template failed');
        }

        expect(mockGetFunction).toBeCalledTimes(1);
      });

      it('should not get TemplateById success for response is null', async () => {
        mockGetFunction.mockImplementation(() => {
          return from([]);
        });
        try {
          await service.getTemplateById('test_role');
          assert.fail('should not be here');
        } catch (error) {
          expect(error.message.message).toBe('send template failed');
        }

        expect(mockGetFunction).toBeCalledTimes(1);
      });
    });

    describe('sendDocumentApprovalOrThrow', () => {
      it('should send DocumentApproval success', async () => {
        mockPostFunction.mockImplementation(() => {
          return from([{ status: 200 }]);
        });

        await service.sendDocumentApprovalOrThrow('test_role', 'test_caseId', 'test_userId', 'id');

        expect(mockPostFunction).toBeCalledTimes(1);
      });

      it('should not send DocumentApproval success for http failed', async () => {
        mockPostFunction.mockImplementation(() => {
          throw new Error('test');
        });

        try {
          await service.sendDocumentApprovalOrThrow('test_role', 'test_caseId', 'test_userId', 'id');
        } catch (error) {
          expect(error.message.message).toBe('test');
        }

        expect(mockPostFunction).toBeCalledTimes(1);
      });

      it('should not send DocumentApproval success for status not 200', async () => {
        mockPostFunction.mockImplementation(() => {
          return from([{ status: 400 }]);
        });

        try {
          await service.sendDocumentApprovalOrThrow('test_role', 'test_caseId', 'test_userId', 'id');
        } catch (error) {
          expect(error.message.message).toBe('send documentApproval failed');
        }

        expect(mockPostFunction).toBeCalledTimes(1);
      });

      it('should not send DocumentApproval success for response is null', async () => {
        mockPostFunction.mockImplementation(() => {
          return from([]);
        });

        try {
          await service.sendDocumentApprovalOrThrow('test_role', 'test_caseId', 'test_userId', 'id');
        } catch (error) {
          expect(error.message.message).toBe('send documentApproval failed');
        }

        expect(mockPostFunction).toBeCalledTimes(1);
      });
    });

    describe('buildDocument', () => {
      it('should build document success with valid form id', async () => {
        mockGetFunction.mockImplementation(() => {
          return from([
            {
              status: 200,
              data: [
                {
                  formId: 'test_form',
                  instances: [{ id: 'test_id' }]
                },
                {
                  formId: 'test_form2',
                  instances: [{ id: 'test_id2' }]
                }
              ]
            }
          ]);
        });

        mockPostFunction.mockImplementation(() => {
          return from([
            {
              status: 200,
              data: { item: { content: Buffer.from('test').toString('base64') } }
            }
          ]);
        });

        jest.spyOn(pfs, 'writeFile').mockResolvedValue();
        jest.spyOn(pfs, 'readFile').mockResolvedValue(Buffer.from('test'));
        jest.spyOn(pfs, 'unlink').mockResolvedValue();
        (merge as jest.Mock).mockResolvedValue('');
        (fromFile as jest.Mock).mockResolvedValue({ mime: 'application/pdf' });

        const ret = await service.buildDocument(
          ({
            formId: 'test_form',
            userId: 'test_userId'
          } as unknown) as Conversation,
          true
        );
        expect(ret).toBeDefined();
        expect(ret).toStrictEqual(Buffer.from('test'));
        expect(mockGetFunction).toBeCalledTimes(1);
        expect(mockPostFunction).toBeCalledTimes(1);
      });

      it('should build document success with empty form id and valid form quantity', async () => {
        mockGetFunction.mockImplementation(() => {
          return from([
            {
              status: 200,
              data: [
                {
                  formId: 'test_form',
                  instances: [{ id: 'test_id' }]
                },
                {
                  formId: 'test_form2',
                  instances: [{ id: 'test_id2' }]
                }
              ]
            }
          ]);
        });

        mockPostFunction.mockImplementation(() => {
          return from([
            {
              status: 200,
              data: { item: { content: Buffer.from('test').toString('base64') } }
            }
          ]);
        });

        jest.spyOn(pfs, 'writeFile').mockResolvedValue();
        jest.spyOn(pfs, 'readFile').mockResolvedValue(Buffer.from('test'));
        jest.spyOn(pfs, 'unlink').mockResolvedValue();
        (merge as jest.Mock).mockResolvedValue('');
        (fromFile as jest.Mock).mockResolvedValue({ mime: 'application/pdf' });

        const ret = await service.buildDocument(({ formQuantity: [{ formId: 'test_form' }] } as unknown) as Conversation, true, {
          key1: 'value1'
        });
        expect(ret).toBeDefined();
        expect(ret).toStrictEqual(Buffer.from('test'));
        expect(mockGetFunction).toBeCalledTimes(1);
        expect(mockPostFunction).toBeCalledTimes(1);
      });

      it('should build document success with attachments', async () => {
        mockGetFunction.mockImplementation(() => {
          return from([
            {
              status: 200,
              data: [
                {
                  formId: 'test_form',
                  instances: [{ id: 'test_id' }]
                }
              ]
            }
          ]);
        });

        mockPostFunction.mockImplementation(() => {
          return from([
            {
              status: 200,
              data: { item: { content: Buffer.from('test').toString('base64') } }
            }
          ]);
        });

        jest.spyOn(pfs, 'writeFile').mockResolvedValue();
        jest.spyOn(pfs, 'readFile').mockResolvedValue(Buffer.from('test'));
        jest.spyOn(pfs, 'unlink').mockResolvedValue();
        (merge as jest.Mock).mockResolvedValue('');
        (fromFile as jest.Mock).mockResolvedValue({ mime: 'application/pdf' });

        const ret = await service.buildDocument(
          ({
            formId: 'test_form',
            userId: 'test_userId',
            attachments: [
              {
                contentType: 'application/pdf',
                id: 'test1'
              },
              {
                contentType: 'application/zip',
                id: 'test2'
              }
            ]
          } as unknown) as Conversation,
          true
        );
        expect(ret).toBeDefined();
        expect(ret).toStrictEqual(Buffer.from('test'));
        expect(mockGetFunction).toBeCalledTimes(1);
        expect(mockPostFunction).toBeCalledTimes(1);
      });

      it('should not build document success for merge failed', async () => {
        mockGetFunction.mockImplementation(() => {
          return from([
            {
              status: 200,
              data: [
                {
                  formId: 'test_form',
                  instances: [{ id: 'test_id' }]
                }
              ]
            }
          ]);
        });

        mockPostFunction.mockImplementation(() => {
          return from([
            {
              status: 200,
              data: { item: { content: Buffer.from('test').toString('base64') } }
            }
          ]);
        });

        jest.spyOn(pfs, 'writeFile').mockResolvedValue();
        jest.spyOn(pfs, 'readFile').mockResolvedValue(Buffer.from('test'));
        jest.spyOn(pfs, 'unlink').mockResolvedValue();
        (merge as jest.Mock).mockRejectedValue('test');
        (fromFile as jest.Mock).mockResolvedValue({ mime: 'application/pdf' });

        try {
          await service.buildDocument(
            ({
              formId: 'test_form',
              userId: 'test_userId',
              attachments: [
                {
                  contentType: 'application/pdf',
                  id: 'test1'
                },
                {
                  contentType: 'application/zip',
                  id: 'test2'
                }
              ]
            } as unknown) as Conversation,
            true
          );
          assert.fail('should not be here');
        } catch (error) {
          expect(error.message.message).toBe('merge pdf files failed');
        }

        expect(mockGetFunction).toBeCalledTimes(1);
        expect(mockPostFunction).toBeCalledTimes(1);
      });

      it('should not build document success for merge failed 2', async () => {
        mockGetFunction.mockImplementation(() => {
          return from([
            {
              status: 200,
              data: [
                {
                  formId: 'test_form',
                  instances: [{ id: 'test_id' }]
                }
              ]
            }
          ]);
        });

        mockPostFunction.mockImplementation(() => {
          return from([
            {
              status: 200,
              data: { item: { content: Buffer.from('test').toString('base64') } }
            }
          ]);
        });

        jest.spyOn(pfs, 'writeFile').mockResolvedValue();
        jest.spyOn(pfs, 'readFile').mockResolvedValue(Buffer.from('test'));
        jest.spyOn(pfs, 'unlink').mockResolvedValue();
        (merge as jest.Mock).mockRejectedValue(Error('test'));
        (fromFile as jest.Mock).mockResolvedValue({ mime: 'application/pdf' });

        try {
          await service.buildDocument(
            ({
              formId: 'test_form',
              userId: 'test_userId',
              attachments: [
                {
                  contentType: 'application/pdf',
                  id: 'test1'
                },
                {
                  contentType: 'application/zip',
                  id: 'test2'
                }
              ]
            } as unknown) as Conversation,
            true
          );
          assert.fail('should not be here');
        } catch (error) {
          expect(error.message.message).toBe(`merge pdf files failed with error test`);
        }

        expect(mockGetFunction).toBeCalledTimes(1);
        expect(mockPostFunction).toBeCalledTimes(1);
      });

      it('should not build document success for no form match', async () => {
        mockGetFunction.mockImplementation(() => {
          return from([
            {
              status: 200,
              data: [
                {
                  formId: 'test_form1',
                  instances: [{ id: 'test_id' }]
                }
              ]
            }
          ]);
        });

        try {
          await service.buildDocument(
            ({
              formId: 'test_form',
              userId: 'test_userId'
            } as unknown) as Conversation,
            true
          );
          assert.fail('should not here');
        } catch (error) {
          expect(error.message.message).toBe('Requested catalog is not found in database');
        }

        expect(mockGetFunction).toBeCalledTimes(1);
        expect(mockPostFunction).toBeCalledTimes(0);
      });

      it('should not build document success for empty form id and empty form quantity', async () => {
        mockGetFunction.mockImplementation(() => {
          return from([
            {
              status: 200,
              data: [
                {
                  formId: 'test_form1',
                  instances: [{ id: 'test_id' }]
                }
              ]
            }
          ]);
        });

        try {
          await service.buildDocument(({} as unknown) as Conversation, true);
          assert.fail('should not here');
        } catch (error) {
          expect(error.message.message).toBe('Requested catalog is not found in database');
        }

        expect(mockGetFunction).toBeCalledTimes(1);
        expect(mockPostFunction).toBeCalledTimes(0);
      });

      it('should not build document success for fromFile failed', async () => {
        mockGetFunction.mockImplementation(() => {
          return from([
            {
              status: 200,
              data: [
                {
                  formId: 'test_form',
                  instances: [{ id: 'test_id' }]
                }
              ]
            }
          ]);
        });

        mockPostFunction.mockImplementation(() => {
          return from([
            {
              status: 200,
              data: { item: { content: Buffer.from('test').toString('base64') } }
            }
          ]);
        });

        jest.spyOn(pfs, 'writeFile').mockResolvedValue();
        jest.spyOn(pfs, 'readFile').mockResolvedValue(Buffer.from('test'));
        jest.spyOn(pfs, 'unlink').mockResolvedValue();
        (merge as jest.Mock).mockResolvedValue('');
        (fromFile as jest.Mock).mockResolvedValue(undefined);

        try {
          await service.buildDocument(
            ({
              formId: 'test_form',
              userId: 'test_userId'
            } as unknown) as Conversation,
            true
          );
          assert.fail('should not be here');
        } catch (error) {
          expect(error.message.message).toBe('get file type failed');
        }

        expect(mockGetFunction).toBeCalledTimes(1);
        expect(mockPostFunction).toBeCalledTimes(1);
      });

      it('should not build document success for built file not pdf ', async () => {
        mockGetFunction.mockImplementation(() => {
          return from([
            {
              status: 200,
              data: [
                {
                  formId: 'test_form',
                  instances: [{ id: 'test_id' }]
                }
              ]
            }
          ]);
        });

        mockPostFunction.mockImplementation(() => {
          return from([
            {
              status: 200,
              data: { item: { content: Buffer.from('test').toString('base64') } }
            }
          ]);
        });

        jest.spyOn(pfs, 'writeFile').mockResolvedValue();
        jest.spyOn(pfs, 'readFile').mockResolvedValue(Buffer.from('test'));
        jest.spyOn(pfs, 'unlink').mockResolvedValue();
        (merge as jest.Mock).mockResolvedValue('');
        (fromFile as jest.Mock).mockResolvedValue({ mime: 'application/zip' });

        try {
          await service.buildDocument(
            ({
              formId: 'test_form',
              userId: 'test_userId'
            } as unknown) as Conversation,
            true
          );
          assert.fail('should not be here');
        } catch (error) {
          expect(error.message.message).toBe(`get built file type application/zip from document api is not application/pdf`);
        }

        expect(mockGetFunction).toBeCalledTimes(1);
        expect(mockPostFunction).toBeCalledTimes(1);
      });

      it('should not build document success for send get failed', async () => {
        mockGetFunction.mockImplementation(() => {
          throw new Error('test');
        });

        try {
          await service.buildDocument(
            ({
              formId: 'test_form',
              userId: 'test_userId'
            } as unknown) as Conversation,
            true
          );
          assert.fail('should not here');
        } catch (error) {
          expect(error.message.message).toBe('test');
        }

        expect(mockGetFunction).toBeCalledTimes(1);
        expect(mockPostFunction).toBeCalledTimes(0);
      });

      it('should not build document success for send post failed', async () => {
        mockGetFunction.mockImplementation(() => {
          return from([
            {
              status: 200,
              data: [
                {
                  formId: 'test_form',
                  instances: [{ id: 'test_id' }]
                }
              ]
            }
          ]);
        });

        mockPostFunction.mockImplementation(() => {
          throw new Error('test');
        });

        try {
          await service.buildDocument(
            ({
              formId: 'test_form',
              userId: 'test_userId'
            } as unknown) as Conversation,
            true
          );
          assert.fail('should not here');
        } catch (error) {
          expect(error.message.message).toBe('test');
        }

        expect(mockGetFunction).toBeCalledTimes(1);
        expect(mockPostFunction).toBeCalledTimes(1);
      });

      it('should not build document success for send post failed status not 200', async () => {
        mockGetFunction.mockImplementation(() => {
          return from([
            {
              status: 200,
              data: [
                {
                  formId: 'test_form',
                  instances: [{ id: 'test_id' }]
                }
              ]
            }
          ]);
        });

        mockPostFunction.mockImplementation(() => {
          return from([
            {
              status: 400
            }
          ]);
        });

        try {
          await service.buildDocument(
            ({
              formId: 'test_form',
              userId: 'test_userId'
            } as unknown) as Conversation,
            true
          );
          assert.fail('should not here');
        } catch (error) {
          expect(error.message.message).toBe('send content/build failed');
        }

        expect(mockGetFunction).toBeCalledTimes(1);
        expect(mockPostFunction).toBeCalledTimes(1);
      });
    });

    it('should saveAuditRecord success', async () => {
      await service.saveAuditRecord('test', 'test', 'test', 'test');

      expect(await auditRecordEntityRepository.count()).toBe(1);
    });

    it('should saveErrorAuditRecord success', async () => {
      await service.saveErrorAuditRecord('test', 'test', 'test', Error('test'));

      expect(await auditRecordEntityRepository.count()).toBe(1);

      await service.saveErrorAuditRecord('test', 'test', 'test', CommonService.getHttpError('test', HttpStatus.BAD_REQUEST));

      expect(await auditRecordEntityRepository.count()).toBe(2);
    });

    it('should uploadToS3 success', async () => {
      const fileBuffer = Buffer.from('test');
      const key = 'key1';
      jest.spyOn(pfs, 'writeFile').mockResolvedValue();

      await service.uploadToS3(fileBuffer, key);

      expect(pfs.writeFile).toBeCalled();
    });

    it('should deleteFromS3 success', async () => {
      const key = 'key1';
      jest.spyOn(pfs, 'unlink').mockResolvedValue();

      await service.deleteFromS3(key);

      expect(pfs.unlink).toBeCalled();
    });

    describe('throwBadRequestError', () => {
      it('should throwBadRequestError success', async () => {
        try {
          CommonService.throwBadRequestError(([{ constraints: { key: 'value' } }] as unknown) as ValidationError[]);
          assert.fail('should not be here');
        } catch (error) {
          expect(error.message.message).toBeDefined();
        }
      });

      it('should not throwBadRequestError success', async () => {
        try {
          CommonService.throwBadRequestError([]);
        } catch (error) {
          assert.fail('should not be here');
        }

        try {
          CommonService.throwBadRequestError((undefined as unknown) as ValidationError[]);
        } catch (error) {
          assert.fail('should not be here');
        }
      });
    });

    describe('sendWebInquiryGet', () => {
      it('should sendWebInquiryGet success', async () => {
        mockGetFunction.mockImplementation(() => {
          return from([
            {
              status: 200,
              data: [
                {
                  correspondenceNumber: 'string',
                  xrefCorrespondenceNumber: 'string',
                  modifiedDate: 'string',
                  submissionDate: 'string',
                  contactName: 'string',
                  typeOfInquiry: 'string',
                  certificateNumber: 'string',
                  wellmarkID: 'string',
                  memberFirstName: 'string',
                  memberLastName: 'string',
                  patientAccountNumber: 'string',
                  memberPlanCode: 'string',
                  groupNumber: 'string',
                  groupName: 'string',
                  billingUnit: 'string',
                  patientRelation: 'string',
                  patientDOB: 'string',
                  patientFirstName: 'string',
                  patientLastName: 'string',
                  patientGender: 'string',
                  taskEmail: 'string',
                  iCN: 'string',
                  sCCF: 'string',
                  dateOfService: 'string',
                  question: 'string',
                  response: 'string',
                  status: 'string',
                  submitterContactName: 'string',
                  submitterPhone: 'string',
                  submitterNPI: 'string',
                  submitterProviderName: 'string',
                  renderingProviderName: 'string',
                  submitterProviderId: 'string',
                  submitterProviderState: 'string',
                  submitterProviderTaxId: 'string',
                  submitterProviderZip: 'string',
                  ownerFirstName: 'string',
                  repeatReply: 'string',
                  caseID: 'string',
                  xrefCaseID: 'string',
                  documents: {},
                  statusDetails: {
                    statusDetail: [
                      {
                        actionType: 'string',
                        actionTakenOn: 'string',
                        activityData: 'string',
                        CSA: 'string'
                      }
                    ]
                  },
                  facetsIndicator: 'string',
                  inquiryTypeCode: 'string',
                  unreadIndicator: true
                },
                {
                  correspondenceNumber: 'string',
                  xrefCorrespondenceNumber: 'string',
                  modifiedDate: 'string',
                  submissionDate: 'string',
                  contactName: 'string',
                  typeOfInquiry: 'string',
                  certificateNumber: 'string',
                  wellmarkID: 'string',
                  memberFirstName: 'string',
                  memberLastName: 'string',
                  patientAccountNumber: 'string',
                  memberPlanCode: 'string',
                  groupNumber: 'string',
                  groupName: 'string',
                  billingUnit: 'string',
                  patientRelation: 'string',
                  patientDOB: 'string',
                  patientFirstName: 'string',
                  patientLastName: 'string',
                  patientGender: 'string',
                  taskEmail: 'string',
                  iCN: 'string',
                  sCCF: 'string',
                  dateOfService: 'string',
                  question: 'string',
                  response: 'string',
                  status: 'string',
                  submitterContactName: 'string',
                  submitterPhone: 'string',
                  submitterNPI: 'string',
                  submitterProviderName: 'string',
                  renderingProviderName: 'string',
                  submitterProviderId: 'string',
                  submitterProviderState: 'string',
                  submitterProviderTaxId: 'string',
                  submitterProviderZip: 'string',
                  ownerFirstName: 'string',
                  repeatReply: 'string',
                  caseID: 'string',
                  xrefCaseID: 'string',
                  documents: {},
                  facetsIndicator: 'string',
                  inquiryTypeCode: 'string',
                  unreadIndicator: true
                }
              ]
            }
          ]);
        });

        expect(await service.sendWebInquiryGet('test', { userId: 'test', userRole: 'test' })).toBeDefined();
      });

      it('should not sendWebInquiryGet success for response status is not 200', async () => {
        mockGetFunction.mockImplementation(() => {
          return from([{ status: 400 }]);
        });

        try {
          await service.sendWebInquiryGet('test', { userId: 'test', userRole: 'test' });
          assert.fail('should not be here');
        } catch (error) {
          expect(error.message.message).toBe('send web-inquiry get failed');
        }
      });

      it('should not sendWebInquiryGet success for send failed', async () => {
        mockGetFunction.mockImplementation(() => {
          throw new Error('test');
        });

        try {
          await service.sendWebInquiryGet('test', { userId: 'test', userRole: 'test' });
          assert.fail('should not be here');
        } catch (error) {
          expect(error.message.message).toBe('test');
        }
      });
    });

    describe('sendWebInquiryPatch', () => {
      it('should sendWebInquiryPatch success', async () => {
        mockPutFunction.mockImplementation(() => {
          return from([{ status: 201 }]);
        });

        try {
          await service.sendWebInquiryPatch('test', ({} as unknown) as WebInquiryResponseFields, {
            userId: 'test',
            userRole: 'test'
          });
        } catch (error) {
          assert.fail('should not be here');
        }
      });

      it('should not sendWebInquiryPatch success for response status is not 200', async () => {
        mockPutFunction.mockImplementation(() => {
          return from([{ status: 400 }]);
        });

        try {
          expect(
            await service.sendWebInquiryPatch('test', ({} as unknown) as WebInquiryResponseFields, {
              userId: 'test',
              userRole: 'test'
            })
          ).toBeDefined();
          assert.fail('should not be here');
        } catch (error) {
          expect(error.message.message).toBe('send web-inquiry patch failed');
        }
      });

      it('should not sendWebInquiryPatch success for send failed', async () => {
        mockPutFunction.mockImplementation(() => {
          throw new Error('test');
        });

        try {
          expect(
            await service.sendWebInquiryPatch('test', ({} as unknown) as WebInquiryResponseFields, {
              userId: 'test',
              userRole: 'test'
            })
          ).toBeDefined();
          assert.fail('should not be here');
        } catch (error) {
          expect(error.message.message).toBe('test');
        }
      });
    });
  });

  describe('s3Store', () => {
    beforeEach(async () => {
      process.env.WM_CCC_OBJECT_STORAGE_TYPE = 'S3';
      await initCommonService();
    });

    afterEach(async () => {
      await cleanupResources();
    });

    it('should uploadToS3 success', async () => {
      const fileBuffer = Buffer.from('test');
      const key = 'key1';
      const contentType = 'content-type-1';
      const location = 's3://xxx';

      mS3Instance.upload.mockImplementation(() => {
        return {
          promise: () => {
            return {
              Location: location
            };
          }
        };
      });

      const result = await service.uploadToS3(fileBuffer, key, contentType);

      expect(result).toBe(location);
    });

    describe('deleteFromS3', () => {
      it('should deleteFromS3 success', async () => {
        const key = 'key1';

        mS3Instance.deleteObject.mockImplementation(() => {
          return {
            promise: () => {}
          };
        });

        await service.deleteFromS3(key);

        expect(mS3Instance.deleteObject).toBeCalled();
      });

      it('should throw internal server error success with delete from S3 failure', async () => {
        const key = 'key1';

        mS3Instance.deleteObject.mockImplementation(() => {
          throw new Error('test');
        });

        try {
          await service.deleteFromS3(key);
          assert.fail('should not be here');
        } catch (error) {
          expect(error.message.message).toBe('delete From S3 failed');
        }
      });
    });

    describe('buildDocument', () => {
      it('should build document success with attachments', async () => {
        mockGetFunction.mockImplementation(() => {
          return from([
            {
              status: 200,
              data: [
                {
                  formId: 'test_form',
                  instances: [{ id: 'test_id' }]
                }
              ]
            }
          ]);
        });

        mockPostFunction.mockImplementation(() => {
          return from([
            {
              status: 200,
              data: { item: { content: Buffer.from('test').toString('base64') } }
            }
          ]);
        });

        mS3Instance.getObject = jest.fn().mockImplementation(() => {
          return {
            promise: () => {
              return {
                Body: Buffer.from('test')
              };
            }
          };
        });
        jest.spyOn(pfs, 'writeFile').mockResolvedValue();
        jest.spyOn(pfs, 'readFile').mockResolvedValue(Buffer.from('test'));
        jest.spyOn(pfs, 'unlink').mockResolvedValue();
        (merge as jest.Mock).mockResolvedValue('');
        (fromFile as jest.Mock).mockResolvedValue({ mime: 'application/pdf' });

        const ret = await service.buildDocument(
          ({
            formId: 'test_form',
            userId: 'test_userId',
            attachments: [
              {
                contentType: 'application/pdf',
                id: 'test1'
              },
              {
                contentType: 'application/zip',
                id: 'test2'
              }
            ]
          } as unknown) as Conversation,
          true
        );
        expect(ret).toBeDefined();
        expect(ret).toStrictEqual(Buffer.from('test'));
        expect(mockGetFunction).toBeCalledTimes(1);
        expect(mockPostFunction).toBeCalledTimes(1);
      });
    });
  });
});
