"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStore = void 0;
/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */
const react_1 = require("react");
const deeper_equal_1 = __importDefault(require("../lib/deeper-equal"));
const StoreContext_1 = require("./StoreContext");
// import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
const useStore = (selector = (r) => r) => {
    const store = StoreContext_1.useGenericStore();
    const [state, setState] = react_1.useState(selector ? () => selector(store.state) : store.state);
    // @TODO - in react 18 these hooks usage will have to be replaced with this to work correctly with the concurrent rendering
    //   const state = useSyncExternalStoreWithSelector(
    //     store.subscribe,
    //     store.getState(),
    //     undefined,
    //     selector,
    //     deeperEqual
    //   );
    react_1.useLayoutEffect(() => {
        const unsubscribe = store.subscribe((newStoreState) => {
            if (selector) {
                const selectedState = selector(newStoreState);
                if (!deeper_equal_1.default(selectedState, state)) {
                    setState(() => selectedState);
                }
            }
            else {
                setState(() => newStoreState);
            }
        });
        return () => unsubscribe && unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // @TODO reconsider disabling exhaustive-deps
    // @ts-ignore
    return [state, store.dispatchAction, store.getState];
};
exports.useStore = useStore;
//# sourceMappingURL=useStore.js.map