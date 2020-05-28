import { IAWSConfig } from '../interfaces/aws';

const awsConfigs: IAWSConfig[] = [
  {
    name: 'default',
    services: ['*'],
    accessKeyId: undefined,
    secretAccessKey: undefined,
    region: undefined
  }
];

export default awsConfigs;
