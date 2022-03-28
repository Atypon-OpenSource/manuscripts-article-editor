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
exports.LibrarySidebarWithRouter = exports.LibrarySidebar = void 0;
const TriangleCollapsed_1 = __importDefault(require("@manuscripts/assets/react/TriangleCollapsed"));
const TriangleExpanded_1 = __importDefault(require("@manuscripts/assets/react/TriangleExpanded"));
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importDefault(require("styled-components"));
const sources_1 = require("../../lib/sources");
const AddButton_1 = require("../AddButton");
const PageSidebar_1 = __importDefault(require("../PageSidebar"));
const Sidebar_1 = require("../Sidebar");
const BibliographyImportButton_1 = require("./BibliographyImportButton");
const LibraryCollectionCategories_1 = require("./LibraryCollectionCategories");
const SectionContainer = styled_components_1.default.div `
  margin: 0 -${(props) => props.theme.grid.unit * 5}px ${(props) => props.theme.grid.unit * 4}px;
`;
const SectionIcon = styled_components_1.default.div `
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const SectionTitle = styled_components_1.default.div `
  margin-left: ${(props) => props.theme.grid.unit * 2}px;
  flex: 1;
`;
const ListTitle = styled_components_1.default.div `
  margin-left: ${(props) => props.theme.grid.unit * 2}px;
  flex: 1;
`;
const SectionLink = styled_components_1.default(react_router_dom_1.NavLink) `
  align-items: center;
  border-bottom: 1px solid transparent;
  border-top: 1px solid transparent;
  color: ${(props) => props.theme.colors.text.secondary};
  display: flex;
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 9}px;
  line-height: 1;
  overflow: hidden;
  text-decoration: none;
  text-overflow: ellipsis;
  transition: background-color 0.25s;
  white-space: nowrap;

  &:hover,
  &.active {
    background-color: ${(props) => props.theme.colors.background.fifth};
  }

  &.active {
    border-color: ${(props) => props.theme.colors.border.primary};
  }

  &:hover + &.active,
  &.active + &:hover {
    border-top-color: transparent;
  }
`;
const SectionTitleLink = styled_components_1.default(SectionLink) `
  color: ${(props) => props.theme.colors.text.primary};
  padding: 7px ${(props) => props.theme.grid.unit * 4}px;
`;
const LibrarySidebar = ({ projectLibraryCollections, globalLibraries, globalLibraryCollections, importItems, createBibliographyItem, }) => {
    const { projectID, sourceID, sourceType } = react_router_dom_1.useParams();
    const globalLibrariesArray = Array.from(globalLibraries.values());
    const globalLibraryCollectionsArray = Array.from(globalLibraryCollections.values());
    const projectLibraryCollectionsArray = Array.from(projectLibraryCollections.values());
    globalLibraryCollectionsArray.sort(LibraryCollectionCategories_1.sortByCategoryPriority);
    // TODO: sort projectLibraryCollectionsArray by count, filter out empty
    return (react_1.default.createElement(PageSidebar_1.default, { direction: 'row', minSize: 260, name: 'librarySidebar', side: 'end', sidebarTitle: react_1.default.createElement(Sidebar_1.SidebarHeader, { title: 'Library' }), sidebarFooter: react_1.default.createElement("div", null,
            react_1.default.createElement(FooterItem, null,
                react_1.default.createElement(AddButton_1.AddButton, { action: createBibliographyItem, title: 'Create new library item', size: 'small' })),
            react_1.default.createElement(FooterItem, null,
                react_1.default.createElement(BibliographyImportButton_1.BibliographyImportButton, { importItems: importItems, component: ImportButton }))) },
        react_1.default.createElement(Section, { title: 'Project Library', open: sourceType === 'project', location: `/projects/${projectID}/library/project` }, projectLibraryCollectionsArray.map((projectLibraryCollection) => {
            // TODO: count items with this LibraryCollection and only show LibraryCollections with items
            return (react_1.default.createElement(SectionLink, { key: projectLibraryCollection._id, to: `/projects/${projectID}/library/project/${projectLibraryCollection._id}` }, projectLibraryCollection.name || 'Untitled List'));
        })),
        globalLibrariesArray.map((globalLibrary) => {
            const libraryCollections = globalLibraryCollectionsArray.filter((libraryCollection) => {
                return libraryCollection.containerID === globalLibrary._id;
            });
            const defaultLibraryCollection = libraryCollections.find((libraryCollection) => libraryCollection.category === LibraryCollectionCategories_1.DEFAULT_LIBRARY_COLLECTION_CATEGORY);
            const nonDefaultLibraryCollections = libraryCollections.filter((libraryCollection) => libraryCollection.category !== LibraryCollectionCategories_1.DEFAULT_LIBRARY_COLLECTION_CATEGORY);
            const defaultFilter = defaultLibraryCollection
                ? `/${defaultLibraryCollection._id}`
                : '';
            return (react_1.default.createElement(Section, { key: globalLibrary._id, title: globalLibrary.name || 'My Library', open: sourceType === 'global' &&
                    sourceID === globalLibrary._id &&
                    nonDefaultLibraryCollections.length > 0, location: `/projects/${projectID}/library/global/${globalLibrary._id}${defaultFilter}` }, nonDefaultLibraryCollections.map((libraryCollection) => (react_1.default.createElement(SectionLink, { key: libraryCollection._id, to: `/projects/${projectID}/library/global/${globalLibrary._id}/${libraryCollection._id}` },
                react_1.default.createElement(SectionIcon, null, LibraryCollectionCategories_1.sidebarIcon(libraryCollection.category)),
                react_1.default.createElement(ListTitle, null, libraryCollection.name || 'Untitled List'))))));
        }),
        react_1.default.createElement(Section, { title: 'Search Online', open: sourceType === 'search', location: `/projects/${projectID}/library/search` }, sources_1.sources.map((source) => (react_1.default.createElement(SectionLink, { key: source.id, to: `/projects/${projectID}/library/search/${source.id}` }, source.name))))));
};
exports.LibrarySidebar = LibrarySidebar;
exports.LibrarySidebarWithRouter = exports.LibrarySidebar;
const ImportButton = ({ importItems }) => (react_1.default.createElement(AddButton_1.AddButton, { action: importItems, title: "Import from file", size: 'small' }));
const Section = ({ children, open, location, title }) => (react_1.default.createElement(SectionContainer, null,
    react_1.default.createElement(SectionTitleLink, { to: location, exact: true },
        open ? react_1.default.createElement(TriangleExpanded_1.default, null) : react_1.default.createElement(TriangleCollapsed_1.default, null),
        react_1.default.createElement(SectionTitle, null, title)),
    open && children));
const FooterItem = styled_components_1.default.div `
  margin-top: 8px;
`;
//# sourceMappingURL=LibrarySidebar.js.map