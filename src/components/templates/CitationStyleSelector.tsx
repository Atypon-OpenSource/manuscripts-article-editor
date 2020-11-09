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

import { loadStyle } from '@manuscripts/library'
import {
  ContainedModel,
  fromPrototype,
} from '@manuscripts/manuscript-transform'
import { Bundle, Project } from '@manuscripts/manuscripts-json-schema'
import { Category, Dialog } from '@manuscripts/style-guide'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { importSharedData } from '../../lib/shared-data'
import { Collection } from '../../sync/Collection'
import { ContactSupportButton } from '../ContactSupportButton'
import { CitationStyleSelectorModal } from './CitationStyleSelectorModal'
import { TemplateLoadingModal } from './TemplateLoadingModal'

interface Props {
  handleComplete: (bundle?: Bundle, parentBundle?: Bundle) => void
  collection: Collection<ContainedModel>
  project: Project
}

interface State {
  loadingError?: Error
  bundles?: Bundle[]
}

class CitationStyleSelector extends React.Component<
  Props & RouteComponentProps,
  State
> {
  public state: Readonly<State> = {}

  public async componentDidMount() {
    this.loadBundles().catch((loadingError) => {
      this.setState({ loadingError })
    })
  }

  public render() {
    const { bundles, loadingError } = this.state

    const { handleComplete } = this.props

    if (loadingError) {
      return (
        <Dialog
          isOpen={true}
          category={Category.error}
          header={'Error'}
          message={
            <React.Fragment>
              There was an error loading the citation styles. Please{' '}
              <ContactSupportButton>contact support</ContactSupportButton> if
              this persists.
            </React.Fragment>
          }
          actions={{
            primary: {
              action: handleComplete,
              title: 'OK',
            },
          }}
        />
      )
    }

    if (!bundles) {
      return (
        <TemplateLoadingModal
          handleCancel={() => handleComplete()}
          status={'Loading citation styles…'}
        />
      )
    }

    return (
      <CitationStyleSelectorModal
        handleComplete={handleComplete}
        items={bundles}
        selectBundle={this.selectBundle}
      />
    )
  }

  private async loadBundles() {
    const bundles: Bundle[] = []

    const bundlesMap = await importSharedData<Bundle>('bundles')

    for (const bundle of bundlesMap.values()) {
      // only include bundles with titles
      if (bundle.csl?.title) {
        bundles.push(bundle)
      }
    }

    // sort by title, alphabetically
    bundles.sort((a, b) => a.csl!.title!.localeCompare(b.csl!.title!))

    this.setState({ bundles })
  }

  private saveParentBundle = async (
    bundle: Bundle
  ): Promise<Bundle | undefined> => {
    const { project, collection } = this.props
    const { bundles } = this.state

    if (!bundle.csl) {
      return
    }

    const parentIdentifier = bundle.csl['independent-parent-URL']

    if (!parentIdentifier) {
      return
    }

    if (!bundles) {
      throw new Error('Missing bundles')
    }

    const parentBundle = bundles.find(
      (bundle) => bundle.csl && bundle.csl['self-URL'] === parentIdentifier
    )

    if (!parentBundle) {
      throw new Error(`Missing parent bundle: ${parentIdentifier}`)
    }

    const newParentBundle = fromPrototype(parentBundle)

    await collection.create(newParentBundle, {
      containerID: project._id,
    })

    await this.attachStyle(newParentBundle)

    return newParentBundle
  }

  private selectBundle = async (bundle: Bundle) => {
    const { handleComplete, project, collection } = this.props

    const newBundle = fromPrototype(bundle)

    await collection.create(newBundle, {
      containerID: project._id,
    })

    await this.attachStyle(newBundle)

    const parentBundle = await this.saveParentBundle(newBundle)

    handleComplete(newBundle, parentBundle)
  }

  private attachStyle = async (newBundle: Bundle) => {
    if (newBundle.csl && newBundle.csl.cslIdentifier) {
      const data = await loadStyle(newBundle.csl.cslIdentifier)

      await this.props.collection.putAttachment(newBundle._id, {
        id: 'csl',
        type: 'application/vnd.citationstyles.style+xml',
        data,
      })
    }
  }
}

export default withRouter(CitationStyleSelector)
