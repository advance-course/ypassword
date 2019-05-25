import { observable, action } from 'mobx';

export class LoginStore {
  @observable
  public counter = 1;

  @action
  public increment = () => {
    this.counter ++;
  }

  @action decrement = () => {
    this.counter --;
  }

  @action incrementAsync = () => {
    setTimeout(() => {
      this.counter ++;
    }, 1000);
  }
}

export default new LoginStore();