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

import {
  Build,
  generateID,
  ManuscriptModel,
  ModelAttachment,
} from '@manuscripts/manuscript-transform'
import {
  MandatorySubsectionsRequirement,
  Manuscript,
  ManuscriptTemplate,
  Model,
  ObjectTypes,
  ParagraphElement,
  Section,
  SectionDescription,
} from '@manuscripts/manuscripts-json-schema'

import { isSection } from './manuscript'
import {
  ManuscriptCountRequirement,
  manuscriptCountRequirementFields,
  ManuscriptCountRequirementType,
  SectionCountRequirement,
  sectionCountRequirementFields,
} from './requirements'

interface SubsectionDescription {
  title: string
  placeholder?: string
  paragraphStyle?: string
}

// const isPageLayout = hasObjectType<PageLayout>(ObjectTypes.PageLayout)

export const buildTemplateModels = (
  manuscript: Manuscript,
  template: Build<ManuscriptTemplate>,
  modelMap: Map<string, Model>
): Array<Build<ManuscriptModel & ModelAttachment>> => {
  const output: Array<Build<ManuscriptModel>> = []

  // TODO: only include those that have been modified from defaults (and then defaults should be excluded when creating manuscript from template)?

  // page layout

  // if (manuscript.pageLayout) {
  //   const pageLayout = modelMap.get(manuscript.pageLayout) as
  //     | PageLayout
  //     | undefined
  //
  //   if (pageLayout) {
  //     const {
  //       beginChaptersOnRightHandPages,
  //       bottomMargin,
  //       defaultParagraphStyle,
  //       displayUnits,
  //       leftMargin,
  //       mirrorPagesHorizontally,
  //       pageSize,
  //       rightMargin,
  //       topMargin,
  //       prototype,
  //     } = pageLayout
  //
  //     const newPageLayout: Build<PageLayout> & { prototype?: string } = {
  //       _id: generateID(ObjectTypes.PageLayout),
  //       objectType: ObjectTypes.PageLayout,
  //       beginChaptersOnRightHandPages,
  //       bottomMargin,
  //       defaultParagraphStyle,
  //       displayUnits,
  //       leftMargin,
  //       mirrorPagesHorizontally,
  //       pageSize,
  //       rightMargin,
  //       topMargin,
  //       prototype,
  //     }
  //
  //     if (pageLayout.embeddedNumberingStyle) {
  //       const {
  //         numberingScheme,
  //         prefix,
  //         suffix,
  //         startIndex,
  //       } = pageLayout.embeddedNumberingStyle
  //
  //       // template.embeddedPageNumberingStyle = {
  //       newPageLayout.embeddedNumberingStyle = {
  //         _id: generateID(ObjectTypes.NumberingStyle),
  //         objectType: ObjectTypes.NumberingStyle,
  //         numberingScheme,
  //         prefix,
  //         suffix,
  //         startIndex,
  //       }
  //     }
  //   }
  // }

  // const styles: { [key: string]: boolean } = {}
  //
  // for (const model of modelMap.values()) {
  //   if (isColor(model)) {
  //     const { priority, value, title, prototype } = model
  //
  //     const color: Build<Color> & { prototype?: string } = {
  //       _id: generateID(ObjectTypes.Color),
  //       objectType: ObjectTypes.Color,
  //       priority,
  //       value,
  //       title,
  //       prototype, // TODO: change the prototype?
  //     }
  //
  //     // TODO: update references to the old model?
  //
  //     output.push(color)
  //
  //     styles[color._id] = true
  //   } else if (isColorScheme(model)) {
  //     const { priority, colors, title, prototype } = model
  //
  //     const colorScheme: Build<ColorScheme> & { prototype?: string } = {
  //       _id: generateID(ObjectTypes.ColorScheme),
  //       objectType: ObjectTypes.ColorScheme,
  //       priority,
  //       colors,
  //       title,
  //       prototype,
  //     }
  //
  //     output.push(colorScheme)
  //
  //     // TODO: update references to the old model?
  //
  //     styles[colorScheme._id] = true
  //   } else if (isParagraphStyle(model)) {
  //     // TODO: copy all the non-standard fields?
  //     const {
  //       alignment,
  //       bottomSpacing,
  //       firstLineIndent,
  //       headIndent,
  //       hideListNumberingSuffixForLastLevel,
  //       hierarchicalListNumbering,
  //       kind,
  //       lineSpacing,
  //       name,
  //       preferredXHTMLElement,
  //       priority,
  //       prototype,
  //       sectionNumberingStyle,
  //       tailIndent,
  //       textStyling,
  //       title,
  //       topSpacing,
  //     } = model
  //
  //     const paragraphStyle: Build<ParagraphStyle> & { prototype?: string } = {
  //       _id: generateID(ObjectTypes.ParagraphStyle),
  //       objectType: ObjectTypes.ParagraphStyle,
  //       alignment,
  //       bottomSpacing,
  //       firstLineIndent,
  //       headIndent,
  //       hideListNumberingSuffixForLastLevel,
  //       hierarchicalListNumbering,
  //       kind,
  //       lineSpacing,
  //       name,
  //       preferredXHTMLElement,
  //       priority,
  //       prototype,
  //       sectionNumberingStyle, // TODO: only properties
  //       tailIndent,
  //       textStyling, // TODO: only properties
  //       title,
  //       topSpacing,
  //     }
  //
  //     if (model.embeddedListItemBulletStyles) {
  //       paragraphStyle.embeddedListItemBulletStyles = {}
  //
  //       for (const [listLevel, embeddedListItemBulletStyle] of Object.entries(
  //         model.embeddedListItemBulletStyles
  //       )) {
  //         const { bulletStyle, customBullet } = embeddedListItemBulletStyle
  //
  //         paragraphStyle.embeddedListItemBulletStyles[listLevel] = {
  //           _id: generateID(ObjectTypes.ListItemBulletStyle),
  //           objectType: ObjectTypes.ListItemBulletStyle,
  //           bulletStyle,
  //           customBullet,
  //         }
  //       }
  //     }
  //
  //     if (model.embeddedListItemNumberingStyles) {
  //       paragraphStyle.embeddedListItemNumberingStyles = {}
  //
  //       for (const [
  //         listLevel,
  //         embeddedListItemNumberingStyle,
  //       ] of Object.entries(model.embeddedListItemNumberingStyles)) {
  //         const {
  //           numberingScheme,
  //           prefix,
  //           suffix,
  //           startIndex,
  //         } = embeddedListItemNumberingStyle
  //
  //         paragraphStyle.embeddedListItemNumberingStyles[listLevel] = {
  //           _id: generateID(ObjectTypes.NumberingStyle),
  //           objectType: ObjectTypes.NumberingStyle,
  //           numberingScheme,
  //           prefix,
  //           suffix,
  //           startIndex,
  //         }
  //       }
  //     }
  //
  //     output.push(paragraphStyle)
  //
  //     // TODO: update references to the old model?
  //
  //     styles[paragraphStyle._id] = true
  //   } else if (isPageLayout(model)) {
  //     const {
  //       beginChaptersOnRightHandPages,
  //       bottomMargin,
  //       defaultParagraphStyle,
  //       displayUnits,
  //       leftMargin,
  //       mirrorPagesHorizontally,
  //       pageSize,
  //       rightMargin,
  //       topMargin,
  //       prototype,
  //     } = model
  //
  //     const pageLayout: Build<PageLayout> & { prototype?: string } = {
  //       _id: generateID(ObjectTypes.PageLayout),
  //       objectType: ObjectTypes.PageLayout,
  //       beginChaptersOnRightHandPages,
  //       bottomMargin,
  //       defaultParagraphStyle, // TODO: use the new id?
  //       displayUnits,
  //       leftMargin,
  //       mirrorPagesHorizontally,
  //       pageSize,
  //       rightMargin,
  //       topMargin,
  //       prototype,
  //     }
  //
  //     if (model.embeddedNumberingStyle) {
  //       const {
  //         numberingScheme,
  //         prefix,
  //         suffix,
  //         startIndex,
  //       } = model.embeddedNumberingStyle
  //
  //       pageLayout.embeddedNumberingStyle = {
  //         _id: generateID(ObjectTypes.NumberingStyle),
  //         objectType: ObjectTypes.NumberingStyle,
  //         numberingScheme,
  //         prefix,
  //         suffix,
  //         startIndex,
  //       }
  //     }
  //
  //     output.push(pageLayout)
  //
  //     styles[pageLayout._id] = true
  //
  //     if (model._id === manuscript.pageLayout) {
  //       template.pageLayout = pageLayout._id
  //     }
  //   }
  // }
  //
  // template.styles = styles

  // manuscript count requirements

  const addManuscriptCountRequirements = (
    manuscript: Manuscript,
    template: Build<ManuscriptTemplate>
  ) => {
    for (const requirementField of manuscriptCountRequirementFields) {
      const requirementID = manuscript[requirementField]

      let requirement: ManuscriptCountRequirement | undefined
      if (requirementID) {
        requirement = modelMap.get(requirementID) as
          | ManuscriptCountRequirement
          | undefined
      } else if (manuscript.prototype) {
        // TODO: infer requirements from prototype
        // const template = getTemplate(manuscript.prototype)
        // const requirementID = template && template[requirementField]
        // requirement = requirementID
        //   ? (getRequirement(requirementID) as ManuscriptCountRequirement)
        //   : undefined
      }
      if (requirement && requirement.ignored === false) {
        const objectType = requirement.objectType as ManuscriptCountRequirementType

        // TODO: fromPrototype?
        const newRequirement: Build<ManuscriptCountRequirement> = {
          _id: generateID(objectType),
          objectType,
          count: requirement.count,
          severity: requirement.severity,
        }

        output.push(newRequirement)

        template[requirementField] = newRequirement._id
      }
    }
  }

  addManuscriptCountRequirements(manuscript, template)

  // section count requirements

  const addSectionCountRequirements = (
    section: Section,
    sectionDescription: SectionDescription
  ) => {
    for (const [
      sectionField,
      sectionDescriptionField,
    ] of sectionCountRequirementFields) {
      const requirementID = section[sectionField]

      if (requirementID) {
        const requirement = modelMap.get(requirementID) as
          | SectionCountRequirement
          | undefined

        if (requirement && requirement.ignored === false) {
          sectionDescription[sectionDescriptionField] = requirement.count // NOTE: not using the Requirement object
        }
      }
    }
  }

  // sections

  for (const model of modelMap.values()) {
    if (isSection(model)) {
      const elementIDs = model.elementIDs || []

      // TODO: section.placeholderTitle?
      const placeholder = elementIDs.length
        ? (modelMap.get(elementIDs[0]) as ParagraphElement | undefined)
            ?.placeholderInnerHTML
        : undefined

      const sectionDescription: SectionDescription = {
        _id: generateID(ObjectTypes.SectionDescription),
        objectType: ObjectTypes.SectionDescription,
        sectionCategory:
          model.category ||
          (elementIDs.length === 1
            ? 'MPSectionCategory:section'
            : 'MPSectionCategory:subsection'),
        required: true,
        title: model.title, // TODO: convert to plain text?
        placeholder,
        // paragraphStyle: section.paragraphStyle,
        // titleSuppressed: section.titleSuppressed,
      }

      addSectionCountRequirements(model, sectionDescription)

      const subsections: SubsectionDescription[] = []

      for (const elementID of elementIDs) {
        const model = modelMap.get(elementID)

        if (model && isSection(model)) {
          const title = model.title

          if (title) {
            const elementIDs = model.elementIDs || []

            // TODO: section.placeholderTitle?
            const placeholder = elementIDs.length
              ? (modelMap.get(elementIDs[0]) as ParagraphElement | undefined)
                  ?.placeholderInnerHTML
              : undefined

            subsections.push({ title, placeholder })
          }
        }
      }

      if (subsections.length) {
        sectionDescription.subsections = subsections
      }

      const requirement: Build<MandatorySubsectionsRequirement> = {
        _id: generateID(ObjectTypes.MandatorySubsectionsRequirement),
        objectType: ObjectTypes.MandatorySubsectionsRequirement,
        evaluatedObject: template._id, // TODO
        severity: 0,
        embeddedSectionDescriptions: [sectionDescription],
      }

      if (!template.mandatorySectionRequirements) {
        template.mandatorySectionRequirements = []
      }

      template.mandatorySectionRequirements.push(requirement._id)

      output.push(requirement)
    }
  }

  return output
}
