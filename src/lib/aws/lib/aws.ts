/**
 * @module aws
 */
/* modules */
import { SanitizeError } from '@wellmark/wm-lib-error-handler';

/* interfaces */
import { IAWSConfig } from '../../../interfaces/aws';
/* libraries */
import logger from '../../logger';
import utils from '../../utils';
/* internals */
import S3 from './s3';
import SES from './ses';
import SSM from './ssm';
import STS from './sts';

const NODE_ENV = process.env.NODE_ENV as string;

const DATACENTER = process.env.DATACENTER_ENV as string;
const AMAZON_WEB_SERVICES = 'AWS';
const ONPREM = 'ONPREM';

const MODULE_NOT_FOUND = 'MODULE_NOT_FOUND';

export default class AWS {
  private _s3: any | {};
  private _ssm: any | {};
  private _ses: any | {};
  private _sts: any | {};

  constructor() {
    this._s3 = {};
    this._ssm = {};
    this._ses = {};
    this._sts = {};
  }

  private _initSSM(configName: string, config: IAWSConfig): void {
    this._ssm[configName] = new SSM(config);
  }

  private _initS3(configName: string, config: IAWSConfig): void {
    this._s3[configName] = new S3(config);
  }

  private _initSES(configName: string, config: IAWSConfig): void {
    this._ses[configName] = new SES(config);
  }

  private _initSTS(configName: string, config: IAWSConfig): void {
    this._sts[configName] = new STS(config);
  }

  private _initAll(configName: string, config: IAWSConfig): void {
    this._initSSM(configName, config);
    this._initS3(configName, config);
    this._initSES(configName, config);
    this._initSTS(configName, config);
  }

  private _throwNewError(message: string): void {
    throw new Error(message);
  }

  private _initServices(config: IAWSConfig) {
    try {
      logger.debug(`{}AWS::#_initServices::initiating execution`);
      // (configName: string, config: IAWSConfig) => void
      const configName = config.name || 'default';
      const configServiceMapper: { [index: string]: () => void } = {
        '*': () => {
          this._initAll(configName, config);
        },
        SSM: () => {
          this._initSSM(configName, config);
        },
        S3: () => {
          this._initS3(configName, config);
        },
        SES: () => {
          this._initSES(configName, config);
        },
        STS: () => {
          this._initSTS(configName, config);
        },
        DEFAULT: () => {
          this._throwNewError('please provide a valid aws service with your config');
        }
      };

      if (config.services) {
        config.services.map((service: string) => {
          // NOTE: Previously '||' was used instead of ',' but this caused:
          // error TS1345: An expression of type 'void' cannot be tested for truthiness
          (configServiceMapper[(service || 'default').toUpperCase()] || configServiceMapper['DEFAULT'])();
        });
      }

      logger.info(`{}AWS::#_initServices::successfully executed`);

      return;
    } catch (err) {
      logger.error(`{}AWS::#_initServices::error executing::error=${SanitizeError(err)}`);
      throw err;
    }
  }

  public init(awsConfig?: IAWSConfig[]) {
    try {
      logger.debug(`{}AWS::#init::initiating execution`);

      let configs: IAWSConfig[] | undefined = awsConfig ? awsConfig : undefined;
      let _err: any;
      let __err: any;

      if (configs === undefined) {
        try {
          configs =
            NODE_ENV === 'LOCAL' ? require(`${process.cwd()}/src/configs/aws`).default : require(`${process.cwd()}/configs/aws`).default;
        } catch (er) {
          _err = er;

          if (process.env.NODE_ENV === 'LOCAL') {
            try {
              configs = require(`${process.cwd()}/configs/aws`).default;
            } catch (e) {
              __err = e;
            }
          }
        }
      }

      if (DATACENTER === AMAZON_WEB_SERVICES) {
        if (configs !== undefined) {
          configs.map((config: IAWSConfig) => {
            if (!config.services) this._throwNewError('please provide the aws services you wish to use in your config');
            if (configs && configs.length === 1) {
              this._initServices(config);
            } else {
              if (!config.name) this._throwNewError('please provide a name for each config when initiating with multiple configs');
              this._initServices(config);
            }
          });
        } else {
          this._s3['default'] = new S3();
          this._ssm['default'] = new SSM();
          this._ses['default'] = new SES();
          this._sts['default'] = new STS();
        }
      } else if (DATACENTER === ONPREM) {
        if (process.env.NODE_ENV === 'LOCAL') {
          this._s3['default'] = new S3();
          this._ssm['default'] = new SSM();
          this._ses['default'] = new SES();
          this._sts['default'] = new STS();
        } else {
          if (configs === undefined) {
            if (_err.code === MODULE_NOT_FOUND) {
              this._throwNewError('please provide a aws config in configs/aws.js or an awsConfig object when calling #init');
            } else {
              if (_err !== undefined) {
                throw _err;
              } else {
                if (__err !== undefined) {
                  throw __err;
                } else {
                  this._throwNewError(`failed to initialize - error = ${_err} - configs = ${configs}`);
                }
              }
            }
          }

          configs &&
            configs.map((config: IAWSConfig) => {
              if (!config.services) this._throwNewError('please provide the aws services you wish to use in your config');
              if (configs && configs.length === 1) {
                this._initServices(config);
              } else {
                if (!config.name) this._throwNewError('please provide a name for each config when initiating with multiple configs');
                this._initServices(config);
              }
            });
        }
      } else {
        this._throwNewError(
          `please set your DATACENTER_ENV environment variable to an identifiable value [ '${AMAZON_WEB_SERVICES};, '${ONPREM}' ]`
        );
      }

      logger.info('{}AWS::#init::successfully executed');

      return;
    } catch (err) {
      const error = SanitizeError(err);
      logger.error(`{}AWS::#init::error executing::error=${error}`);
      throw error;
    }
  }

  createInstance(service: string, awsConfig: IAWSConfig) {
    try {
      logger.debug('{}AWS::#createInstance::initiating execution');

      let instance;

      switch (service.toUpperCase()) {
        case 'S3': {
          instance = new S3(awsConfig);
          break;
        }
        case 'SSM': {
          instance = new SSM(awsConfig);
          break;
        }
        case 'SES': {
          logger.debug(`{}AWS::#createInstance::initiating with awsConfig=${utils.common.stringify(awsConfig)}`);
          instance = new SES(awsConfig);
          break;
        }
        case 'STS': {
          instance = new STS(awsConfig);
          break;
        }
        default: {
          this._throwNewError('Please provide a valid and supported aws service');
        }
      }

      logger.info('{}AWS::#createInstance::successfully executed');

      return instance;
    } catch (err) {
      const error = SanitizeError(err);
      logger.error(`{}AWS::#createInstance::error executing::error=${utils.common.stringify(error)}`);
      throw error;
    }
  }

  public s3(name: string): S3 {
    return this._s3[name];
  }

  public ssm(name: string) {
    return this._ssm[name];
  }

  public ses(name: string) {
    return this._ses[name];
  }

  public sts(name: string) {
    return this._sts[name];
  }
}
