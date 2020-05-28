import Requests from './requests';

const requests = new Requests();

export default class HTTP {
  private _requests: Requests;

  constructor() {
    this._requests = requests;
  }

  public get requests(): Requests {
    return this._requests;
  }
}
