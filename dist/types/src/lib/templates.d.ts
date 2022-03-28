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
import { Build, ManuscriptModel } from '@manuscripts/manuscript-transform';
import { Bundle, ManuscriptCategory, ManuscriptTemplate, Model, ObjectTypes, PageLayout, Publisher, ResearchField, Section, SectionCategory, SectionDescription } from '@manuscripts/manuscripts-json-schema';
import { Requirement, SectionCountRequirement } from './requirements';
import { SharedData } from './shared-data';
export declare type ManuscriptTemplateData = Pick<ManuscriptTemplate, Exclude<keyof ManuscriptTemplate, 'containerID' | 'manuscriptID' | 'sessionID'>>;
export interface TemplateData {
    template?: ManuscriptTemplateData;
    bundle?: Bundle;
    title: string;
    articleType?: string;
    publisher?: Publisher;
    category?: string;
    titleAndType: string;
}
export declare type TemplatesDataType = ManuscriptTemplate | Requirement;
export declare const RESEARCH_ARTICLE_CATEGORY = "MPManuscriptCategory:research-article";
export declare const COVER_LETTER_CATEGORY = "MPManuscriptCategory:cover-letter";
export declare const DEFAULT_CATEGORY = "MPManuscriptCategory:research-article";
export declare const COVER_LETTER_SECTION_CATEGORY = "MPSectionCategory:cover-letter";
export declare const COVER_LETTER_PLACEHOLDER = "A letter sent along with your manuscript to explain it.";
export declare const sectionRequirementTypes: Map<keyof SectionDescription, ObjectTypes>;
export declare const prepareSectionRequirements: (section: Build<Section>, sectionDescription: SectionDescription, templatesData?: Map<string, TemplatesDataType> | undefined) => Array<Build<SectionCountRequirement>>;
export declare const chooseSectionTitle: (sectionDescription: SectionDescription, sectionCategory?: SectionCategory | undefined) => string;
export declare const buildSectionFromDescription: (templatesData: Map<string, TemplatesDataType>, sectionDescription: SectionDescription, sectionCategory?: SectionCategory | undefined) => {
    section: Build<Section>;
    dependencies: Build<Model>[];
};
export declare const createManuscriptSectionsFromTemplate: (templatesData: Map<string, TemplatesDataType>, sectionCategories: Map<string, SectionCategory>, sectionDescriptions: SectionDescription[]) => Array<Build<ManuscriptModel>>;
export declare const createMergedTemplate: (template: ManuscriptTemplateData, manuscriptTemplates?: Map<string, ManuscriptTemplateData> | undefined) => ManuscriptTemplateData;
export declare const createEmptyParagraph: (pageLayout: PageLayout) => Build<import("@manuscripts/manuscripts-json-schema").ParagraphElement>;
export declare const buildCategories: (items: Map<string, ManuscriptCategory>) => ManuscriptCategory[];
export declare const buildResearchFields: (items: Map<string, ResearchField>) => ResearchField[];
export declare const buildItems: (sharedData: SharedData) => TemplateData[];
export declare const buildJournalTitle: (template: ManuscriptTemplate, parentTemplate?: ManuscriptTemplate | undefined, bundle?: Bundle | undefined) => string;
export declare const buildArticleType: (template: ManuscriptTemplate, parentTemplate?: ManuscriptTemplate | undefined) => string;
export declare const findParentTemplate: (templates: Map<string, ManuscriptTemplate>, userTemplates: Map<string, ManuscriptTemplate>, parent: string) => ManuscriptTemplate | undefined;
export declare const buildTemplateDataFactory: (sharedData: SharedData) => (template: ManuscriptTemplate) => TemplateData;
export declare const chooseBundleID: (item?: TemplateData | undefined) => string;
