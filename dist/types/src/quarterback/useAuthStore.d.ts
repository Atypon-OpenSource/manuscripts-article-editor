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
import { Jwt } from '@manuscripts/quarterback-types';
declare type TrackUser = {
    id: string;
    name: string;
    color: string;
};
interface AuthState {
    user: TrackUser;
    jwt?: Jwt;
}
export declare const useAuthStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<Omit<AuthState, "logout" | "setUser" | "authenticate"> & {
    setUser(id?: string | undefined, name?: string | undefined): void;
    authenticate(): Promise<boolean>;
    logout(): void;
}>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<Omit<AuthState, "logout" | "setUser" | "authenticate"> & {
            setUser(id?: string | undefined, name?: string | undefined): void;
            authenticate(): Promise<boolean>;
            logout(): void;
        }, Partial<Omit<AuthState, "logout" | "setUser" | "authenticate"> & {
            setUser(id?: string | undefined, name?: string | undefined): void;
            authenticate(): Promise<boolean>;
            logout(): void;
        }>>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void>;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: Omit<AuthState, "logout" | "setUser" | "authenticate"> & {
            setUser(id?: string | undefined, name?: string | undefined): void;
            authenticate(): Promise<boolean>;
            logout(): void;
        }) => void) => () => void;
        onFinishHydration: (fn: (state: Omit<AuthState, "logout" | "setUser" | "authenticate"> & {
            setUser(id?: string | undefined, name?: string | undefined): void;
            authenticate(): Promise<boolean>;
            logout(): void;
        }) => void) => () => void;
    };
}>;
export {};
