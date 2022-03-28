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
exports.sortByCategoryPriority = exports.sidebarIcon = exports.DEFAULT_LIBRARY_COLLECTION_CATEGORY = void 0;
const MyPublications_1 = __importDefault(require("@manuscripts/assets/react/MyPublications"));
const Paragraph_1 = __importDefault(require("@manuscripts/assets/react/Paragraph"));
const Star_1 = __importDefault(require("@manuscripts/assets/react/Star"));
const Target_1 = __importDefault(require("@manuscripts/assets/react/Target"));
const Time_1 = __importDefault(require("@manuscripts/assets/react/Time"));
const react_1 = __importDefault(require("react"));
exports.DEFAULT_LIBRARY_COLLECTION_CATEGORY = 'MPLibraryCollectionCategory:default';
const icons = {
    'MPLibraryCollectionCategory:default': react_1.default.createElement(Paragraph_1.default, { width: 18, height: 18 }),
    'MPLibraryCollectionCategory:favourites': react_1.default.createElement(Star_1.default, { width: 18, height: 18 }),
    'MPLibraryCollectionCategory:read-later': react_1.default.createElement(Time_1.default, { width: 18, height: 18 }),
    'MPLibraryCollectionCategory:watch-list': react_1.default.createElement(Target_1.default, { width: 18, height: 18 }),
    'MPLibraryCollectionCategory:my-publications': (react_1.default.createElement(MyPublications_1.default, { width: 18, height: 18 })),
};
const sidebarIcon = (key) => key && key in icons
    ? icons[key]
    : icons[exports.DEFAULT_LIBRARY_COLLECTION_CATEGORY];
exports.sidebarIcon = sidebarIcon;
const priorities = {
    'MPLibraryCollectionCategory:default': 5,
    'MPLibraryCollectionCategory:my-publications': 4,
    'MPLibraryCollectionCategory:favourites': 3,
    'MPLibraryCollectionCategory:read-later': 2,
    'MPLibraryCollectionCategory:watch-list': 1,
};
const sortByCategoryPriority = (a, b) => {
    const priorityA = a.category && a.category in priorities
        ? priorities[a.category]
        : 0;
    const priorityB = b.category && b.category in priorities
        ? priorities[b.category]
        : 0;
    return priorityB - priorityA;
};
exports.sortByCategoryPriority = sortByCategoryPriority;
//# sourceMappingURL=LibraryCollectionCategories.js.map