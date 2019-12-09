import { Model } from "utils/dva";

export interface LoginState {
  isLogin: boolean;
}

export default {
  namespace: "login",
  state: {
    isLogin: false
  }
} as Model<LoginState>;
