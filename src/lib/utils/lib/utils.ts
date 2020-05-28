import Common from './common';

export default class Utils {
  private _common: Common;

  constructor() {
    this._common = new Common();
  }

  get common(): Common {
    return this._common;
  }
}
