import awsConfigs from './aws';

describe('AWS config spec', () => {
  it("should validate AWS config", () => {
    expect(awsConfigs.length).toEqual(1);
    expect(awsConfigs[0]).toEqual({
      name: 'default',
      services: ['*'],
      accessKeyId: undefined,
      secretAccessKey: undefined,
      region: undefined
    })
  });
});