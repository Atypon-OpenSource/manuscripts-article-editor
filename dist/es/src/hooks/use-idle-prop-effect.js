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
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDebouncedEffect = exports.useIdlePropEffect = void 0;
const lodash_es_1 = require("lodash-es");
const react_1 = require("react");
// This effect will fire "time" milliseconds after the last time "deps" change,
// and will reset the timer every time the deps continue to change.
const useIdlePropEffect = (effect, deps, delay) => {
    const savedEffect = react_1.useRef();
    react_1.useEffect(() => {
        savedEffect.current = effect;
    }, [effect]);
    react_1.useEffect(() => {
        const fire = () => {
            savedEffect.current && savedEffect.current();
        };
        const id = setTimeout(fire, delay);
        return () => {
            clearTimeout(id);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, delay]);
};
exports.useIdlePropEffect = useIdlePropEffect;
const useDebouncedEffect = (callback, delay) => {
    return react_1.useMemo(() => {
        lodash_es_1.debounce(callback, delay);
    }, [callback, delay]);
};
exports.useDebouncedEffect = useDebouncedEffect;
//# sourceMappingURL=use-idle-prop-effect.js.map