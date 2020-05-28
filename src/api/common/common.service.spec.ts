import { HttpModule, HttpService, HttpStatus, ValidationError } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import * as assert from 'assert';
import { fromFile } from 'file-type';
import { promises as pfs } from 'fs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { from } from 'rxjs';
import { getConnectionManager, Repository } from 'typeorm';

import { merge } from '../../lib/utils/easy-pdf-merge';
import { Conversation } from '../conversations/entity/conversation.entity';
import { WebInquiryResponseFields } from '../web-inquiry/dto/web-inquiry.contact.status.detail.dto copy';
import { CommonService } from './common.service';
import { AuditRecordEntity } from './entity/audit.record.entity';
import path = require('path');

const mockS3GetObject = jest.fn();
const mockS3Upload = jest.fn();
const mockS3DeleteObject = jest.fn();
jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn(() => ({
      getObject: mockS3GetObject,
      upload: mockS3Upload,
      deleteObject: mockS3DeleteObject
    }))
  };
});
jest.mock('../../lib/utils/easy-pdf-merge');
jest.mock('file-type');

describe('CommonService by using local fs', () => {
  let service: CommonService;
  const mongod = new MongoMemoryServer();
  let auditRecordEntityRepository: Repository<AuditRecordEntity>;
  const mockPostFunction = jest.fn();
  const mockPutFunction = jest.fn();
  const mockGetFunction = jest.fn();

  beforeEach(async () => {
    process.env.WM_CCC_OBJECT_STORAGE_TYPE = 'local';
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        TypeOrmModule.forRoot({
          name: 'WM_CCC',
          type: 'mongodb',
          url: await mongod.getUri(),
          entities: [AuditRecordEntity],
          synchronize: true
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
  });

  afterEach(async () => {
    await getConnectionManager().connections[0].close();
    await mongod.stop();

    mockGetFunction.mockReset();
    mockPostFunction.mockReset();
  });

  describe('getCatalogList', () => {
    it('should get CatalogList success for cache not hit', async () => {
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
    it('should build document success for letter', async () => {
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

      const ret = await service.buildDocument(({ formId: 'test_form', userId: 'test_userId' } as unknown) as Conversation, true, {});
      expect(ret).toBeDefined();
      expect(ret).toStrictEqual(Buffer.from('test'));
      expect(mockGetFunction).toBeCalledTimes(1);
      expect(mockPostFunction).toBeCalledTimes(1);
    });

    it('should build document success for form', async () => {
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
        ({ formQuantity: [{ formId: 'test_form' }], userId: 'test_userId' } as unknown) as Conversation,
        true,
        {}
      );
      expect(ret).toBeDefined();
      expect(ret).toStrictEqual(Buffer.from('test'));
      expect(mockGetFunction).toBeCalledTimes(1);
      expect(mockPostFunction).toBeCalledTimes(1);
    });

    it('should not build document success for no letter or form info', async () => {
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

      try {
        await service.buildDocument(({ userId: 'test_userId' } as unknown) as Conversation, true, {});
        assert.fail('should not be here');
      } catch (e) {
        expect(e).toBeDefined();
      }
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
        await service.buildDocument(({ formId: 'test_form', userId: 'test_userId' } as unknown) as Conversation, true);
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
        await service.buildDocument(({ formId: 'test_form', userId: 'test_userId' } as unknown) as Conversation, true);
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
        await service.buildDocument(({ formId: 'test_form', userId: 'test_userId' } as unknown) as Conversation, true);
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
        await service.buildDocument(({ formId: 'test_form', userId: 'test_userId' } as unknown) as Conversation, true);
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
        await service.buildDocument(({ formId: 'test_form', userId: 'test_userId' } as unknown) as Conversation, true);
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
        await service.buildDocument(({ formId: 'test_form', userId: 'test_userId' } as unknown) as Conversation, true);
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

  it('should uploadToS3 success', async () => {
    jest.spyOn(pfs, 'writeFile').mockResolvedValue();
    expect(await service.uploadToS3(Buffer.from('test'), 'test_key')).toBe(path.join(process.env.WM_CC_TEMPORARY_PATH || '', 'test_key'));
  });

  it('should deleteFromS3 success', async () => {
    jest.spyOn(pfs, 'unlink').mockResolvedValue();

    try {
      await service.deleteFromS3('test_key');
    } catch (e) {
      assert.fail('should not be here');
    }
  });

  it('should saveErrorAuditRecord success', async () => {
    await service.saveErrorAuditRecord('test', 'test', 'test', Error('test'));

    expect(await auditRecordEntityRepository.count()).toBe(1);

    await service.saveErrorAuditRecord('test', 'test', 'test', CommonService.getHttpError('test', HttpStatus.BAD_REQUEST));

    expect(await auditRecordEntityRepository.count()).toBe(2);
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
              }
            ]
          }
        ]);
      });

      expect(await service.sendWebInquiryGet('test', { userId: 'test', userRole: 'test' })).toBeDefined();
    });

    it('should sendWebInquiryGet success for no statusDetails', async () => {
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
                statusDetails: {},
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
        await service.sendWebInquiryPatch('test', ({} as unknown) as WebInquiryResponseFields, { userId: 'test', userRole: 'test' });
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
          await service.sendWebInquiryPatch('test', ({} as unknown) as WebInquiryResponseFields, { userId: 'test', userRole: 'test' })
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
          await service.sendWebInquiryPatch('test', ({} as unknown) as WebInquiryResponseFields, { userId: 'test', userRole: 'test' })
        ).toBeDefined();
        assert.fail('should not be here');
      } catch (error) {
        expect(error.message.message).toBe('test');
      }
    });
  });
});

describe('should coverage configuration items is null', () => {
  const mongod = new MongoMemoryServer();
  const envBack = {};

  beforeEach(() => {
    Object.assign(envBack, process.env);
  });

  afterEach(async () => {
    Object.assign(process.env, envBack);
    await getConnectionManager().connections[0].close();
    await mongod.stop();
  });

  it('should coverage configuration items is null', async () => {
    // because of using dotenv-safe, the configuration items should never undefined.
    // the branch is only for lint clean. so on checking here, only init.
    delete process.env.WM_CCC_ROOT_URI_DOCUMENT_API;
    delete process.env.WM_CC_ROOT_URI_DYNAMICS_ROOT;
    delete process.env.WM_CC_ROOT_URI_LCA_ROOT;
    delete process.env.WM_CCC_OBJECT_STORAGE_TYPE;
    delete process.env.WM_CCC_OBJECT_STORAGE_S3_BUCKET;
    delete process.env.WM_CRMWBI_ROOT_URI_CONTACT_API;
    delete process.env.WM_CCC_OBJECT_STORAGE_S3_REGION;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        TypeOrmModule.forRoot({
          name: 'WM_CCC',
          type: 'mongodb',
          url: await mongod.getUri(),
          entities: [AuditRecordEntity],
          synchronize: true
        }),
        TypeOrmModule.forFeature([AuditRecordEntity], 'WM_CCC'),
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '3600s' }
        })
      ],
      providers: [CommonService]
    }).compile();

    expect(module.get<CommonService>(CommonService)).toBeDefined();
  });
});

describe('CommonService by using s3', () => {
  let service: CommonService;
  const mongod = new MongoMemoryServer();

  beforeEach(async () => {
    process.env.WM_CCC_OBJECT_STORAGE_TYPE = 'S3';
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        TypeOrmModule.forRoot({
          name: 'WM_CCC',
          type: 'mongodb',
          url: await mongod.getUri(),
          entities: [AuditRecordEntity],
          synchronize: true
        }),
        TypeOrmModule.forFeature([AuditRecordEntity], 'WM_CCC'),
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '3600s' }
        })
      ],
      providers: [CommonService]
    }).compile();

    service = module.get<CommonService>(CommonService);
  });

  afterEach(async () => {
    await getConnectionManager().connections[0].close();
    await mongod.stop();
  });

  it('should download From S3 success', async () => {
    mockS3GetObject.mockReturnValue({ promise: () => Promise.resolve({ Body: Buffer.from('test') }) });
    const ret = await service.downloadFromS3('test_key');
    expect(ret).toStrictEqual(Buffer.from('test'));
  });

  it('should upload to S3 success', async () => {
    mockS3Upload.mockReturnValue({ promise: () => Promise.resolve({ Location: 'test' }) });
    const ret = await service.uploadToS3(Buffer.from('test'), 'test_key');
    expect(ret).toStrictEqual('test');
  });

  it('should delete From S3 success', async () => {
    mockS3DeleteObject.mockReturnValue({ promise: () => Promise.resolve() });
    try {
      await service.deleteFromS3('test_key');
    } catch (e) {
      assert.fail('should not be here');
    }
  });

  it('should not delete From S3 success, for exception', async () => {
    mockS3DeleteObject.mockReturnValue({ promise: () => Promise.reject('test') });
    try {
      await service.deleteFromS3('test_key');
      assert.fail('should not be here');
    } catch (e) {
      expect(e.message.message).toBe('delete From S3 failed');
    }
  });
});
