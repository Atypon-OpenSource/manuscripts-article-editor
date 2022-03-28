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
const config_1 = __importDefault(require("../config"));
const Collection_1 = require("./Collection");
const onIdle_1 = require("./onIdle");
const syncEvents_1 = require("./syncEvents");
const { local } = config_1.default;
const NullStore = () => ({
    dispatch: () => {
        return;
    },
    getState: () => {
        return {};
    },
});
class CollectionManager {
    constructor() {
        this.collections = new Map();
        this.store = NullStore();
        window.restartSync = () => {
            return this.restartAll();
        };
        onIdle_1.onIdle(() => {
            this.collections.forEach((collection) => {
                // eslint-disable-next-line promise/valid-params
                collection.cancelReplications();
            });
            return true;
        }, () => {
            this.collections.forEach((collection) => {
                // eslint-disable-next-line promise/valid-params
                collection.startSyncing().catch((err) => {
                    this.store.dispatch(syncEvents_1.actions.syncError(collection.collectionName, 'pull', err));
                });
            });
            return true;
        });
    }
    listen(store) {
        this.store = store;
    }
    unlisten() {
        this.store = NullStore();
    }
    createCollection(props) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.db) {
                this.db = props.db;
            }
            const collection = new Collection_1.Collection(props, this.store);
            this.collections.set(props.collection, collection);
            yield collection.initialize(!local);
            return collection;
        });
    }
    getCollection(collection) {
        if (!this.collections.has(collection)) {
            throw new Error('Missing collection: ' + collection);
        }
        return this.collections.get(collection);
    }
    removeCollection(collectionName) {
        const collection = this.collections.get(collectionName);
        if (!collection) {
            return;
        }
        // swallow at catch, all possible errors are handled within cleanupAndDestroy
        collection.cleanupAndDestroy().catch((err) => {
            this.store.dispatch(syncEvents_1.actions.syncError(collectionName, 'unknown', err));
        });
    }
    restartAll() {
        // fire-and-forget: Errors will bubble into the sync store
        // eslint-disable-next-line promise/valid-params
        ;
        (() => __awaiter(this, void 0, void 0, function* () {
            this.store.dispatch(syncEvents_1.actions.resetErrors());
            yield this.pushCollections(['user']);
            for (const parts of this.collections) {
                const collection = parts[1];
                yield collection.cancelReplications();
                yield collection.startSyncing();
            }
        }))().catch();
    }
    unsyncedCollections() {
        // do ANY collections have unsynced changes?
        return Promise.all(Array.from(this.collections.entries()).map(([key, collection]) => collection.hasUnsyncedChanges().then((result) => (result ? key : null)))).then((results) => results.filter(Boolean));
    }
    pushCollections(collections) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const key of collections) {
                const collection = this.collections.get(key);
                if (!collection) {
                    continue;
                }
                yield collection.cancelReplications();
                yield collection.syncOnce('pull');
                yield collection.syncOnce('push');
            }
        });
    }
    cleanupAndDestroyAll() {
        const state = this.store.getState();
        return Promise.all(syncEvents_1.selectors
            .notClosed(state)
            .map((collectionName) => this.getCollection(collectionName).cleanupAndDestroy()));
    }
    killOneZombie() {
        return __awaiter(this, void 0, void 0, function* () {
            const state = this.store.getState();
            const collectionName = syncEvents_1.selectors.oneZombie(state);
            if (!collectionName) {
                return;
            }
            if (this.collections.has(collectionName)) {
                this.getCollection(collectionName).cleanupAndDestroy();
            }
            else if (this.db) {
                const { meta } = state[collectionName];
                const collection = new Collection_1.Collection({
                    collection: collectionName,
                    channels: meta.channels,
                    db: this.db,
                });
                yield collection.initialize(false);
                yield collection.cleanupAndDestroy();
            }
        });
    }
}
const collectionManager = new CollectionManager();
const RESYNC_RATE = 15 * 1000;
setInterval(() => collectionManager.killOneZombie(), RESYNC_RATE);
exports.default = collectionManager;
//# sourceMappingURL=CollectionManager.js.map