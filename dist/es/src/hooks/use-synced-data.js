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
exports.useSyncedData = void 0;
const lodash_es_1 = require("lodash-es");
const react_1 = require("react");
const useSyncedData = (propValue, handleChange, wait = 1000) => {
    const [value, setValue] = react_1.useState(propValue);
    const [editing, setEditing] = react_1.useState(false);
    const propValueString = JSON.stringify(propValue);
    const previousPropValueString = react_1.useRef(propValueString);
    // update the value from the prop if it has changed and the input isn't focused
    react_1.useEffect(() => {
        if (propValueString !== previousPropValueString.current) {
            previousPropValueString.current = propValueString;
            if (!editing) {
                setValue(propValue);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [previousPropValueString, propValueString]);
    // update the value from the prop on blur
    react_1.useEffect(() => {
        if (!editing) {
            setValue(propValue);
        }
    }, [editing, propValue]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedHandleChange = react_1.useCallback(lodash_es_1.debounce(handleChange, wait), [
        handleChange,
        wait,
    ]);
    const handleLocalChange = react_1.useCallback((value) => {
        setValue(value);
        debouncedHandleChange(value);
    }, [debouncedHandleChange]);
    return [value, handleLocalChange, setEditing];
};
exports.useSyncedData = useSyncedData;
//# sourceMappingURL=use-synced-data.js.map