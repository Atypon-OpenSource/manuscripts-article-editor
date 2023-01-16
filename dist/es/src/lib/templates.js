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
exports.chooseBundleID = exports.buildTemplateDataFactory = exports.findParentTemplate = exports.buildArticleType = exports.buildJournalTitle = exports.buildItems = exports.buildResearchFields = exports.buildCategories = exports.createEmptyParagraph = exports.createMergedTemplate = exports.createManuscriptSectionsFromTemplate = exports.buildSectionFromDescription = exports.chooseSectionTitle = exports.prepareSectionRequirements = exports.sectionRequirementTypes = exports.COVER_LETTER_PLACEHOLDER = exports.COVER_LETTER_SECTION_CATEGORY = exports.DEFAULT_CATEGORY = exports.COVER_LETTER_CATEGORY = exports.RESEARCH_ARTICLE_CATEGORY = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const lodash_es_1 = require("lodash-es");
const requirements_1 = require("./requirements");
exports.RESEARCH_ARTICLE_CATEGORY = 'MPManuscriptCategory:research-article';
exports.COVER_LETTER_CATEGORY = 'MPManuscriptCategory:cover-letter';
exports.DEFAULT_CATEGORY = exports.RESEARCH_ARTICLE_CATEGORY;
exports.COVER_LETTER_SECTION_CATEGORY = 'MPSectionCategory:cover-letter';
exports.COVER_LETTER_PLACEHOLDER = 'A letter sent along with your manuscript to explain it.';
exports.sectionRequirementTypes = new Map([
    ['maxCharCount', manuscripts_json_schema_1.ObjectTypes.MaximumSectionCharacterCountRequirement],
    ['maxWordCount', manuscripts_json_schema_1.ObjectTypes.MaximumSectionWordCountRequirement],
    ['minCharCount', manuscripts_json_schema_1.ObjectTypes.MinimumSectionCharacterCountRequirement],
    ['minWordCount', manuscripts_json_schema_1.ObjectTypes.MinimumSectionWordCountRequirement],
]);
const prepareSectionRequirements = (section, sectionDescription, templatesData) => {
    if (!templatesData) {
        return [];
    }
    const requirements = [];
    for (const [sectionField, sectionDescriptionField,] of requirements_1.sectionCountRequirementFields) {
        const count = sectionDescription[sectionDescriptionField];
        const objectType = exports.sectionRequirementTypes.get(sectionDescriptionField);
        if (count !== undefined && objectType !== undefined) {
            const newRequirement = {
                _id: manuscript_transform_1.generateID(objectType),
                objectType,
                count,
                severity: 0,
                ignored: false,
            };
            requirements.push(newRequirement);
            section[sectionField] = newRequirement._id;
        }
    }
    return requirements;
};
exports.prepareSectionRequirements = prepareSectionRequirements;
const chooseSectionTitle = (sectionDescription, sectionCategory) => {
    if (sectionDescription) {
        if (sectionDescription.title) {
            return sectionDescription.title;
        }
        if (sectionDescription.titles && sectionDescription.titles[0]) {
            return sectionDescription.titles[0];
        }
    }
    if (sectionCategory) {
        return sectionCategory.name;
    }
    return '';
};
exports.chooseSectionTitle = chooseSectionTitle;
// the content in these sections is automatically generated
const generatedSections = [
    'MPSectionCategory:bibliography',
    'MPSectionCategory:keywords',
    'MPSectionCategory:toc',
];
const buildSectionFromDescription = (templatesData, sectionDescription, sectionCategory) => {
    const dependencies = [];
    const section = manuscript_transform_1.buildSection((sectionCategory === null || sectionCategory === void 0 ? void 0 : sectionCategory.priority) || 1);
    section.elementIDs = [];
    const sectionTitle = exports.chooseSectionTitle(sectionDescription, sectionCategory);
    section.title =
        sectionTitle.substr(0, 1).toUpperCase() + sectionTitle.substr(1);
    if (sectionCategory) {
        section.category = sectionCategory._id;
        // avoid adding invalid empty paragraphs to generated sections
        if (generatedSections.includes(section.category)) {
            return { section, dependencies };
        }
    }
    // const paragraphStyle =
    //   sectionDescription.paragraphStyle && modelMap
    //     ? getByPrototype<ParagraphStyle>(
    //         sectionDescription.paragraphStyle,
    //         modelMap
    //       )
    //     : undefined
    const choosePlaceholder = () => {
        if (sectionDescription.placeholder) {
            return sectionDescription.placeholder;
        }
        if (sectionCategory && sectionCategory.desc) {
            return sectionCategory.desc;
        }
    };
    const placeholder = choosePlaceholder();
    if (placeholder) {
        const paragraph = manuscript_transform_1.buildParagraph(placeholder);
        // if (paragraphStyle) {
        //   paragraph.paragraphStyle = paragraphStyle._id
        // }
        paragraph.placeholderInnerHTML = placeholder;
        dependencies.push(paragraph);
        section.elementIDs.push(paragraph._id);
    }
    else if (!sectionDescription.subsections) {
        const paragraph = manuscript_transform_1.buildParagraph('');
        // if (paragraphStyle) {
        //   paragraph.paragraphStyle = paragraphStyle._id
        // }
        dependencies.push(paragraph);
        section.elementIDs.push(paragraph._id);
    }
    if (sectionDescription.subsections) {
        sectionDescription.subsections.map((subsectionDescription, index) => {
            // const paragraphStyle =
            //   subsectionDescription.paragraphStyle && modelMap
            //     ? getByPrototype<ParagraphStyle>(
            //         subsectionDescription.paragraphStyle,
            //         modelMap
            //       )
            //     : undefined
            const paragraph = manuscript_transform_1.buildParagraph(subsectionDescription.placeholder || '');
            // if (paragraphStyle) {
            //   paragraph.paragraphStyle = paragraphStyle._id
            // }
            dependencies.push(paragraph);
            const subsection = manuscript_transform_1.buildSection(index, [section._id]);
            subsection.title = subsectionDescription.title;
            subsection.elementIDs = [paragraph._id];
            dependencies.push(subsection);
        });
    }
    const requirements = exports.prepareSectionRequirements(section, sectionDescription, templatesData);
    for (const requirement of requirements) {
        dependencies.push(requirement);
    }
    return { section, dependencies };
};
exports.buildSectionFromDescription = buildSectionFromDescription;
const createManuscriptSectionsFromTemplate = (templatesData, sectionCategories, sectionDescriptions) => {
    const items = [];
    for (const sectionDescription of sectionDescriptions) {
        const sectionCategory = sectionCategories.get(sectionDescription.sectionCategory);
        // exclude "Cover Letter" sections, as they're separate manuscripts now
        if (sectionCategory._id === exports.COVER_LETTER_SECTION_CATEGORY) {
            continue;
        }
        const { section, dependencies } = exports.buildSectionFromDescription(templatesData, sectionDescription, sectionCategory);
        items.push(...dependencies);
        items.push(section);
    }
    return items;
};
exports.createManuscriptSectionsFromTemplate = createManuscriptSectionsFromTemplate;
const createMergedTemplate = (template, manuscriptTemplates) => {
    if (!manuscriptTemplates) {
        return template;
    }
    let mergedTemplate = Object.assign({}, template);
    let parentTemplateID = mergedTemplate.parent; // TODO: parent stored as the parent template title, it's not the parent template id, search by title?
    while (parentTemplateID) {
        const parentTemplate = manuscriptTemplates.get(parentTemplateID);
        if (!parentTemplate) {
            break;
        }
        mergedTemplate = lodash_es_1.mergeWith(mergedTemplate, parentTemplate, (objValue, srcValue) => {
            if (Array.isArray(objValue)) {
                // TODO: ensure uniqueness?
                return objValue.concat(srcValue); // merge arrays
            }
            return objValue === undefined ? srcValue : objValue;
        });
        parentTemplateID = parentTemplate.parent;
    }
    // TODO: keep the origin template ID?
    delete mergedTemplate.parent;
    // TODO: no need to create a prototype as it isn't saved?
    return mergedTemplate;
};
exports.createMergedTemplate = createMergedTemplate;
const createEmptyParagraph = (pageLayout) => {
    const placeholderText = 'Start from here. Enjoy writing! - the Manuscripts Team.';
    const paragraph = manuscript_transform_1.buildParagraph(placeholderText);
    paragraph.placeholderInnerHTML = placeholderText;
    paragraph.paragraphStyle = pageLayout.defaultParagraphStyle;
    return paragraph;
};
exports.createEmptyParagraph = createEmptyParagraph;
const buildCategories = (items) => Array.from(items.values()).sort((a, b) => Number(a.priority) - Number(b.priority));
exports.buildCategories = buildCategories;
const buildResearchFields = (items) => Array.from(items.values()).sort((a, b) => Number(a.priority) - Number(b.priority));
exports.buildResearchFields = buildResearchFields;
const sortTemplateItems = (a, b) => a.title.localeCompare(b.title);
const buildItems = (sharedData) => {
    const buildTemplateData = exports.buildTemplateDataFactory(sharedData);
    // user templates
    const userTemplateItems = [];
    for (const template of sharedData.userManuscriptTemplates.values()) {
        userTemplateItems.push(buildTemplateData(template));
    }
    // bundled templates
    const templateItems = [];
    for (const template of sharedData.manuscriptTemplates.values()) {
        if (!template.hidden) {
            templateItems.push(buildTemplateData(template));
        }
    }
    // bundles that aren't already attached to templates
    const templateBundles = new Set();
    templateItems.forEach((item) => {
        if (item.bundle) {
            templateBundles.add(item.bundle._id);
        }
    });
    const bundleItems = [];
    for (const bundle of sharedData.bundles.values()) {
        if (!templateBundles.has(bundle._id) && bundle.csl && bundle.csl.title) {
            bundleItems.push({
                bundle,
                title: bundle.csl.title,
                category: exports.DEFAULT_CATEGORY,
                titleAndType: bundle.csl.title,
            });
        }
    }
    return [
        ...userTemplateItems.sort(sortTemplateItems),
        ...[...templateItems, ...bundleItems].sort(sortTemplateItems), // sort the bundled items and show them last
    ];
};
exports.buildItems = buildItems;
const buildJournalTitle = (template, parentTemplate, bundle) => {
    return chooseJournalTitle(template, parentTemplate, bundle)
        .replace(/\s+Journal\s+Publication\s*/, '')
        .trim();
};
exports.buildJournalTitle = buildJournalTitle;
const chooseJournalTitle = (template, parentTemplate, bundle) => {
    var _a;
    return (parentTemplate === null || parentTemplate === void 0 ? void 0 : parentTemplate.title) || template.title || ((_a = bundle === null || bundle === void 0 ? void 0 : bundle.csl) === null || _a === void 0 ? void 0 : _a.title) || '';
};
const buildArticleType = (template, parentTemplate) => {
    const title = (parentTemplate === null || parentTemplate === void 0 ? void 0 : parentTemplate.title)
        ? template.title.replace(parentTemplate.title, '')
        : template.title;
    return title.replace(/Journal\s+Publication/, '').trim();
};
exports.buildArticleType = buildArticleType;
const findParentTemplate = (templates, userTemplates, parent) => {
    if (parent.startsWith('MPManuscriptTemplate:')) {
        return userTemplates.get(parent) || templates.get(parent);
    }
    for (const template of userTemplates.values()) {
        if (template.title === parent) {
            return template;
        }
    }
    for (const template of templates.values()) {
        if (template.title === parent) {
            return template;
        }
    }
    return undefined;
};
exports.findParentTemplate = findParentTemplate;
const buildTemplateDataFactory = (sharedData) => (template) => {
    const parentTemplate = template.parent
        ? exports.findParentTemplate(sharedData.manuscriptTemplates, sharedData.userManuscriptTemplates, template.parent)
        : undefined;
    const bundleID = template.bundle || (parentTemplate === null || parentTemplate === void 0 ? void 0 : parentTemplate.bundle);
    const bundle = bundleID ? sharedData.bundles.get(bundleID) : undefined;
    const title = exports.buildJournalTitle(template, parentTemplate, bundle);
    const articleType = exports.buildArticleType(template);
    const publisherID = template.publisher || (parentTemplate === null || parentTemplate === void 0 ? void 0 : parentTemplate.publisher);
    const publisher = publisherID
        ? sharedData.publishers.get(publisherID)
        : undefined;
    const category = template.category || (parentTemplate === null || parentTemplate === void 0 ? void 0 : parentTemplate.category) || exports.DEFAULT_CATEGORY;
    const titleAndType = [title, articleType].join(' ');
    return {
        template,
        bundle,
        title,
        articleType,
        publisher,
        category,
        titleAndType,
    };
};
exports.buildTemplateDataFactory = buildTemplateDataFactory;
const chooseBundleID = (item) => { var _a, _b; return ((_a = item === null || item === void 0 ? void 0 : item.template) === null || _a === void 0 ? void 0 : _a.bundle) || ((_b = item === null || item === void 0 ? void 0 : item.bundle) === null || _b === void 0 ? void 0 : _b._id) || manuscript_transform_1.DEFAULT_BUNDLE; };
exports.chooseBundleID = chooseBundleID;
//# sourceMappingURL=templates.js.map