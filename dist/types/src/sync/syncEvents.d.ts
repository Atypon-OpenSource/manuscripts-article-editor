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
import { AxiosError } from 'axios';
import { Action, CollectionMeta, CollectionState, ErrorEvent, PouchReplicationError, SyncState } from './types';
export declare enum CONSTANTS {
    INIT = "INIT",
    OPEN = "OPEN",
    COMPLETE = "COMPLETE",
    PULL_FAILED = "PULL_FAILED",
    ERROR = "ERROR",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    CANCEL = "CANCEL",
    RESET_ERRORS = "RESET_ERRORS",
    CLOSE = "CLOSE"
}
export declare const actions: {
    open: (collectionName: string, meta: CollectionMeta) => Action;
    replicationComplete: (collectionName: string, direction: 'push' | 'pull') => Action;
    initialPullFailed: (collectionName: string) => Action;
    writeError: (collectionName: string, operation: string, error: Error) => Action;
    active: (collectionName: string, direction: 'push' | 'pull', active: boolean) => Action;
    cancel: (collectionName: string) => {
        type: CONSTANTS;
        collectionName: string;
        payload: {};
    };
    syncError: (collectionName: string, direction: 'push' | 'pull' | 'unknown', error: AxiosError | PouchReplicationError | Error) => Action;
    resetErrors: () => Action;
    close: (collectionName: string, success: boolean) => {
        type: CONSTANTS;
        collectionName: string;
        payload: {
            success: boolean;
            broadcast: boolean;
            sessionId: string;
        };
    };
};
export declare const selectors: {
    isInitialPullComplete: (collectionName: string, state: SyncState) => boolean | {
        meta: CollectionMeta;
        state: CollectionState;
    };
    isPushing: (collectionName: string, state: SyncState) => boolean;
    hasPullError: (collectionName: string, state: SyncState) => boolean;
    allErrors: (state: SyncState) => ErrorEvent[];
    errorReport: (state: SyncState) => {
        error: Error | PouchReplicationError | AxiosError<any>;
        timestamp: number;
        direction: string | undefined;
        operation: string | undefined;
        collectionName: string | undefined;
    }[];
    newErrors: (state: SyncState) => ErrorEvent[];
    oneZombie: (state: SyncState) => string | undefined;
    notClosed: (state: SyncState) => string[];
};
declare const _default: (state: SyncState, action?: Action | undefined) => SyncState;
export default _default;
