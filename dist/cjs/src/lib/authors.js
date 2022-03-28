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
exports.reorderAuthors = exports.isJointFirstAuthor = exports.buildAuthorsAndAffiliations = exports.buildAffiliationsMap = exports.buildAuthorAffiliations = exports.buildSortedAffiliationIDs = exports.buildAuthorPriority = exports.buildSortedContributors = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const sort_1 = require("./sort");
const buildSortedContributors = (contributors) => contributors.sort(sort_1.ascendingPriority);
exports.buildSortedContributors = buildSortedContributors;
const buildAuthorPriority = (authors) => {
    if (!authors.length) {
        return 0;
    }
    const priorities = authors.map((author) => Number(author.priority));
    return Math.max(...priorities) + 1;
};
exports.buildAuthorPriority = buildAuthorPriority;
const buildSortedAffiliationIDs = (sortedAuthors) => {
    const ids = new Set();
    for (const author of sortedAuthors) {
        if (author.affiliations) {
            author.affiliations.forEach((id) => {
                ids.add(id);
            });
        }
    }
    return [...ids];
};
exports.buildSortedAffiliationIDs = buildSortedAffiliationIDs;
const buildAuthorAffiliations = (authors, affiliations, sortedAffiliationIDs) => {
    const items = new Map();
    for (const author of authors) {
        items.set(author._id, (author.affiliations || []).map((id) => {
            return {
                ordinal: sortedAffiliationIDs.indexOf(id) + 1,
                data: affiliations.get(id),
            };
        }));
    }
    return items;
};
exports.buildAuthorAffiliations = buildAuthorAffiliations;
const buildAffiliationsMap = (affiliationIDs, affiliations) => new Map(affiliationIDs.map((id) => [
    id,
    affiliations.find((affiliation) => affiliation._id === id),
]));
exports.buildAffiliationsMap = buildAffiliationsMap;
const isContributor = manuscript_transform_1.hasObjectType(manuscripts_json_schema_1.ObjectTypes.Contributor);
const isAffiliation = manuscript_transform_1.hasObjectType(manuscripts_json_schema_1.ObjectTypes.Affiliation);
const buildAuthorsAndAffiliations = (data) => {
    const authors = data.filter(isContributor);
    const affiliations = data.filter(isAffiliation);
    const sortedAuthors = exports.buildSortedContributors(authors);
    const sortedAffiliationIDs = exports.buildSortedAffiliationIDs(sortedAuthors);
    const affiliationsMap = exports.buildAffiliationsMap(sortedAffiliationIDs, affiliations);
    const authorAffiliations = exports.buildAuthorAffiliations(sortedAuthors, affiliationsMap, sortedAffiliationIDs);
    return {
        affiliations: affiliationsMap,
        authors: sortedAuthors,
        authorAffiliations,
    };
};
exports.buildAuthorsAndAffiliations = buildAuthorsAndAffiliations;
const isJointFirstAuthor = (authors, index) => {
    const author = index === 0 ? authors[index] : authors[index - 1];
    return Boolean(author.isJointContributor);
};
exports.isJointFirstAuthor = isJointFirstAuthor;
const reorderAuthors = (authors, oldIndex, newIndex) => {
    const clonedAuthors = authors.slice(0);
    const order = authors.map((_, i) => (i === oldIndex ? newIndex : i));
    clonedAuthors.sort((a, b) => {
        return order[authors.indexOf(a)] - order[authors.indexOf(b)];
    });
    return clonedAuthors;
};
exports.reorderAuthors = reorderAuthors;
//# sourceMappingURL=authors.js.map