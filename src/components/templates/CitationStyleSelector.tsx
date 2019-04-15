/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
import { Database, DatabaseContext } from '../DatabaseProvider'
import { CitationStyleSelectorModal } from './CitationStyleSelectorModal'
import { TemplateLoadingModal } from './TemplateLoadingModal'

interface Props {
  handleComplete: (bundle?: Bundle) => void
  collection: Collection<Manuscript>
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
          message={`There was an error loading the citation styles. Please contact ${
            config.support.email
          } if this persists.`}
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
            selectBundle={this.selectBundle(db)}
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

  private selectBundle = (db: Database) => async (item: Bundle) => {
    const { handleComplete, manuscript, project, collection } = this.props

    const newBundle = fromPrototype(item)

    await collection.create(newBundle, {
      containerID: project._id,
      manuscriptID: manuscript._id,
    })

    await this.attachStyle(newBundle, collection)

    handleComplete(newBundle)
  }
}

export default withRouter(CitationStyleSelector)
