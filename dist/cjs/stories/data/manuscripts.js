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
Object.defineProperty(exports, "__esModule", { value: true });
exports.manuscript = void 0;
const manuscripts = [
    {
        _id: 'example-1',
        containerID: 'project-1',
        objectType: 'MPManuscript',
        title: 'Landscape genomic prediction for restoration of a <em>Eucalyptus</em> foundation species under climate change',
        createdAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
        updatedAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
        bundle: 'MPBundle:www-zotero-org-styles-apa-5th-edition',
        primaryLanguageCode: 'en-GB',
    },
    {
        _id: 'example-2',
        containerID: 'project-1',
        objectType: 'MPManuscript',
        title: 'Two complement receptor one alleles have opposing associations with cerebral malaria and interact with α<sup>+</sup>thalassaemia',
        createdAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
        updatedAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
        bundle: 'MPBundle:www-zotero-org-styles-nature',
        primaryLanguageCode: 'en-US',
    },
    {
        _id: 'example-3',
        containerID: 'project-1',
        objectType: 'MPManuscript',
        title: 'Cryo-EM structure of the adenosine A<sub>2A</sub> receptor coupled to an engineered heterotrimeric G protein',
        createdAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
        updatedAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
        bundle: 'MPBundle:www-zotero-org-styles-peerj',
        primaryLanguageCode: 'ar',
    },
];
exports.default = manuscripts;
exports.manuscript = manuscripts[0];
//# sourceMappingURL=manuscripts.js.map