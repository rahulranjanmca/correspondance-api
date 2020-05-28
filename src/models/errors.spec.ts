import { APIError, CorsError } from "./errors";

describe('Error model testing', () => {
  let originalNodeEnv = {};
  beforeEach(() => {
    originalNodeEnv = process.env;
  });

  afterEach(() => {
    process.env = originalNodeEnv;
  });

  it("should validate APIError", () => {
    const error1 = {
      message: 'title',
      statusCode: 401,
      pointer: 'pointer1',
      param: 'param1',
      stack: 'detail'
    };
    const apiError1 = APIError(error1);
    expect(apiError1).toEqual({
      title: 'title',
      statusCode: 401,
      source: {
        pointer: 'pointer1',
        param: 'param1'
      },
      detail: 'detail'
    });
    
    const error2 = {
      title: 'title',
      statusCode: 401,
      pointer: 'pointer1',
      param: 'param1',
      detail: 'detail'
    };
    const apiError2 = APIError(error2);
    expect(apiError2).toEqual({
      title: 'title',
      statusCode: 401,
      source: {
        pointer: 'pointer1',
        param: 'param1'
      },
      detail: 'detail'
    });

    const error3 = {};
    const apiError3 = APIError(error3);
    expect(apiError3).toEqual({
      title: 'uncaught exception',
      statusCode: 500,
      source: {
        pointer: undefined,
        param: undefined
      },
      detail: undefined
    });

    process.env.NODE_ENV = 'PREP';
    const apiError4 = APIError(error1);
    expect(apiError4).toEqual({
      title: 'title',
      statusCode: 401,
      source: {
        pointer: 'pointer1',
        param: 'param1'
      },
      detail: undefined
    });

    process.env.NODE_ENV = 'PROD';
    const apiError5 = APIError(error1);
    expect(apiError5).toEqual({
      title: 'title',
      statusCode: 401,
      source: {
        pointer: 'pointer1',
        param: 'param1'
      },
      detail: undefined
    });
  });

  it("should validate CORS error", () => {
    const error = new CorsError();
    expect(error.message).toEqual('Not allowed by CORS');
  });
});