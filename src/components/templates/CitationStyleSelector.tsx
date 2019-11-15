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

import { ContainedModel } from '@manuscripts/manuscript-transform'
import {
  Bundle,
  Manuscript,
  Project,
} from '@manuscripts/manuscripts-json-schema'
import { Category, Dialog } from '@manuscripts/style-guide'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import config from '../../config'
import { fetchSharedData, fromPrototype } from '../../lib/templates'
import { Collection } from '../../sync/Collection'
import { DatabaseContext } from '../DatabaseProvider'
import { CitationStyleSelectorModal } from './CitationStyleSelectorModal'
import { TemplateLoadingModal } from './TemplateLoadingModal'

interface Props {
  handleComplete: (bundle?: Bundle, parentBundle?: Bundle) => void
  collection: Collection<ContainedModel>
  manuscript: Manuscript
  project: Project
}

interface State {
  loadingError?: Error
  bundlesMap?: Map<string, Bundle>
  bundles?: Bundle[]
}

class CitationStyleSelector extends React.Component<
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
    const { bundles, loadingError } = this.state

    const { handleComplete } = this.props

    if (loadingError) {
      return (
        <Dialog
          isOpen={true}
          category={Category.error}
          header={'Error'}
          message={`There was an error loading the citation styles. Please contact ${config.support.email} if this persists.`}
          actions={{
            primary: {
              action: this.props.handleComplete,
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
      <DatabaseContext.Consumer>
        {db => (
          <CitationStyleSelectorModal
            handleComplete={handleComplete}
            items={bundles}
            selectBundle={this.selectBundle}
          />
        )}
      </DatabaseContext.Consumer>
    )
  }

  private async loadData() {
    const bundlesMap = await fetchSharedData<Bundle>('bundles')

    const bundles = Array.from(bundlesMap.values())
      .filter(bundle => bundle.csl && bundle.csl.title)
      .sort((a, b) => a.csl!.title!.localeCompare(b.csl!.title!))

    this.setState({
      bundlesMap,
      bundles,
    })
  }

  private attachStyle = async (newBundle: Bundle) => {
    if (newBundle.csl && newBundle.csl.cslIdentifier) {
      const { CitationManager } = await import('@manuscripts/manuscript-editor')

      const citationManager = new CitationManager(config.data.url)
      const cslStyle = await citationManager.fetchCitationStyleString(newBundle)

      await this.props.collection.putAttachment(newBundle._id, {
        id: 'csl',
        data: cslStyle,
        type: 'application/vnd.citationstyles.style+xml',
      })
    }
  }

  private saveParentBundle = async (
    bundle: Bundle
  ): Promise<Bundle | undefined> => {
    const { manuscript, project, collection } = this.props
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
      bundle => bundle.csl && bundle.csl['self-URL'] === parentIdentifier
    )

    if (!parentBundle) {
      throw new Error(`Missing parent bundle: ${parentIdentifier}`)
    }

    const newParentBundle = fromPrototype(parentBundle)

    await collection.create(newParentBundle, {
      containerID: project._id,
      manuscriptID: manuscript._id,
    })

    await this.attachStyle(newParentBundle)

    return newParentBundle
  }

  private selectBundle = async (bundle: Bundle) => {
    const { handleComplete, manuscript, project, collection } = this.props

    const newBundle = fromPrototype(bundle)

    await collection.create(newBundle, {
      containerID: project._id,
      manuscriptID: manuscript._id,
    })

    await this.attachStyle(newBundle)

    const parentBundle = await this.saveParentBundle(newBundle)

    handleComplete(newBundle, parentBundle)
  }
}

export default withRouter(CitationStyleSelector)
