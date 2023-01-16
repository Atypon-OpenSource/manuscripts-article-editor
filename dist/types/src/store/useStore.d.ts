import { dispatch, state } from './Store';
export declare const useStore: <T>(selector?: (r: state) => state | T) => [T, dispatch, () => state];
