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
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2022 Atypon Systems LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentObserver = void 0;
class ParentObserver {
    constructor() {
        this.observer = undefined;
        this.onUpdate = (observer) => {
            this.observer = observer;
        };
        this.update = (partialState) => {
            if (this.observer) {
                this.observer(partialState);
            }
        };
        this.storeObserver = (state) => {
            this.storeListener && this.storeListener(state); // storeListener shoudldn't be directly assigned to storeObserver to avoid potential order of execution problems
        };
        this.onStoreInternalUpdate = (fn) => {
            // it's supposed to be listened by the parent so there is only a single listener
            this.storeListener = fn;
        };
        this.detach = () => {
            this.storeListener = undefined;
            this.observer = undefined;
        };
    }
}
exports.ParentObserver = ParentObserver;
//# sourceMappingURL=ParentObserver.js.map