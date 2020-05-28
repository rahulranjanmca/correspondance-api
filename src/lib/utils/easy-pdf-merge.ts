import logger from '../logger';

let _merge: (arg0: string[], arg1: string, arg2: (err: string) => void) => void

export function merge(source_files: string[], dest_file_path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!_merge) {
      _merge = require('easy-pdf-merge');
    }

    _merge(source_files, dest_file_path, function (err: string) {
      if (err) {
        logger.error(err);
        reject(err);
      }

      resolve();
    });
  })
}

