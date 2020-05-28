import { Payload } from '../interface/payload.interface';
import { JwtStrategy } from './jwt.strategy';

describe('Attachments Controller', () => {
  const jwtStrategy = new JwtStrategy();
  it('should validate success', async () => {
    expect(await jwtStrategy.validate({ userId: 'testUser', userRole: 'testRole' })).toStrictEqual({
      userId: 'testUser',
      userRole: 'testRole'
    });
    try {
      await jwtStrategy.validate(({ userId: 'testUser' } as unknown) as Payload);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
