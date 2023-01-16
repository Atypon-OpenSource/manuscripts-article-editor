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
exports.useSharedData = void 0;
const react_1 = require("react");
const requirements_1 = require("../lib/requirements");
const shared_data_1 = require("../lib/shared-data");
const templates_1 = require("../lib/templates");
const store_1 = require("../store");
const useSharedData = () => {
    const [data, setData] = react_1.useState();
    const [{ userTemplates, userTemplateModels }, setUserData] = react_1.useState({});
    const [{ getUserTemplates }] = store_1.useStore((store) => ({
        getUserTemplates: store.getUserTemplates,
    }));
    react_1.useEffect(() => {
        if (getUserTemplates) {
            getUserTemplates()
                .then(({ userTemplateModels, userTemplates }) => {
                setUserData({ userTemplateModels, userTemplates });
            })
                .catch((e) => console.log(e));
        }
    }, [getUserTemplates]);
    react_1.useEffect(() => {
        if (userTemplates && userTemplateModels) {
            shared_data_1.loadAllSharedData(userTemplates, userTemplateModels)
                .then(setData)
                .catch((error) => {
                // TODO: display error message
                console.error(error);
            });
        }
    }, [userTemplates, userTemplateModels]);
    const items = react_1.useMemo(() => (data ? templates_1.buildItems(data) : undefined), [data]);
    const getRequirement = react_1.useCallback((requirementID) => {
        return data ? data.templatesData.get(requirementID) : undefined;
    }, [data]);
    const getTemplate = react_1.useCallback((templateID) => {
        if (!items || !items.length) {
            return;
        }
        for (const item of items) {
            if (item.template && item.template._id === templateID) {
                // merge the templates
                const template = templates_1.createMergedTemplate(item.template, data.manuscriptTemplates);
                return template;
            }
        }
    }, [items, data]);
    /**
     * Returns a map of key/value pairs from the passed template id.
     * Expects the key/value pair to be the manuscript count requirement type as the keys and the count number as the corresponding values.
     * */
    const getManuscriptCountRequirements = react_1.useCallback((templateID) => {
        const template = getTemplate(templateID);
        const requirements = new Map();
        if (template) {
            for (const [manuscriptCountRequirementField, manuscriptCountRequirementType,] of requirements_1.manuscriptCountRequirementFieldsMap) {
                const requirementID = template[manuscriptCountRequirementField];
                if (requirementID) {
                    const requirement = getRequirement(requirementID);
                    if (requirement) {
                        requirements.set(manuscriptCountRequirementType, requirement.count);
                    }
                }
            }
        }
        return requirements;
    }, [getRequirement, getTemplate]);
    /**
     * Returns a map of key/value pairs from the passed template id.
     * Expects the key/value pair to be the sections categories as the keys
     * and another map (a map containing the section count requirement type as the keys and the count number as the corresponding values) as the corresponding values.
     */
    const getSectionCountRequirements = react_1.useCallback((templateID) => {
        const template = getTemplate(templateID);
        const sectionDescriptions = [];
        if (template && template.mandatorySectionRequirements) {
            for (const requirementID of template.mandatorySectionRequirements) {
                const requirement = getRequirement(requirementID);
                if (requirement) {
                    for (const sectionDescription of requirement.embeddedSectionDescriptions) {
                        sectionDescriptions.push(sectionDescription);
                    }
                }
            }
        }
        const requirements = {};
        for (const sectionDescription of sectionDescriptions) {
            if (sectionDescription.sectionCategory) {
                for (const [sectionDescriptionField, sectionCountRequirementType,] of requirements_1.sectionDescriptionCountRequirementFieldsMap) {
                    const count = sectionDescription[sectionDescriptionField];
                    if (!requirements[sectionDescription.sectionCategory]) {
                        requirements[sectionDescription.sectionCategory] = new Map();
                    }
                    requirements[sectionDescription.sectionCategory].set(sectionCountRequirementType, count);
                }
            }
        }
        return requirements;
    }, [getRequirement, getTemplate]);
    return {
        getTemplate,
        getRequirement,
        getManuscriptCountRequirements,
        getSectionCountRequirements,
    };
};
exports.useSharedData = useSharedData;
//# sourceMappingURL=use-shared-data.js.map