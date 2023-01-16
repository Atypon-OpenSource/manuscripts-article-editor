"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMicrostore = void 0;
const react_1 = require("react");
// This hook is similar to useState, except that it prevents state updates
// on unmounted components.
const useMicrostore = (initialState) => {
    const mounted = react_1.useRef(true);
    const [state, rerender] = react_1.useState(initialState);
    const dispatch = react_1.useCallback((action) => {
        mounted.current && rerender(action);
    }, []);
    react_1.useEffect(() => {
        return () => {
            mounted.current = false;
        };
    }, []);
    return [state, dispatch];
};
exports.useMicrostore = useMicrostore;
//# sourceMappingURL=use-microstore.js.map