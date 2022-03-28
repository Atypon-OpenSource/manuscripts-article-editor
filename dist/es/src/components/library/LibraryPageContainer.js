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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryPageContainer = void 0;
const library_1 = require("@manuscripts/library");
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const react_1 = __importStar(require("react"));
const react_router_1 = require("react-router");
const use_debounce_1 = require("../../hooks/use-debounce");
const ExternalSearch_1 = require("./ExternalSearch");
const GlobalLibrary_1 = require("./GlobalLibrary");
const LibrarySidebar_1 = require("./LibrarySidebar");
const ProjectLibrary_1 = require("./ProjectLibrary");
const LibraryPageContainer = ({ globalLibraries, globalLibraryCollections, globalLibraryItems, history, match: { params: { projectID }, }, projectLibrary, projectLibraryCollection, projectLibraryCollections, projectLibraryCollectionsCollection, user, }) => {
    const [selectedItem, setSelectedItem] = react_1.useState(); // TODO: item in route?
    // TODO: should the query be part of the route?
    const [query, setQuery] = react_1.useState();
    const debouncedQuery = use_debounce_1.useDebounce(query, 500);
    const importItems = (items) => __awaiter(void 0, void 0, void 0, function* () {
        const newItems = [];
        for (const item of items) {
            const existingItem = library_1.matchLibraryItemByIdentifier(item, projectLibrary);
            if (!existingItem) {
                // add the item to the model map so it's definitely available
                projectLibrary.set(item._id, item);
                // save the new item
                const newItem = yield projectLibraryCollection.create(item, {
                    containerID: projectID,
                });
                newItems.push(newItem);
            }
        }
        return newItems;
    });
    const createBibliographyItem = react_1.useCallback(() => {
        const item = manuscript_transform_1.buildBibliographyItem({});
        projectLibraryCollection
            .create(item, {
            containerID: projectID,
        })
            .then((item) => {
            history.push(`/projects/${projectID}/library/project`);
            setSelectedItem(item);
        })
            .catch((error) => {
            console.error(error);
        });
    }, [projectLibraryCollection, projectID, history]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(LibrarySidebar_1.LibrarySidebarWithRouter, { projectLibraryCollections: projectLibraryCollections, globalLibraries: globalLibraries, globalLibraryCollections: globalLibraryCollections, importItems: importItems, createBibliographyItem: createBibliographyItem }),
        react_1.default.createElement(react_router_1.Switch, null,
            react_1.default.createElement(react_router_1.Redirect, { from: '/projects/:projectID/library', exact: true, to: '/projects/:projectID/library/project' }),
            react_1.default.createElement(react_router_1.Route, { path: '/projects/:projectID/library/project/:filterID?', render: (props) => (react_1.default.createElement(ProjectLibrary_1.ProjectLibrary, Object.assign({ projectLibraryCollections: projectLibraryCollections, projectLibraryCollectionsCollection: projectLibraryCollectionsCollection, projectLibrary: projectLibrary, projectLibraryCollection: projectLibraryCollection, user: user, query: query, setQuery: setQuery, selectedItem: selectedItem, setSelectedItem: setSelectedItem, debouncedQuery: debouncedQuery }, props))) }),
            react_1.default.createElement(react_router_1.Route, { path: '/projects/:projectID/library/global/:sourceID/:filterID?', render: (props) => (react_1.default.createElement(GlobalLibrary_1.GlobalLibrary, Object.assign({ globalLibrary: globalLibraries.get(props.match.params.sourceID), globalLibraryItems: globalLibraryItems, projectLibrary: projectLibrary, projectLibraryCollection: projectLibraryCollection, query: query, setQuery: setQuery, debouncedQuery: debouncedQuery }, props))) }),
            react_1.default.createElement(react_router_1.Redirect, { from: '/projects/:projectID/library/search', exact: true, to: '/projects/:projectID/library/search/crossref' }),
            react_1.default.createElement(react_router_1.Route, { path: '/projects/:projectID/library/search/:sourceID?', render: (props) => (react_1.default.createElement(ExternalSearch_1.ExternalSearch, Object.assign({ projectLibrary: projectLibrary, projectLibraryCollection: projectLibraryCollection, query: query, setQuery: setQuery, debouncedQuery: debouncedQuery }, props))) }))));
};
exports.LibraryPageContainer = LibraryPageContainer;
exports.default = exports.LibraryPageContainer;
//# sourceMappingURL=LibraryPageContainer.js.map