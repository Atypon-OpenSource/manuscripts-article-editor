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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = exports.buildCollectionName = exports.promisifyReplicationState = exports.isReplicationError = exports.isAxiosError = exports.isBulkDocsError = exports.isBulkDocsSuccess = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const rxdb_1 = require("@manuscripts/rxdb");
const sync_client_1 = require("@manuscripts/sync-client");
const axios_1 = __importDefault(require("axios"));
const pouchdb_generate_replication_id_1 = __importDefault(require("pouchdb-generate-replication-id"));
const uuid_1 = require("uuid");
const collections_1 = require("../collections");
const config_1 = __importDefault(require("../config"));
const session_id_1 = __importDefault(require("../lib/session-id"));
const syncEvents_1 = require("./syncEvents");
const externalSessionID = uuid_1.v4();
const isBulkDocsSuccess = (item) => {
    return 'ok' in item && item.ok === true;
};
exports.isBulkDocsSuccess = isBulkDocsSuccess;
const isBulkDocsError = (item) => {
    return 'error' in item && item.error;
};
exports.isBulkDocsError = isBulkDocsError;
const isAxiosError = (error) => {
    return 'isAxiosError' in error && error.isAxiosError;
};
exports.isAxiosError = isAxiosError;
const isReplicationError = (error) => {
    return Boolean('result' in error &&
        error.result &&
        'status' in error.result &&
        error.result.status);
};
exports.isReplicationError = isReplicationError;
const promisifyReplicationState = (replicationState) => new Promise((resolve, reject) => {
    replicationState.complete$.subscribe((complete) => {
        if (complete) {
            resolve(true);
        }
    });
    replicationState.error$.subscribe((error) => {
        if (error) {
            reject(error);
        }
    });
});
exports.promisifyReplicationState = promisifyReplicationState;
// TODO: hash?
const buildCollectionName = (name) => name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
exports.buildCollectionName = buildCollectionName;
const fetchWithCredentials = (url, opts = {}) => rxdb_1.PouchDB.fetch(url, Object.assign(Object.assign({}, opts), { credentials: 'include' }));
class Collection {
    constructor(props, store) {
        this.cancelReplications = () => {
            this.replications.map((replicationState) => {
                if (replicationState) {
                    this.cancelReplication(replicationState);
                }
            });
            this.replications = [];
            this.store && this.store.dispatch(syncEvents_1.actions.cancel(this.collectionName));
        };
        this.ensurePushSync = () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.cancelReplications();
                yield this.syncOnce('push', { live: false, retry: false });
                yield this.startSyncing();
                return;
            }
            catch (error) {
                this.dispatchSyncError('push', error);
            }
        });
        this.allAttachments = (id) => __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.findDoc(id);
            try {
                return doc.allAttachments();
            }
            catch (_a) {
                return []; // RxDB throws an error if there aren't any attachments
            }
        });
        this.putAttachment = (id, attachment) => __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield this.findDoc(id);
                return doc.putAttachment(attachment);
            }
            catch (e) {
                this.dispatchWriteError('putAttachment', e);
                throw e;
            }
        });
        this.getAttachment = (id, attachmentID) => __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.findDoc(id);
            const attachment = doc.getAttachment(attachmentID);
            if (!attachment) {
                throw new Error('Attachment not found');
            }
            return attachment;
        });
        this.getAttachmentAsString = (id, attachmentID) => __awaiter(this, void 0, void 0, function* () {
            const attachment = yield this.getAttachment(id, attachmentID);
            return attachment ? attachment.getStringData() : undefined;
        });
        this.getAttachmentAsBlob = (id, attachmentID) => __awaiter(this, void 0, void 0, function* () {
            const attachment = yield this.getAttachment(id, attachmentID);
            return attachment ? attachment.getData() : undefined;
        });
        this.removeAttachment = (id, attachmentID) => __awaiter(this, void 0, void 0, function* () {
            try {
                const attachment = yield this.getAttachment(id, attachmentID);
                return attachment.remove();
            }
            catch (e) {
                this.dispatchWriteError('removeAttachment', e);
                throw e;
            }
        });
        this.openCollection = (name) => __awaiter(this, void 0, void 0, function* () {
            const { db } = this.props;
            // remove suffix of project data collection name
            const definitionName = name.replace(/_.+/, '');
            const collection = db[name];
            return (collection || db.collection(Object.assign(Object.assign({}, collections_1.collections[definitionName]), { name })));
        });
        this.cancelReplication = (replication) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield replication.cancel();
            }
            catch (error) {
                this.dispatchSyncError('unknown', error);
            }
        });
        this.atomicUpdate = (prev, data, external = false) => __awaiter(this, void 0, void 0, function* () {
            const update = this.prepareUpdate(data, external);
            return prev.atomicUpdate((doc) => {
                Object.entries(update).forEach(([key, value]) => {
                    ;
                    doc[key] = value;
                });
                return doc;
            });
        });
        this.prepareUpdate = (data, external = false) => {
            // https://github.com/Microsoft/TypeScript/pull/13288
            const _a = data, { _id, _rev } = _a, rest = __rest(_a, ["_id", "_rev"]);
            return Object.assign(Object.assign({}, rest), { updatedAt: manuscript_transform_1.timestamp(), sessionID: external ? externalSessionID : session_id_1.default });
        };
        this.broadcastPurge = (id, rev) => {
            if (config_1.default.backupReplication.path) {
                axios_1.default.post(this.getBackupUrl(), { [id]: [rev] }).catch((error) => {
                    this.dispatchSyncError('unknown', error);
                });
            }
        };
        this.getRemoteUrl = () => {
            return `${config_1.default.gateway.url}/${this.bucketName}`;
        };
        this.getBackupUrl = () => {
            if (!config_1.default.backupReplication.path) {
                throw new Error('Backup replication URL not configured');
            }
            const bucketPath = this.bucketName === 'projects' ? this.collectionName : this.bucketName;
            return `${window.location.origin}${config_1.default.backupReplication.path}/${bucketPath}`;
        };
        this.collectionName = exports.buildCollectionName(props.collection);
        this.props = props;
        this.replications = [];
        this.store = store;
    }
    initialize(startSyncing = true) {
        return __awaiter(this, void 0, void 0, function* () {
            this.collection = yield this.openCollection(this.collectionName);
            this.collection.preRemove((plainData) => {
                plainData.sessionID = session_id_1.default;
            }, false);
            this.conflictManager = new sync_client_1.ConflictManager(this.collection, this.broadcastPurge);
            const pouch = this.collection.pouch;
            pouch.setMaxListeners(50);
            // one-time pull from backup on initialization
            if (config_1.default.native && config_1.default.backupReplication.path) {
                yield this.backupPullOnce({
                    retry: false,
                    live: false,
                });
                // continuous push to backup
                this.backupPush({
                    live: true,
                    retry: true,
                });
            }
            if (startSyncing) {
                this.startSyncing().catch((error) => {
                    this.dispatchSyncError('pull', error);
                });
            }
            if (this.store) {
                this.store.dispatch(syncEvents_1.actions.open(this.collectionName, {
                    remoteUrl: this.getRemoteUrl(),
                    backupUrl: config_1.default.backupReplication.path ? this.getBackupUrl() : '',
                    channels: this.props.channels || [],
                    isProject: this.collectionName.startsWith('project_'),
                }));
            }
        });
    }
    syncOnce(direction, options = {}) {
        const replicationState = this.sync(direction, Object.assign(Object.assign({}, options), { live: false, retry: false }));
        if (!replicationState) {
            return Promise.resolve();
        }
        return exports.promisifyReplicationState(replicationState).then(() => {
            return;
        });
    }
    startSyncing() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: need to know if initial push failed?
            // await this.syncOnce('push')
            try {
                yield this.syncOnce('pull');
                this.store &&
                    this.store.dispatch(syncEvents_1.actions.replicationComplete(this.collectionName, 'pull'));
            }
            catch (e) {
                if (this.store) {
                    this.store.dispatch(syncEvents_1.actions.initialPullFailed(this.collectionName));
                }
                else {
                    throw e;
                }
            }
            this.replications = [
                // start ongoing pull sync
                this.sync('pull', {
                    live: true,
                    retry: true,
                }),
                // start ongoing push sync
                this.sync('push', {
                    live: true,
                    retry: true,
                }),
            ];
        });
    }
    getCollection() {
        if (!this.collection) {
            throw new Error('Collection not initialized');
        }
        return this.collection;
    }
    find(queryObj) {
        return this.getCollection().find(queryObj);
    }
    findOne(queryObj) {
        return this.getCollection().findOne(queryObj);
    }
    findDoc(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.findOne(id).exec();
            if (!doc) {
                throw new Error(`Document ${id} not found`);
            }
            return doc;
        });
    }
    save(data, ids, external = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = data._id ? yield this.findOne(data._id).exec() : null;
            return doc
                ? this.update(doc._id, data, external)
                : this.create(data, ids, external);
        });
    }
    requiredFields(external = false) {
        const createdAt = manuscript_transform_1.timestamp();
        return {
            createdAt,
            updatedAt: createdAt,
            sessionID: external ? externalSessionID : session_id_1.default,
        };
    }
    create(data, ids, external = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = Object.assign(Object.assign(Object.assign({}, data), this.requiredFields(external)), ids);
            try {
                const result = yield this.getCollection().insert(model);
                return result.toJSON();
            }
            catch (e) {
                this.dispatchWriteError('create', e);
                throw e;
            }
        });
    }
    update(id, data, external = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield this.findDoc(id);
                const result = yield this.atomicUpdate(doc, data, external);
                return result.toJSON();
            }
            catch (e) {
                this.dispatchWriteError('update', e);
                throw e;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield this.findOne(id).exec();
                if (doc) {
                    yield doc.remove();
                }
                return id;
            }
            catch (e) {
                this.dispatchWriteError('delete', e);
                throw e;
            }
        });
    }
    bulkCreate(models) {
        return __awaiter(this, void 0, void 0, function* () {
            const requiredFields = this.requiredFields();
            // save the models
            const items = [];
            for (const model of models) {
                const { attachment } = model, data = __rest(model, ["attachment"]);
                const item = Object.assign(Object.assign({}, data), requiredFields);
                items.push(item);
            }
            const results = yield this.bulkDocs(items);
            // attach attachments
            for (const model of models) {
                if (model.attachment) {
                    yield this.putAttachment(model._id, model.attachment);
                }
            }
            return results;
        });
    }
    hasUnsyncedChanges() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.bucketName) {
                return false;
            }
            const syncErrors = yield this.conflictManager.getSyncErrors();
            if (syncErrors && syncErrors.length) {
                return true;
            }
            const remote = this.getRemoteUrl();
            try {
                const id = yield pouchdb_generate_replication_id_1.default(this.collection.pouch, new rxdb_1.PouchDB(remote, {
                    adapter: 'http',
                }), {});
                const localSyncDoc = yield this.collection.pouch.get(id);
                const { last_seq } = localSyncDoc;
                const changes = yield this.collection.pouch.changes({ since: last_seq });
                return !!changes.results.length;
            }
            catch (e) {
                return true;
            }
        });
    }
    cleanupAndDestroy() {
        return __awaiter(this, void 0, void 0, function* () {
            // fire-and-forget. Errors will be dispatched the Store
            // eslint-disable-next-line promise/valid-params
            try {
                yield this.syncOnce('pull', { live: false, retry: false });
                if (yield this.hasUnsyncedChanges()) {
                    yield this.syncOnce('push', { live: false, retry: false });
                }
                this.cancelReplications();
                // TODO: destroy the collection
                // this is only needed to free up memory
                // doing this now causes a conflict in MPUserProject the next
                // time the project is opened, so apparently some writing is still
                // happening while the project is being closed
                // if (this.collection) {
                //   await this.collection.destroy()
                // }
                this.store &&
                    this.store.dispatch(syncEvents_1.actions.close(this.collectionName, true));
                return true;
            }
            catch (e) {
                this.store &&
                    this.store.dispatch(syncEvents_1.actions.close(this.collectionName, false));
                return false;
            }
        });
    }
    bulkDocs(docs) {
        return this.getCollection().pouch.bulkDocs(docs);
    }
    get bucketName() {
        switch (this.collectionName) {
            case 'collaborators':
                return config_1.default.buckets.derived_data;
            default:
                return config_1.default.buckets.projects;
        }
    }
    sync(direction, options = {}, isRetry = false) {
        if (direction === 'pull') {
            if (this.props.channels && this.props.channels.length) {
                options.query_params = {
                    filter: 'sync_gateway/bychannel',
                    channels: this.props.channels,
                };
            }
        }
        options.fetch = fetchWithCredentials;
        const remote = this.getRemoteUrl();
        const replicationState = this.getCollection().sync({
            remote,
            waitForLeadership: false,
            direction: {
                pull: direction === 'pull',
                push: direction === 'push',
            },
            options: Object.assign({ back_off_function: (delay) => {
                    if (delay === 0) {
                        return 4000 + Math.random() * 2000;
                    }
                    return delay * 2;
                } }, options),
        });
        this.dispatchActivity(direction, true);
        // TODO - if we need this, debounce it? Too many updates for a centralized store
        // to handle
        // replicationState.active$.subscribe(value => {
        //   this.dispatchActivity(direction, value)
        // })
        // replicationState.alive$.subscribe((alive: boolean) => {
        //   // TODO: handle dead connection
        // })
        // When pouch tries to replicate multiple documents
        replicationState.change$.subscribe((changeInfo) => {
            const { docs, errors } = changeInfo;
            this.conflictManager.saveSyncState(errors, docs).catch((error) => {
                throw error;
            });
            errors.forEach((e) => this.dispatchSyncError(direction, e));
        });
        replicationState.complete$.subscribe((result) => __awaiter(this, void 0, void 0, function* () {
            const completed = result && result.ok;
            if (completed) {
                yield this.cancelReplication(replicationState);
            }
        }));
        // When pouch tries to replicate a single document
        replicationState.denied$.subscribe((error) => {
            this.conflictManager.saveSyncState([error], []).catch((error) => {
                throw error;
            });
            this.dispatchSyncError(direction, error);
        });
        replicationState.error$.subscribe((error) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.handleSyncError(error, direction);
                if (isRetry) {
                    this.dispatchSyncError(direction, error);
                }
                else {
                    // cancel this replication
                    yield this.cancelReplication(replicationState);
                    this.sync(direction, options, true);
                }
            }
            catch (error) {
                this.dispatchSyncError(direction, error);
                // this.setStatus(direction, 'complete', true)
            }
        }));
        return replicationState;
    }
    handleSyncError(error, direction) {
        if (direction === 'push') {
            if (error.error === 'conflict' && error.result && error.result.errors) {
                const conflicts = error.result.errors
                    .filter((e) => e.error === 'conflict')
                    .map(({ id, rev }) => ({ id, rev }));
                return this.conflictManager.handleConflicts(conflicts);
            }
        }
        throw error;
    }
    dispatchWriteError(type, error) {
        if (this.store) {
            this.store.dispatch(syncEvents_1.actions.writeError(this.collectionName, type, error));
        }
        else {
            throw error;
        }
    }
    dispatchSyncError(direction, error) {
        if (this.store) {
            this.store.dispatch(syncEvents_1.actions.syncError(this.collectionName, direction, error));
        }
        else {
            throw error;
        }
    }
    dispatchActivity(direction, status) {
        if (this.store) {
            this.store.dispatch(syncEvents_1.actions.active(this.collectionName, direction, status));
        }
    }
    backupPush(options) {
        return this.getCollection().sync(Object.assign(Object.assign({}, options), { remote: this.getBackupUrl(), direction: {
                push: true,
                pull: false,
            } }));
    }
    backupPullOnce(options) {
        return exports.promisifyReplicationState(this.getCollection().sync({
            options,
            remote: this.getBackupUrl(),
            direction: {
                push: false,
                pull: true,
            },
        }));
    }
}
exports.Collection = Collection;
//# sourceMappingURL=Collection.js.map