import { HttpService } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import { Repository } from 'typeorm';

import { CommonService } from './common.service';
import { AuditRecordEntity } from './entity/audit.record.entity';
import Mock = jest.Mock;

jest.mock('fs', () => {
  return {
    isDirectory: jest.fn().mockReturnValue(true),
    existsSync: jest.fn().mockReturnValue(true),
    readFileSync: jest
      .fn()
      .mockReturnValue(
        '{\n' +
          '  "ONPREM": {\n' +
          '    "default": {\n' +
          '      "WML_CLOUDWATCH_PUSH_ENABLED": false,\n' +
          '      "WML_CLOUDWATCH_LOG_LEVEL": "trace",\n' +
          '      "WML_CONSOLE_ENABLED": false,\n' +
          '      "WML_CONSOLE_LOG_LEVEL": "trace",\n' +
          '      "WML_CONSOLE_COLOR_ENABLED": false,\n' +
          '      "WML_ENABLE_INIT_CONSOLE_LOGGING": true\n' +
          '    }\n' +
          '  }\n' +
          '}'
      ),
    mkdirSync: jest.fn(),
    watch: jest.fn(),
    rename: jest.fn(),
    truncate: jest.fn(),
    chown: jest.fn(),
    fchown: jest.fn(),
    chmod: jest.fn(),
    fchmod: jest.fn(),
    stat: jest.fn(),
    lstat: jest.fn(),
    fstat: jest.fn(),
    link: jest.fn(),
    symlink: jest.fn(),
    readlink: jest.fn(),
    realpath: jest.fn(),
    unlink: jest.fn(),
    rmdir: jest.fn(),
    mkdir: jest.fn(),
    readdir: jest.fn(),
    close: jest.fn(),
    open: jest.fn(),
    utimes: jest.fn(),
    futimes: jest.fn(),
    fsync: jest.fn(),
    write: jest.fn(),
    read: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
    appendFile: jest.fn(),
    watchFile: jest.fn(),
    unwatchFile: jest.fn(),
    exists: jest.fn()
  };
});

jest.mock('read-pkg-up', () => {
  return { sync: jest.fn().mockReturnValue({ pkg: { name: 'name', version: 'version' } }) };
});

describe('CommonService', () => {
  const envBack = {};
  let mockExistsSync: Mock;
  let mockMkdirSync: Mock;

  beforeEach(() => {
    mockExistsSync = (fs.existsSync as unknown) as Mock;
    mockMkdirSync = (fs.mkdirSync as unknown) as Mock;
    mockExistsSync.mockReset();
    mockMkdirSync.mockReset();
    Object.assign(envBack, process.env);
  });

  afterEach(async () => {
    Object.assign(process.env, envBack);
    mockExistsSync.mockReset();
    mockMkdirSync.mockReset();

    expect(process.env.WM_CC_TEMPORARY_PATH).toBeDefined();
  });

  it('should make dir', async () => {
    delete process.env.WM_CC_TEMPORARY_PATH;

    mockExistsSync.mockReturnValue(false);
    mockMkdirSync.mockReturnValue(null);

    const commonService = new CommonService(
      (null as unknown) as HttpService,
      (null as unknown) as Repository<AuditRecordEntity>,
      (null as unknown) as JwtService
    );
    expect(commonService).toBeDefined();

    expect(mockExistsSync).toBeCalledTimes(1);
    expect(mockMkdirSync).toBeCalledTimes(1);
  });

  it('should not make dir for folder exists', async () => {
    delete process.env.WM_CC_TEMPORARY_PATH;

    mockExistsSync.mockReturnValue(true);
    mockMkdirSync.mockReturnValue(null);

    const commonService = new CommonService(
      (null as unknown) as HttpService,
      (null as unknown) as Repository<AuditRecordEntity>,
      (null as unknown) as JwtService
    );
    expect(commonService).toBeDefined();
    expect(mockExistsSync).toBeCalledTimes(1);
    expect(mockMkdirSync).toBeCalledTimes(0);
  });
});
