import awsConfigs from './aws';

describe('awsConfigs', () => {
  it('should get awsConfigs', () => {
    expect(awsConfigs[0].name).toBeDefined();
  });
});
