import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy Testing', () => {
  it('should throw error if payload is invalid', async () => {
    const jwtStrategy = new JwtStrategy();

    try {
      await jwtStrategy.validate({
        userId: '',
        userRole: ''
      });
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.getResponse()).toEqual({ message: 'Token is missing or Invalid token' });
      expect(err.getStatus()).toEqual(401);
    }
  });

  it('should return the jwt payload', async () => {
    const jwtStrategy = new JwtStrategy();

    const res = await jwtStrategy.validate({
      userId: 'topcoder',
      userRole: 'admin'
    });
    expect(res).toEqual({
      userId: 'topcoder',
      userRole: 'admin'
    });
  });
});
