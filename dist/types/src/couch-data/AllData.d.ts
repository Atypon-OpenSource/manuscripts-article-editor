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
import { Model } from '@manuscripts/manuscripts-json-schema';
import { RxDatabase, RxDocument } from '@manuscripts/rxdb';
import { Subscription } from 'rxjs';
import { TokenData } from '../store/TokenData';
import { SyncState } from '../sync/types';
import { Biblio } from './Bibilo';
import ModelManager from './ModelManager';
interface Props {
    manuscriptID: string;
    projectID: string;
    userID: string;
    db: RxDatabase<any>;
}
export declare type State = Record<string, any>;
declare class RxDBDataBridge {
    listeners: Set<(data: State) => void>;
    state: State;
    tokenData: TokenData;
    projectID: string;
    userID: string | undefined;
    userProfileID: string | undefined;
    manuscriptID: string;
    db: RxDatabase<any>;
    sub: {
        unsubscribe: () => void;
    };
    rxSubscriptions: Subscription[];
    modelManager: ModelManager;
    private expectedState;
    collectionListenerState: SyncState;
    biblio: Biblio;
    constructor(props: Props);
    initCollection(collection: string, channels?: string[]): Promise<import("../sync/Collection").Collection<Model>>;
    init(): Promise<unknown>;
    initSyncStateStatus: () => void;
    getData: () => Promise<{
        [x: string]: any;
    }>;
    reload(manuscriptID: string, projectID: string, userID: string): Promise<unknown> | undefined;
    destroy(): void;
    setState: (arg: State | ((data: State) => State)) => void;
    dispatch: () => void;
    onUpdate: (fn: (data: State) => void) => () => boolean;
    omniHandler: (type: string) => <T>(doc: RxDocument<T, {}> | null) => Promise<void>;
    omniMapHandler: (type: string) => <T extends Model>(docs: RxDocument<T, {}>[]) => Promise<void>;
    private expect;
    omniArrayHandler: (type: string) => <T extends Model>(docs: RxDocument<T, {}>[]) => Promise<void>;
    cc: <T extends Model>(collectionName?: string) => import("../sync/Collection").Collection<T>;
    private dependsOnStateCondition;
    private subscribe;
}
export default RxDBDataBridge;
