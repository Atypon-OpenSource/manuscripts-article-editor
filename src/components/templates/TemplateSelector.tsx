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
  buildContributor,
  buildManuscript,
  buildProject,
  buildSection,
  ContainedModel,
  DEFAULT_BUNDLE,
  generateID,
} from '@manuscripts/manuscript-transform'
import {
  Bundle,
  Contributor,
  Manuscript,
  ManuscriptCategory,
  Model,
  ObjectTypes,
  ParagraphElement,
  Project,
  Section,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { Category, Dialog } from '@manuscripts/style-guide'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import config from '../../config'
import { nextManuscriptPriority } from '../../lib/manuscript'
import { postWebkitMessage } from '../../lib/native'
import { ContributorRole } from '../../lib/roles'
import {
  buildCategories,
  buildItems,
  buildResearchFields,
  buildSectionFromDescription,
  chooseBundleID,
  chooseSectionTitle,
  COVER_LETTER_CATEGORY,
  COVER_LETTER_PLACEHOLDER,
  COVER_LETTER_SECTION_CATEGORY,
  createCoverLetterDescription,
  createEmptyParagraph,
  createManuscriptSectionsFromTemplate,
  createMergedTemplate,
  createNewStyles,
  fetchSharedData,
  findCoverLetterDescription,
  fromPrototype,
  isCoverLetter,
  isMandatorySubsectionsRequirement,
  prepareRequirements,
  RESEARCH_ARTICLE_CATEGORY,
  updatedPageLayout,
} from '../../lib/templates'
import { Collection } from '../../sync/Collection'
import {
  ManuscriptTemplate,
  Publisher,
  RequirementType,
  ResearchField,
  SectionCategory,
  SectionDescription,
  TemplateData,
  TemplatesDataType,
} from '../../types/templates'
import { ContactSupportButton } from '../ContactSupportButton'
import { Database, DatabaseContext } from '../DatabaseProvider'
import {
  createProjectCollection,
  importManuscript,
  openProjectsCollection,
} from '../projects/ImportManuscript'
import { PseudoProjectPage } from './PseudoProjectPage'
import { TemplateLoadingModal } from './TemplateLoadingModal'
import { TemplateSelectorModal } from './TemplateSelectorModal'

interface Props {
  handleComplete: (isCancellation?: boolean) => void
  user: UserProfile
  projectID?: string
}

interface State {
  loadingError?: Error
  bundles?: Map<string, Bundle>
  styles?: Map<string, Model>
  manuscriptCategories?: Map<string, ManuscriptCategory>
  sectionCategories?: Map<string, SectionCategory>
  manuscriptTemplates?: Map<string, ManuscriptTemplate>
  publishers?: Map<string, Publisher>
  templatesData?: Map<string, TemplatesDataType>
  researchFields?: Map<string, ResearchField>
}

class TemplateSelector extends React.Component<
  Props & RouteComponentProps,
  State
> {
  public state: Readonly<State> = {}

  public async componentDidMount() {
    this.loadData().catch(loadingError => {
      this.setState({ loadingError })
    })
  }

  public render() {
    const {
      bundles,
      loadingError,
      manuscriptCategories,
      manuscriptTemplates,
      publishers,
      researchFields,
      styles,
    } = this.state

    const { history, handleComplete, user, projectID } = this.props

    if (loadingError) {
      return (
        <Dialog
          isOpen={true}
          category={Category.error}
          header={'Error'}
          message={
            <React.Fragment>
              There was an error loading the templates. Please{' '}
              <ContactSupportButton>contact support</ContactSupportButton> if
              this persists.
            </React.Fragment>
          }
          actions={{
            primary: {
              action: this.handleCancellation,
              title: 'OK',
            },
          }}
        />
      )
    }

    if (
      !manuscriptTemplates ||
      !manuscriptCategories ||
      !bundles ||
      !publishers ||
      !styles ||
      !researchFields
    ) {
      return (
        <TemplateLoadingModal
          handleCancel={this.handleCancellation}
          status={'Thinking hard…'}
        />
      )
    }

    return (
      <DatabaseContext.Consumer>
        {db => (
          <>
            {!projectID && <PseudoProjectPage />}

            <TemplateSelectorModal
              categories={buildCategories(manuscriptCategories)}
              researchFields={buildResearchFields(researchFields)}
              createEmpty={this.createEmpty(db)}
              importManuscript={importManuscript(
                db,
                history,
                user,
                handleComplete,
                projectID
              )}
              handleComplete={this.handleCancellation}
              items={buildItems(manuscriptTemplates, bundles, publishers)}
              selectTemplate={this.selectTemplate(db)}
            />
          </>
        )}
      </DatabaseContext.Consumer>
    )
  }

  private async loadData() {
    // this.setState({ loading: 'categories' })

    const manuscriptCategories = await fetchSharedData<ManuscriptCategory>(
      'manuscript-categories'
    )

    const sectionCategories = await fetchSharedData<SectionCategory>(
      'section-categories'
    )

    // this.setState({ loading: 'publishers' })

    const publishers = await fetchSharedData<Publisher>('publishers')

    // this.setState({ loading: 'fields' })

    const keywords = await fetchSharedData<ResearchField>('keywords')

    const researchFields = new Map<string, ResearchField>()

    for (const item of keywords.values()) {
      if (item.objectType === 'MPResearchField') {
        researchFields.set(item._id, item)
      }
    }

    // this.setState({ loading: 'bundles' })

    const bundles = await fetchSharedData<Bundle>('bundles')

    // this.setState({ loading: 'styles' })

    const styles = await fetchSharedData<Model>('styles')

    // this.setState({ loading: 'templates' })

    const templatesData = await fetchSharedData<TemplatesDataType>(
      'templates-v2'
    )

    const manuscriptTemplates = new Map<string, ManuscriptTemplate>()

    for (const item of templatesData.values()) {
      if (item.objectType === 'MPManuscriptTemplate') {
        manuscriptTemplates.set(item._id, item as ManuscriptTemplate)
      }
    }

    this.setState({
      bundles,
      styles,
      manuscriptCategories,
      sectionCategories,
      manuscriptTemplates,
      publishers,
      templatesData,
      researchFields,
      // loading: undefined,
    })
  }

  // tslint:disable-next-line:cyclomatic-complexity
  private createEmpty = (db: Database) => async () => {
    const {
      handleComplete,
      history,
      user,
      projectID: possibleProjectID,
    } = this.props

    const { bundles, styles } = this.state

    if (!bundles) {
      throw new Error('Bundles not found')
    }

    if (!styles) {
      throw new Error('Styles not found')
    }

    const newProject = possibleProjectID ? null : buildProject(user.userID)

    const projectID = newProject ? newProject._id : possibleProjectID!

    if (newProject) {
      const projectsCollection = openProjectsCollection()
      await projectsCollection.create(newProject)
    }

    const collection = await createProjectCollection(db, projectID)

    const priority = await nextManuscriptPriority(collection as Collection<
      Manuscript
    >)

    const newBundle = this.createNewBundle(DEFAULT_BUNDLE, bundles)

    const newStyles = createNewStyles(styles)

    const newPageLayout = updatedPageLayout(newStyles)

    // const colorScheme = this.findDefaultColorScheme(newStyles)

    const manuscript = {
      ...buildManuscript(),
      bundle: newBundle._id,
      pageLayout: newPageLayout._id,
      // colorScheme: colorScheme ? colorScheme._id : DEFAULT_COLOR_SCHEME,
      priority,
    }

    const contributor = buildContributor(
      user.bibliographicName,
      ContributorRole.author,
      0,
      user.userID
    )

    const saveContainedModel = <T extends Model>(data: Build<T>) =>
      collection.create(data, {
        containerID: projectID,
      })

    const saveManuscriptModel = <T extends Model>(data: Build<T>) =>
      collection.create(data, {
        containerID: projectID,
        manuscriptID: manuscript._id,
      })

    await saveContainedModel<Bundle>(newBundle)
    await this.attachStyle(newBundle, collection)

    const parentBundle = this.createParentBundle(newBundle, bundles)

    if (parentBundle) {
      await saveContainedModel<Bundle>(parentBundle)
      await this.attachStyle(parentBundle, collection)
    }

    for (const newStyle of newStyles.values()) {
      await saveManuscriptModel<Model>(newStyle)
    }

    await saveManuscriptModel<Contributor>(contributor)

    const paragraph = createEmptyParagraph(newPageLayout)

    await saveManuscriptModel<ParagraphElement>(paragraph)

    await saveManuscriptModel<Section>({
      ...buildSection(),
      elementIDs: [paragraph._id],
    })

    await saveContainedModel<Manuscript>(manuscript)

    history.push(`/projects/${projectID}/manuscripts/${manuscript._id}`)

    if (newProject) {
      this.sendNewProjectNotification(projectID)
    }

    handleComplete()
  }

  private buildNewProject = (): Build<Project> | undefined => {
    const { projectID, user } = this.props

    return projectID ? undefined : buildProject(user.userID)
  }

  // private fixReferencedStyleIds = (
  //   newStyles: Map<string, Model>,
  //   prototypeMap: Map<string, string>
  // ) => {
  //   for (const style of newStyles.values()) {
  //     if (isColorScheme(style)) {
  //       style.colors = (style.colors || [])
  //         .map(id => prototypeMap.get(id))
  //         .filter(Boolean) as Color[]
  //     }
  //   }
  // }

  // private findDefaultColorScheme = (newStyles: Map<string, Model>) => {
  //   for (const style of newStyles.values()) {
  //     if (isColorScheme(style)) {
  //       if (style.prototype === DEFAULT_COLOR_SCHEME) {
  //         return style
  //       }
  //     }
  //   }
  // }

  private createNewBundle = (
    bundleID: string,
    bundles: Map<string, Bundle>
  ) => {
    const bundle = bundles.get(bundleID)

    if (!bundle) {
      throw new Error(`Bundle not found: ${bundleID}`)
    }

    return fromPrototype(bundle)
  }

  private findBundleByURL = (url: string, bundles: Map<string, Bundle>) => {
    for (const bundle of bundles.values()) {
      if (bundle.csl && bundle.csl['self-URL'] === url) {
        return bundle
      }
    }
  }

  private createParentBundle = (
    bundle: Bundle,
    bundles: Map<string, Bundle>
  ) => {
    if (bundle.csl) {
      const parentURL = bundle.csl['independent-parent-URL']

      if (parentURL) {
        const parentBundle = this.findBundleByURL(parentURL, bundles)

        if (!parentBundle) {
          throw new Error(`Bundle with URL not found: ${parentURL} `)
        }

        return fromPrototype(parentBundle)
      }
    }
  }

  private attachStyle = async (
    newBundle: Bundle,
    collection: Collection<ContainedModel>
  ) => {
    if (newBundle.csl && newBundle.csl.cslIdentifier) {
      const { CitationManager } = await import('@manuscripts/manuscript-editor')

      const citationManager = new CitationManager(config.data.url)
      const cslStyle = await citationManager.fetchCitationStyleString(newBundle)

      await collection.putAttachment(newBundle._id, {
        id: 'csl',
        data: cslStyle,
        type: 'application/vnd.citationstyles.style+xml',
      })
    }
  }

  // tslint:disable:cyclomatic-complexity
  private selectTemplate = (db: Database) => async (item: TemplateData) => {
    const {
      bundles,
      styles,
      templatesData,
      sectionCategories,
      manuscriptTemplates,
    } = this.state

    if (!bundles) {
      throw new Error('Bundles not found')
    }

    if (!styles) {
      throw new Error('Styles not found')
    }

    const { handleComplete, history, user } = this.props

    const newProject = this.buildNewProject()

    if (newProject) {
      const projectsCollection = openProjectsCollection()
      await projectsCollection.create(newProject)
    }

    const projectID: string = newProject
      ? newProject._id
      : this.props.projectID!

    const newBundle = this.createNewBundle(chooseBundleID(item), bundles)

    const collection = await createProjectCollection(db, projectID)

    const priority = newProject
      ? 1
      : await nextManuscriptPriority(collection as Collection<Manuscript>)

    const newStyles = createNewStyles(styles)

    const newPageLayout = updatedPageLayout(newStyles)

    // const colorScheme = this.findDefaultColorScheme(newStyles)

    const manuscript: Build<Manuscript> = {
      ...buildManuscript(),
      bundle: newBundle._id,
      pageLayout: newPageLayout._id,
      priority,
      // colorScheme: colorScheme ? colorScheme._id : DEFAULT_COLOR_SCHEME,
    }

    const saveContainedModel = <T extends Model>(data: Build<T>) =>
      collection.create(data, {
        containerID: projectID,
      })

    const saveManuscriptModel = <T extends Model>(data: Build<T>) =>
      collection.create(data, {
        containerID: projectID,
        manuscriptID: manuscript._id,
      })

    await saveContainedModel<Bundle>(newBundle)
    await this.attachStyle(newBundle, collection)

    const parentBundle = this.createParentBundle(newBundle, bundles)

    if (parentBundle) {
      await saveContainedModel<Bundle>(parentBundle)
      await this.attachStyle(parentBundle, collection)
    }

    for (const newStyle of newStyles.values()) {
      await saveManuscriptModel<Model>(newStyle)
    }

    const contributor = buildContributor(
      user.bibliographicName,
      ContributorRole.author,
      0,
      user.userID
    )

    await saveManuscriptModel<Contributor>(contributor)

    if (item.template) {
      // merge the templates
      const mergedTemplate = createMergedTemplate(
        item.template,
        manuscriptTemplates
      )

      // save the requirements
      // TODO: build a new requirements object and save it to the template, or re-use the existing one?

      const requirements = prepareRequirements(mergedTemplate, templatesData)

      mergedTemplate.requirementIDs = await Promise.all(
        requirements.map(async requirement => {
          requirement._id = generateID(requirement.objectType as ObjectTypes)
          await saveManuscriptModel<RequirementType>(requirement)
          return requirement._id
        })
      )

      const mandatorySubsectionsRequirements = requirements.filter(
        isMandatorySubsectionsRequirement
      )

      const requiredSections: SectionDescription[] = mandatorySubsectionsRequirements.flatMap(
        requirement =>
          requirement.embeddedSectionDescriptions.filter(
            sectionDescription => !isCoverLetter(sectionDescription)
          )
      )

      if (requiredSections.length && sectionCategories) {
        // create the required sections, if there are any
        const items = createManuscriptSectionsFromTemplate(
          requiredSections,
          sectionCategories
        )

        for (const item of items) {
          await saveManuscriptModel(item)
        }
      } else {
        // create an empty section, if there are no required sections
        const paragraph = createEmptyParagraph(newPageLayout)

        await saveManuscriptModel<ParagraphElement>(paragraph)

        await saveManuscriptModel<Section>({
          ...buildSection(),
          elementIDs: [paragraph._id],
        })
      }

      await saveManuscriptModel(mergedTemplate)

      // create a cover letter manuscript alongside the first manuscript, if it's a research article or has a cover letter section description in the template
      if (priority === 1 && sectionCategories) {
        // create a cover letter manuscript
        let coverLetterDescription:
          | SectionDescription
          | undefined = findCoverLetterDescription(
          mandatorySubsectionsRequirements
        )

        if (
          !coverLetterDescription &&
          mergedTemplate.category === RESEARCH_ARTICLE_CATEGORY
        ) {
          coverLetterDescription = createCoverLetterDescription()
        }

        if (coverLetterDescription) {
          const sectionCategory = sectionCategories.get(
            COVER_LETTER_SECTION_CATEGORY
          )

          const manuscriptTitle = chooseSectionTitle(
            coverLetterDescription,
            sectionCategory
          )

          const extraManuscript = buildManuscript(manuscriptTitle)

          const containerIDs = {
            containerID: projectID,
            manuscriptID: extraManuscript._id,
          }

          if (!coverLetterDescription.placeholder) {
            coverLetterDescription.placeholder = COVER_LETTER_PLACEHOLDER
          }

          const { section, dependencies } = buildSectionFromDescription(
            coverLetterDescription,
            1 // the cover letter only has one section
          )

          section.titleSuppressed = true

          for (const dependency of dependencies) {
            await collection.save(dependency, containerIDs)
          }

          await collection.save(section, containerIDs)

          await saveContainedModel<Manuscript>({
            ...extraManuscript,
            bundle: newBundle._id,
            category: COVER_LETTER_CATEGORY,
            priority: 2, // the cover letter is always the second manuscript
          })
        }
      }
    }

    // save the manuscript
    await saveContainedModel<Manuscript>(manuscript)

    // NOTE: not saving the shared data to the project

    history.push(`/projects/${projectID}/manuscripts/${manuscript._id}`)

    if (newProject) {
      this.sendNewProjectNotification(projectID)
    }

    handleComplete()
  }

  private sendNewProjectNotification = (projectID: string) => {
    postWebkitMessage('action', {
      name: 'assign-project',
      projectID,
    })
  }

  private handleCancellation = () => {
    this.props.handleComplete(true)
  }
}

export default withRouter(TemplateSelector)
