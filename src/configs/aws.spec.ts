import awsConfigs from './aws';

describe('AWS config', () => {
  it('should get default aws config', () => {
    expect(awsConfigs.length).toBe(1);
    expect(awsConfigs[0].name).toBe('default');
  });
});
