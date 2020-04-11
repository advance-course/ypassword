import { connect, useDispatch, useSelector } from "@tarojs/redux";
import { Reducer, Action, ReducersMapObject, Dispatch } from "redux";

const { create } = require("dva-core");

let app: any, store: any, dispatch: Dispatch<any>;

export { connect, useDispatch, useSelector };
export interface Options {
  models: Model<any>[];
  extraReducers?: any;
  initialState?: any;
  onError?: (e: any) => void;
  onAction?: any[];
}

export function createApp(options: Options) {
  app = create(options);

  // @ts-ignore
  if (!global.registered) {
    options.models.forEach(model => app.model(model));
  }
  // @ts-ignore
  global.registered = true;
  app.start();

  store = app._store;
  app.getStore = () => store;

  dispatch = store.dispatch;

  app.dispatch = dispatch;
  return app;
}

export interface EffectsCommandMap {
  put: <A extends Action>(action: A) => any,
  call: Function,
  select: Function,
  take: Function,
  cancel: Function,
  actionChannel: Function,
  all: Function,
  apply: Function,
  cancelled: Function,
  cps: Function,
  flush: Function,
  fork: Function,
  getContext: Function,
  join: Function,
  race: Function,
  setContext: Function,
  spawn: Function,
  takeEvery: Function,
  takeLatest: Function,
  takem: Function,
  throttle: Function,
  [key: string]: any;
}
export interface EffectsMapObject {
  [key: string]: Effect | EffectWithType;
}
export type Reducer2<S, A> = (state: S, action: A) => S

export type ReducersMapObject2<S> = {
  [key: string]: Reducer2<S, ActionWithPayload>
}

export interface ReducerEnhancer {
  (reducer: Reducer<any>): void;
}
export interface SubscriptionAPI {
  dispatch: Dispatch<any>;
}
export type ActionWithPayload = { 
  type: string; 
  payload: any,
  [key: string]: any
};
export type EffectType = "takeEvery" | "takeLatest" | "watcher" | "throttle";
export type EffectWithType = [Effect, { type: EffectType }];
export type Effect = (
  action: ActionWithPayload,
  effects: EffectsCommandMap
) => void;
export type ReducersMapObjectWithEnhancer = [
  ReducersMapObject,
  ReducerEnhancer
];
export type Subscription = (api: SubscriptionAPI, done: Function) => void;
export interface SubscriptionsMapObject {
  [key: string]: Subscription;
}
export interface Model<T> {
  namespace: string;
  state: T;
  reducers?: ReducersMapObject2<T>;
  effects?: EffectsMapObject;
  subscriptions?: SubscriptionsMapObject;
}
