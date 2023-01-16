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
import { ObjectTypes, Project } from '@manuscripts/manuscripts-json-schema';
import React from 'react';
import { ShowNotification } from '../components/NotificationProvider';
export declare enum SaveSnapshotStatus {
    Ready = "Ready",
    Submitting = "Submitting",
    GotResponse = "GotResponse",
    Saved = "Saved",
    Error = "Error"
}
interface SnapshotData {
    creator: string;
    key: string;
    proofs?: string[];
}
export declare const buildSnapshot: ({ creator, key, proofs }: SnapshotData, name: string) => {
    _id: string;
    objectType: ObjectTypes;
    creator: string;
    s3Id: string;
    proof: string[] | undefined;
    name: string;
};
export declare const useSnapshotManager: (project: Project, showNotification?: ShowNotification | undefined) => {
    textValue: string;
    requestTakeSnapshot: () => Promise<void>;
    handleTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    submitName: (e: React.SyntheticEvent) => void;
    status: SaveSnapshotStatus;
};
export {};
