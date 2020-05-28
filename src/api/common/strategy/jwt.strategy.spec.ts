import { HttpStatus } from '@nestjs/common';
import * as assert from 'assert';

import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it('should throw unauthorized error if user role is empty', async () => {
    try {
      await strategy.validate({ userId: '123', userRole: '' });
      assert.fail('should not be here');
    } catch (error) {
      expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
    }
  });

  it('should validate success', async () => {
    const userId = '123';
    const ret = await strategy.validate({ userId: userId, userRole: 'role1' });
    expect(ret.userId).toBe(userId);
  });
});
