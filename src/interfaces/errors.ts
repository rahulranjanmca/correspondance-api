/* eslint-disable @typescript-eslint/interface-name-prefix */
interface IAPIErrorSource {
  pointer: string | undefined;
  param: string | undefined;
}

export interface IAPIError {
  title: string;
  statusCode: number;
  source: IAPIErrorSource;
  detail: string | undefined;
}
