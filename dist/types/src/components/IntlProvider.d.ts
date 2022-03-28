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
import React from 'react';
interface Messages {
    error?: string;
    manuscripts?: string;
    manage_account?: string;
    preferences?: string;
    sign_in?: string;
    sign_out?: string;
    empty_manuscripts?: string;
    import_manuscript?: string;
}
interface State {
    locale: string;
    loading: boolean;
    error: boolean;
    messages: Record<keyof Messages, string> | null;
}
export interface IntlProviderContext extends State {
    locale: string;
    setLocale: (locale: string) => void;
}
export interface IntlProps {
    intl: IntlProviderContext;
}
export declare const IntlContext: React.Context<IntlProviderContext>;
export declare const withIntl: <Props extends IntlProps>(Component: React.ComponentType<Props>) => React.ComponentType<Omit<Props, "intl">>;
declare class IntlProvider extends React.Component<{}, State> {
    state: State;
    componentDidMount(): void;
    render(): JSX.Element | null;
    private setLocale;
    private updateLocale;
}
export default IntlProvider;
