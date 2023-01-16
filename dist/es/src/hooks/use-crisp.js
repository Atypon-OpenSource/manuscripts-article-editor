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
exports.useCrisp = void 0;
const react_1 = require("react");
const useCrisp = () => {
    const open = react_1.useCallback((event) => {
        event && event.preventDefault();
        if (!window.$crisp) {
            return;
        }
        window.$crisp.push(['do', 'chat:open']);
    }, []);
    const setMessageText = react_1.useCallback((text) => {
        if (!window.$crisp) {
            return;
        }
        open();
        window.$crisp.push(['set', 'message:text', [text]]);
    }, [open]);
    const sendDiagnostics = react_1.useCallback((message, diagnostics) => {
        if (!window.$crisp) {
            return;
        }
        open();
        window.$crisp.push(['do', 'message:send', [message]]);
        window.$crisp.push(['do', 'message:send', ['text', diagnostics]]);
    }, [open]);
    return {
        open,
        setMessageText,
        sendDiagnostics,
    };
};
exports.useCrisp = useCrisp;
//# sourceMappingURL=use-crisp.js.map