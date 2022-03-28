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
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */
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
exports.createManuscript = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const bundles_1 = require("./bundles");
const native_1 = require("./native");
const requirements_1 = require("./requirements");
const templates_1 = require("./templates");
const tracking_1 = require("./tracking");
const buildNewProject = ({ projectID, user, }) => projectID ? undefined : manuscript_transform_1.buildProject(user.userID);
const sendNewProjectNotification = (projectID) => {
    native_1.postWebkitMessage('action', {
        name: 'assign-project',
        projectID,
    });
};
const isStatusLabel = manuscript_transform_1.hasObjectType(manuscripts_json_schema_1.ObjectTypes.StatusLabel);
// tslint:disable-next-line:cyclomatic-complexity
const createManuscript = ({ addContent = false, analyticsTemplateName, bundleID, data, history, projectID, prototype, template, user, saveNewManuscript, }) => __awaiter(void 0, void 0, void 0, function* () {
    const newProject = buildNewProject({ projectID, user });
    const containerID = newProject ? newProject._id : projectID;
    const priority = 1;
    // build the manuscript
    const manuscript = Object.assign(Object.assign({}, manuscript_transform_1.buildManuscript()), { 
        // colorScheme: colorScheme ? colorScheme._id : DEFAULT_COLOR_SCHEME,
        priority,
        prototype });
    // collect the models that make up the manuscript
    const dependencies = [];
    const addDependency = (model, containedIDs = { containerID: '' }) => {
        dependencies.push(Object.assign(Object.assign({}, model), containedIDs));
    };
    const addContainedModel = (model) => {
        const containerIDs = { containerID };
        if (manuscript_transform_1.isManuscriptModel(model)) {
            containerIDs.manuscriptID = manuscript._id;
        }
        addDependency(model, containerIDs);
    };
    const addContainedModels = (models) => {
        for (const model of models) {
            addContainedModel(model);
        }
    };
    // add the current user as the first author
    addContainedModel(manuscript_transform_1.buildContributor(user.bibliographicName, 'author', 0, user.userID));
    // bundled styles, keywords, contributor roles and author instructions URL
    if (template) {
        const keywords = yield manuscript_transform_1.loadKeywords();
        addContainedModels(keywords.filter(isStatusLabel).map(manuscript_transform_1.fromPrototype));
        const contributorRoles = yield manuscript_transform_1.loadContributorRoles();
        addContainedModels(contributorRoles.map(manuscript_transform_1.fromPrototype));
        if (template === null || template === void 0 ? void 0 : template.styles) {
            for (const id of template.styles.keys()) {
                const style = data.styles.get(id);
                if (style) {
                    addContainedModel(manuscript_transform_1.fromPrototype(style));
                }
            }
        }
        else {
            for (const style of data.styles.values()) {
                addContainedModel(manuscript_transform_1.fromPrototype(style));
            }
        }
        if (template.authorInstructionsURL) {
            manuscript.authorInstructionsURL = template.authorInstructionsURL;
        }
    }
    else {
        const dependencies = yield manuscript_transform_1.loadBundledDependencies();
        addContainedModels(dependencies.map(manuscript_transform_1.fromPrototype));
    }
    const dependencyMap = new Map(dependencies.map((model) => [model._id, model]));
    const newPageLayout = manuscript_transform_1.updatedPageLayout(dependencyMap, (template === null || template === void 0 ? void 0 : template.pageLayout) || manuscript_transform_1.DEFAULT_PAGE_LAYOUT);
    // const colorScheme = this.findDefaultColorScheme(newStyles)
    manuscript.pageLayout = newPageLayout._id;
    // add the citation style bundle(s)
    const [bundle, parentBundle] = yield bundles_1.loadBundle(bundleID);
    manuscript.bundle = bundle._id;
    addContainedModel(bundle);
    if (parentBundle) {
        addContainedModel(parentBundle);
    }
    if (addContent) {
        // add the template requirements and sections
        const addNewRequirement = (requirementID) => __awaiter(void 0, void 0, void 0, function* () {
            const requirement = data.templatesData.get(requirementID);
            if (requirement) {
                const newRequirement = Object.assign(Object.assign({}, manuscript_transform_1.fromPrototype(requirement)), { ignored: false });
                addContainedModel(newRequirement);
                return newRequirement;
            }
        });
        if (template) {
            // save manuscript requirements
            for (const requirementField of requirements_1.manuscriptCountRequirementFields) {
                const requirementID = template[requirementField];
                if (requirementID) {
                    const requirement = yield addNewRequirement(requirementID);
                    if (requirement) {
                        manuscript[requirementField] = requirement._id;
                    }
                }
            }
            // create new sections
            const sectionDescriptions = [];
            if (template.mandatorySectionRequirements) {
                for (const requirementID of template.mandatorySectionRequirements) {
                    const requirement = data.templatesData.get(requirementID);
                    if (requirement) {
                        for (const sectionDescription of requirement.embeddedSectionDescriptions) {
                            sectionDescriptions.push(sectionDescription);
                        }
                    }
                }
            }
            if (sectionDescriptions.length) {
                // create the required sections, if there are any
                const items = templates_1.createManuscriptSectionsFromTemplate(data.templatesData, data.sectionCategories, sectionDescriptions);
                addContainedModels(items);
            }
            else {
                // create an empty section, if there are no required sections
                const paragraph = templates_1.createEmptyParagraph(newPageLayout);
                addContainedModel(paragraph);
                addContainedModel(Object.assign(Object.assign({}, manuscript_transform_1.buildSection()), { elementIDs: [paragraph._id] }));
            }
            // create a cover letter manuscript alongside the _first_ manuscript,
            // if it's a research article or has a cover letter requirement in the template
            // TODO: use section descriptions in the cover-letter category from required sections?
            if (priority === 1) {
                const coverLetterDependencies = buildCoverLetterRequirements({
                    data,
                    template,
                    bundleID: manuscript.bundle,
                    containerID,
                });
                for (const coverLetterDependency of coverLetterDependencies) {
                    addDependency(coverLetterDependency);
                }
            }
        }
        else {
            // an empty paragraph for the first section
            const paragraph = templates_1.createEmptyParagraph(newPageLayout);
            addContainedModel(paragraph);
            // the first section
            addContainedModel(Object.assign(Object.assign({}, manuscript_transform_1.buildSection()), { elementIDs: [paragraph._id] }));
        }
    }
    // Save the manuscript and its dependencies. Create new project if needed
    yield saveNewManuscript(dependencies, containerID, manuscript, newProject);
    tracking_1.trackEvent({
        category: 'Manuscripts',
        action: 'Create',
        label: `template=${analyticsTemplateName}`,
    });
    // @TODO - move out this side effects
    history.push(`/projects/${containerID}/manuscripts/${manuscript._id}`);
    if (newProject) {
        sendNewProjectNotification(containerID);
    }
});
exports.createManuscript = createManuscript;
function* buildCoverLetterRequirements({ bundleID, containerID, data, template, }) {
    if (template.coverLetterRequirement ||
        template.category === templates_1.RESEARCH_ARTICLE_CATEGORY) {
        const sectionCategory = data.sectionCategories.get(templates_1.COVER_LETTER_SECTION_CATEGORY);
        const coverLetterManuscript = manuscript_transform_1.buildManuscript(sectionCategory ? sectionCategory.name : 'Cover Letter');
        const coverLetterRequirement = template.coverLetterRequirement
            ? data.manuscriptTemplates.get(template.coverLetterRequirement)
            : undefined;
        const placeholder = coverLetterRequirement && coverLetterRequirement.placeholderString
            ? coverLetterRequirement.placeholderString
            : templates_1.COVER_LETTER_PLACEHOLDER;
        const paragraph = manuscript_transform_1.buildParagraph(placeholder);
        yield Object.assign(Object.assign({}, paragraph), { containerID, manuscriptID: coverLetterManuscript._id });
        const section = manuscript_transform_1.buildSection(1);
        section.elementIDs = [paragraph._id];
        section.titleSuppressed = true;
        yield Object.assign(Object.assign({}, section), { containerID, manuscriptID: coverLetterManuscript._id });
        yield Object.assign(Object.assign({}, coverLetterManuscript), { bundle: bundleID, category: templates_1.COVER_LETTER_CATEGORY, priority: 2, // the cover letter is always the second manuscript
            containerID });
    }
}
//# sourceMappingURL=create-manuscript.js.map