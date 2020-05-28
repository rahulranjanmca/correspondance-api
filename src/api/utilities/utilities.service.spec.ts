import { UtilitiesService } from './utilities.service';

describe('Utilities Service', () => {
  const service = new UtilitiesService();

  it('should getHealth success', async () => {
    expect(service.getHealth()).toStrictEqual({ status: 'healthy' });
  });

  it('should getStringifyEnv success', async () => {
    const protoType = Object.getPrototypeOf(process.env);
    protoType.exclude = 'true';
    const envs = service.stringifyEnv();
    expect(envs).toContain('SWAGGER_BASE_PATH=/v1');
    expect(envs).not.toContain('exclude=true');
  });
});
