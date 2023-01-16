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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const channels_1 = require("../../channels");
const account_1 = require("../../lib/account");
const token_1 = __importDefault(require("../../lib/token"));
const user_id_1 = __importDefault(require("../../lib/user-id"));
const DatabaseProvider_1 = require("../DatabaseProvider");
const Page_1 = require("../Page");
class LogoutPageContainer extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            error: null,
        };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield account_1.logout();
                token_1.default.remove();
                user_id_1.default.remove();
                window.location.assign('/login#action=logout');
                yield channels_1.channels.logout.postMessage('LOGOUT');
            }
            catch (error) {
                console.error('Error while performing logout tasks', error);
                this.setState({ error });
            }
        });
    }
    render() {
        const { error } = this.state;
        return (react_1.default.createElement(Page_1.Page, null,
            react_1.default.createElement(Page_1.Main, null, error && (react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.error }, error.message)))));
    }
}
exports.default = DatabaseProvider_1.withDatabase(LogoutPageContainer);
//# sourceMappingURL=LogoutPageContainer.js.map