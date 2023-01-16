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
exports.updateManuscriptTemplate = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const bundles_1 = require("./bundles");
const manuscript_1 = require("./manuscript");
const requirements_1 = require("./requirements");
const templates_1 = require("./templates");
const updateManuscriptTemplate = ({ bundleID, data, projectID, previousManuscript, prototype, template, modelMap, history, updateManuscriptTemplate, }) => __awaiter(void 0, void 0, void 0, function* () {
    const containerID = projectID;
    // set the new prototype
    const manuscript = Object.assign(Object.assign({}, previousManuscript), { prototype });
    // collect the models that make up the manuscript
    const dependencies = [];
    if (!updateManuscriptTemplate) {
        throw new Error('No update template handler was provided.');
    }
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
    // set the authorInstructionsURL
    if (template && template.authorInstructionsURL) {
        manuscript.authorInstructionsURL = template.authorInstructionsURL;
    }
    // update the citation style bundle(s)
    const [bundle, parentBundle] = yield bundles_1.loadBundle(bundleID);
    manuscript.bundle = bundle._id;
    addContainedModel(bundle);
    if (parentBundle) {
        addContainedModel(parentBundle);
    }
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
            else {
                manuscript[requirementField] = undefined;
            }
        }
    }
    const sectionDescriptions = [];
    if (template && template.mandatorySectionRequirements) {
        for (const requirementID of template.mandatorySectionRequirements) {
            const requirement = data.templatesData.get(requirementID);
            if (requirement) {
                for (const sectionDescription of requirement.embeddedSectionDescriptions) {
                    sectionDescriptions.push(sectionDescription);
                }
            }
        }
    }
    // category & section descriptions map
    const sectionDescriptionsMap = new Map();
    if (sectionDescriptions.length) {
        for (const sectionDescription of sectionDescriptions) {
            const sectionCategory = sectionDescription.sectionCategory;
            sectionDescriptionsMap.set(sectionCategory, sectionDescription);
        }
    }
    const updatedModels = [];
    // update the sections requirements
    for (const model of modelMap.values()) {
        if (manuscript_1.isSection(model) && model.category) {
            const sectionDescription = sectionDescriptionsMap.get(model.category);
            for (const [sectionField, sectionDescriptionField,] of requirements_1.sectionCountRequirementFields) {
                if (sectionDescription) {
                    const count = sectionDescription[sectionDescriptionField];
                    const objectType = templates_1.sectionRequirementTypes.get(sectionDescriptionField);
                    if (count !== undefined && objectType !== undefined) {
                        const requirementID = model[sectionField];
                        if (requirementID) {
                            // update requirement
                            const requirement = modelMap.get(requirementID);
                            if (requirement && requirement.ignored === false) {
                                requirement.count = count;
                                updatedModels.push(requirement);
                            }
                        }
                        else {
                            // create requirement
                            const newRequirement = {
                                _id: manuscript_transform_1.generateID(objectType),
                                objectType,
                                count,
                                severity: 0,
                                ignored: false,
                            };
                            addContainedModel(newRequirement);
                            model[sectionField] = newRequirement._id;
                        }
                    }
                    else {
                        model[sectionField] = undefined;
                    }
                }
                else {
                    model[sectionField] = undefined;
                }
            }
            // update placeholders
            if (sectionDescription) {
                const sectionCategory = data.sectionCategories.get(sectionDescription.sectionCategory);
                const choosePlaceholder = () => {
                    if (sectionDescription.placeholder) {
                        return sectionDescription.placeholder;
                    }
                    if (sectionCategory && sectionCategory.desc) {
                        return sectionCategory.desc;
                    }
                };
                const placeholder = choosePlaceholder();
                const elementIDs = model.elementIDs || [];
                const paragraphElement = elementIDs.length
                    ? modelMap.get(elementIDs[0])
                    : undefined;
                if (paragraphElement) {
                    paragraphElement.placeholderInnerHTML = placeholder;
                    updatedModels.push(paragraphElement);
                }
            }
            updatedModels.push(model);
        }
    }
    yield updateManuscriptTemplate(dependencies, containerID, manuscript, updatedModels);
    // @TODO - move out side effect
    // history.push(`/projects/${containerID}/manuscripts/${manuscript._id}`)
});
exports.updateManuscriptTemplate = updateManuscriptTemplate;
//# sourceMappingURL=update-manuscript-template.js.map