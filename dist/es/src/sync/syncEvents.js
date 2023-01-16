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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectors = exports.actions = exports.CONSTANTS = void 0;
const lodash_es_1 = require("lodash-es");
const session_id_1 = __importDefault(require("../lib/session-id"));
const Collection_1 = require("./Collection");
var CONSTANTS;
(function (CONSTANTS) {
    CONSTANTS["INIT"] = "INIT";
    CONSTANTS["OPEN"] = "OPEN";
    CONSTANTS["COMPLETE"] = "COMPLETE";
    CONSTANTS["PULL_FAILED"] = "PULL_FAILED";
    CONSTANTS["ERROR"] = "ERROR";
    CONSTANTS["ACTIVE"] = "ACTIVE";
    CONSTANTS["INACTIVE"] = "INACTIVE";
    CONSTANTS["CANCEL"] = "CANCEL";
    CONSTANTS["RESET_ERRORS"] = "RESET_ERRORS";
    CONSTANTS["CLOSE"] = "CLOSE";
})(CONSTANTS = exports.CONSTANTS || (exports.CONSTANTS = {}));
const c = CONSTANTS;
const blankCollection = (meta) => ({
    meta,
    state: {
        firstPullComplete: false,
        push: null,
        pull: null,
        backupPullComplete: false,
        backupPush: null,
        errors: [],
        errorDocIds: [],
        closed: false,
    },
});
exports.actions = {
    open: (collectionName, meta) => {
        return {
            type: c.OPEN,
            collectionName,
            payload: {
                meta,
            },
        };
    },
    replicationComplete: (collectionName, direction) => {
        return {
            type: c.COMPLETE,
            collectionName,
            payload: {
                direction,
            },
        };
    },
    initialPullFailed: (collectionName) => {
        return {
            type: c.PULL_FAILED,
            collectionName,
            payload: {},
        };
    },
    writeError: (collectionName, operation, error) => {
        return {
            type: c.ERROR,
            collectionName,
            payload: {
                operation,
                error,
                timestamp: Date.now() / 1000,
            },
        };
    },
    active: (collectionName, direction, active) => {
        if (active) {
            return {
                type: c.ACTIVE,
                collectionName,
                payload: {
                    direction,
                },
            };
        }
        return {
            type: c.INACTIVE,
            collectionName,
            payload: {
                direction,
            },
        };
    },
    cancel: (collectionName) => {
        return {
            type: c.CANCEL,
            collectionName,
            payload: {},
        };
    },
    syncError: (collectionName, direction, error) => {
        return {
            type: c.ERROR,
            collectionName,
            payload: {
                direction,
                error,
                timestamp: Date.now() / 1000,
            },
        };
    },
    resetErrors: () => {
        return {
            type: c.RESET_ERRORS,
            collectionName: 'all',
            payload: {},
        };
    },
    close: (collectionName, success) => {
        return {
            type: c.CLOSE,
            collectionName,
            payload: {
                success,
                // broadcast to other tabs IF this is now a zombie
                broadcast: true,
                sessionId: session_id_1.default,
            },
        };
    },
};
const StateData = (key, defaultVal) => (collectionName, state) => {
    return lodash_es_1.get(state, `${Collection_1.buildCollectionName(collectionName)}.state.${key}`, defaultVal);
};
exports.selectors = {
    isInitialPullComplete: StateData('firstPullComplete', false),
    isPushing: (collectionName, state) => {
        const push = StateData('push', null)(collectionName, state);
        return push === 'active';
    },
    hasPullError: (collectionName, state) => {
        const firstPullComplete = StateData('firstPullComplete', false)(collectionName, state);
        return firstPullComplete === 'error';
    },
    allErrors: (state) => {
        return Object.keys(state).reduce((collectedErrors, collectionName) => collectedErrors.concat(state[collectionName].state.errors), []);
    },
    errorReport: (state) => {
        return exports.selectors
            .allErrors(state)
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((event) => ({
            error: event.error,
            timestamp: event.timestamp,
            direction: event.direction,
            operation: event.operation,
            collectionName: event.collectionName,
        }));
    },
    // SELECTORS TO IMPLEMENT
    newErrors: (state) => {
        return exports.selectors
            .allErrors(state)
            .filter((error) => !error.ack)
            .sort((a, b) => a.timestamp - b.timestamp);
    },
    oneZombie: (state) => {
        return Object.keys(state).find((collection) => state[collection].state.closed === 'zombie');
    },
    notClosed: (state) => {
        return Object.keys(state).filter((collection) => state[collection].state.closed !== true);
    },
};
const updateCollection = (collectionName, initialState, updates) => {
    return Object.assign(Object.assign({}, initialState), { [collectionName]: {
            meta: initialState[collectionName].meta,
            state: Object.assign(Object.assign({}, initialState[collectionName].state), updates),
        } });
};
const appendError = (collectionName, initialState, error) => {
    const nextErrors = [...initialState[collectionName].state.errors, error];
    return updateCollection(collectionName, initialState, {
        errors: nextErrors,
    });
};
/* tslint:disable:cyclomatic-complexity */
exports.default = (state, action) => {
    if (!action || !action.type || !action.collectionName) {
        return state;
    }
    const { collectionName, type } = action;
    if (!collectionName) {
        return state;
    }
    if (type === c.OPEN) {
        return Object.assign(Object.assign({}, state), { [collectionName]: blankCollection(action.payload.meta) });
    }
    if (!state[collectionName] && collectionName !== 'all') {
        return state;
    }
    switch (type) {
        case c.COMPLETE: {
            return updateCollection(collectionName, state, action.payload.direction === 'pull'
                ? {
                    firstPullComplete: true,
                    pull: 'ready',
                }
                : {
                    push: 'ready',
                });
        }
        case c.PULL_FAILED: {
            return updateCollection(collectionName, state, {
                firstPullComplete: 'error',
            });
        }
        case c.ACTIVE: {
            return updateCollection(collectionName, state, action.payload.direction === 'pull'
                ? { pull: 'active' }
                : { push: 'active' });
        }
        case c.INACTIVE: {
            return updateCollection(collectionName, state, action.payload.direction === 'pull'
                ? { pull: 'ready' }
                : { push: 'ready' });
        }
        case c.CANCEL: {
            return updateCollection(collectionName, state, {
                push: 'cancelled',
                pull: 'cancelled',
            });
        }
        case c.ERROR: {
            const event = {
                error: action.payload.error,
                direction: action.payload.direction,
                operation: action.payload.operation,
                timestamp: action.payload.timestamp,
                collectionName,
                ack: false,
            };
            return appendError(collectionName, state, event);
        }
        case c.RESET_ERRORS: {
            return Object.keys(state).reduce((nextState, collectionName) => updateCollection(collectionName, nextState, {
                errors: state[collectionName].state.errors.map((error) => (Object.assign(Object.assign({}, error), { ack: true }))),
            }), state);
        }
        case c.CLOSE: {
            return updateCollection(collectionName, state, {
                closed: action.payload.success ? true : 'zombie',
            });
        }
    }
    return state;
};
//# sourceMappingURL=syncEvents.js.map