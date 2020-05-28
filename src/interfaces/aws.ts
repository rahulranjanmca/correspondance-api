/* eslint-disable @typescript-eslint/interface-name-prefix */
export interface IAWSConfig {
  name?: string;
  services?: string[];
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
  region?: string;
}
