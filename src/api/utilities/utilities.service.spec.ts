import { UtilitiesService } from './utilities.service';
import ProcessEnv = NodeJS.ProcessEnv;

describe('UtilitiesService', () => {
  let service: UtilitiesService;

  beforeEach(() => {
    service = new UtilitiesService();
  });

  it('should getHealthy success', () => {
    const ret = service.getHealth();

    expect(ret.status).toBe('healthy');
  });

  it('should stringifyEnv success', () => {
    const ret = service.stringifyEnv();

    expect(ret).toBeDefined();
  });

  it('should ignore own property for stringifyEnv', () => {
    const copiedEnv = Object.assign({}, process.env);

    function myEnv(id: number, name: string) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      this.id = id;
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      this.name = name;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const myEnvInstance = new myEnv(123, 'Smith');
    myEnv.prototype.email = 'smith@abc.com';

    process.env = (myEnvInstance as unknown) as ProcessEnv;

    const ret = service.stringifyEnv();

    expect(ret).toBeDefined();
    expect(JSON.stringify(ret).includes('email')).toBeFalsy();
    process.env = copiedEnv;
  });
});
