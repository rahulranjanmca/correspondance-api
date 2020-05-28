import { Payload } from '../interface/payload.interface';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  it('should validate success', async () => {
    const jwtStrategy = new JwtStrategy();

    try {
      await jwtStrategy.validate({ userId: 'userId', userRole: 'userRole' });
    } catch (e) {
      fail('should not here');
    }
  });

  it('should not validate success', async () => {
    const jwtStrategy = new JwtStrategy();
    try {
      await jwtStrategy.validate(({} as unknown) as Payload);
      fail('should not here');
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
});
