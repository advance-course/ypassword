/**
 * 存储TabBar当前选中的 current 索引值
 */
import { Model } from "utils/dva";

export interface TabBarState {
  current: number;
  initial: boolean;
}

export default {
  namespace: "tabBar",
  state: {
    current: 0,
    initial: true
  },
  reducers: {
    setCurrent: (state, action: any) => ({
      ...state,
      current: action.current,
      initial: false
    })
  }
} as Model<TabBarState>;
