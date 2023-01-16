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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericStore = void 0;
const _1 = require(".");
const DEFAULT_ACTION = '_'; // making actions optional
const defaultReducer = (payload, store, action) => {
    return Object.assign(Object.assign({}, store), payload);
};
class GenericStore {
    constructor(reducer = defaultReducer, unmountHandler, state = {}) {
        this.queue = new Set();
        this.init = (sources) => __awaiter(this, void 0, void 0, function* () {
            this.sources = sources;
            const state = yield _1.buildStateFromSources(sources, this.setState);
            this.setState(Object.assign(Object.assign({}, this.state), state));
            // listening to changes before state applied
            this.beforeAction = (action, payload, store, setState) => {
                // @TODO provide the chance for the data sources to cancel the action optionally
                // by default the actions are not supposed to be cancelled
                this.sources.map((source) => source.beforeAction &&
                    source.beforeAction(action, payload, store, setState));
                return { action, payload };
            };
            this.sources.forEach(
            // update store is needed to pass setState function to a registered DataSource strategy. The naming is not very forunate
            // if you are looking for a way to listen to the data changes in the store from inside data source, use beforeAction
            (source) => source.updateStore && source.updateStore(this.setState));
            // listening to changes after state applied
            this.sources.map((source) => {
                if (source.afterAction) {
                    this.subscribe(() => source.afterAction && source.afterAction(this.state, this.setState));
                }
            });
        });
        this.reducer = reducer;
        if (state) {
            this.state = state;
        }
        if (unmountHandler) {
            this.unmountHandler = unmountHandler;
        }
        this.dispatchQueue = this.dispatchQueue.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.dispatchAction = this.dispatchAction.bind(this);
        this.setState = this.setState.bind(this);
        this.getState = this.getState.bind(this);
        // this.state = buildStateFromSources(source)
    }
    getState() {
        return this.state;
    }
    setState(state) {
        if (typeof state === 'function') {
            this.state = state(this.state);
        }
        else {
            this.state = Object.assign(Object.assign({}, this.state), state);
        }
        this.dispatchQueue();
    }
    dispatchQueue() {
        this.queue.forEach((fn) => fn(this.state));
    }
    subscribe(fn) {
        const queue = this.queue;
        queue.add(fn);
        return function unsubscribe() {
            queue.delete(fn);
        };
    }
    dispatchAction(_a) {
        var { action = DEFAULT_ACTION } = _a, payload = __rest(_a, ["action"]);
        const beforeActionFilter = this.beforeAction(action, payload, this.state, this.setState);
        if (beforeActionFilter) {
            this.setState(this.reducer(beforeActionFilter.payload, this.state, beforeActionFilter.action || ''));
        }
        // return new Promise((resolve: () => void, reject) => {
        //   setTimeout(() => {
        //     resolve()
        //   }, 5000)
        // })
    }
    unmount() {
        if (this.unmountHandler) {
            this.unmountHandler(this.state);
        }
        if (this.sources) {
            this.sources.forEach((source) => source.unmount && source.unmount());
        }
        this.sources = [];
        this.state = {};
        this.queue = new Set();
    }
}
exports.GenericStore = GenericStore;
//# sourceMappingURL=Store.js.map