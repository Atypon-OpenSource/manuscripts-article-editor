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
import { Build, ModelAttachment } from '@manuscripts/manuscript-transform';
import { Model } from '@manuscripts/manuscripts-json-schema';
import { PouchReplicationOptions, RxAttachmentCreator, RxCollection, RxDocument, RxReplicationState } from '@manuscripts/rxdb';
import { ConflictManager } from '@manuscripts/sync-client';
import { AxiosError } from 'axios';
import { CollectionName } from '../collections';
import { Database } from '../components/DatabaseProvider';
import { Store } from './SyncStore';
import { BulkDocsError, BulkDocsSuccess, Direction, PouchReplicationError } from './types';
import { ContainerIDs } from '../store';
export declare const isBulkDocsSuccess: (item: BulkDocsSuccess | BulkDocsError) => item is BulkDocsSuccess;
export declare const isBulkDocsError: (item: BulkDocsSuccess | BulkDocsError) => item is BulkDocsError;
export declare const isAxiosError: (error: Error | PouchReplicationError | AxiosError) => error is AxiosError<any>;
export declare const isReplicationError: (error: Error | PouchReplicationError | AxiosError) => error is PouchReplicationError;
export declare const promisifyReplicationState: (replicationState: RxReplicationState) => Promise<unknown>;
export declare const buildCollectionName: (name: string) => string;
export interface CollectionProps {
    collection: CollectionName;
    channels?: string[];
    db: Database;
}
export declare class Collection<T extends Model> {
    props: CollectionProps;
    collection?: RxCollection<T>;
    conflictManager?: ConflictManager;
    collectionName: string;
    private store?;
    private replications;
    constructor(props: CollectionProps, store?: Store);
    initialize(startSyncing?: boolean): Promise<void>;
    syncOnce(direction: Direction, options?: PouchReplicationOptions): Promise<void>;
    startSyncing(): Promise<void>;
    cancelReplications: () => void;
    ensurePushSync: () => Promise<void>;
    getCollection(): RxCollection<T>;
    find(queryObj?: Record<string, unknown>): import("@manuscripts/rxdb").RxQuery<T, RxDocument<T, {}>[]>;
    findOne(queryObj: string | Record<string, unknown>): import("@manuscripts/rxdb").RxQuery<T, RxDocument<T, {}> | null>;
    findDoc(id: string): Promise<RxDocument<T, {}>>;
    save(data: T | Partial<T> | Build<T>, ids?: ContainerIDs, external?: boolean): Promise<T>;
    requiredFields(external?: boolean): Partial<Model>;
    create(data: Build<T>, ids?: ContainerIDs, external?: boolean): Promise<import("@manuscripts/rxdb").RxDocumentTypeWithRev<T>>;
    update(id: string, data: Partial<T>, external?: boolean): Promise<T>;
    delete(id: string): Promise<string>;
    allAttachments: (id: string) => Promise<import("@manuscripts/rxdb").RxAttachment<T, {}>[]>;
    putAttachment: (id: string, attachment: RxAttachmentCreator) => Promise<import("@manuscripts/rxdb").RxAttachment<T, {}>>;
    getAttachment: (id: string, attachmentID: string) => Promise<import("@manuscripts/rxdb").RxAttachment<T, {}>>;
    getAttachmentAsString: (id: string, attachmentID: string) => Promise<string | undefined>;
    getAttachmentAsBlob: (id: string, attachmentID: string) => Promise<Blob | undefined>;
    removeAttachment: (id: string, attachmentID: string) => Promise<void>;
    bulkCreate(models: Array<Build<T> & ContainerIDs & ModelAttachment>): Promise<Array<BulkDocsSuccess | BulkDocsError>>;
    hasUnsyncedChanges(): Promise<boolean>;
    cleanupAndDestroy(): Promise<boolean>;
    private bulkDocs;
    private openCollection;
    private cancelReplication;
    private get bucketName();
    private sync;
    private handleSyncError;
    private dispatchWriteError;
    private dispatchSyncError;
    private dispatchActivity;
    private backupPush;
    private backupPullOnce;
    private atomicUpdate;
    private prepareUpdate;
    private broadcastPurge;
    private getRemoteUrl;
    private getBackupUrl;
}
