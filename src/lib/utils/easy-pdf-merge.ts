import logger from '../logger';

let _merge: (arg0: string[], arg1: string, arg2: (err: string) => void) => void;

export function merge(sourceFiles: string[], destFilePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!_merge) {
      _merge = require('easy-pdf-merge');
    }

    _merge(sourceFiles, destFilePath, function(err: string) {
      if (err) {
        logger.error(err);
        reject(err);
      }

      resolve();
    });
  });
}
