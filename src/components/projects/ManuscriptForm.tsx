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

import { CitationManager } from '@manuscripts/manuscript-editor'
import { DEFAULT_BUNDLE } from '@manuscripts/manuscript-transform'
import { Manuscript } from '@manuscripts/manuscripts-json-schema'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import { OptionsType } from 'react-select/lib/types'
import styled from 'styled-components'
import config from '../../config'
import { ImmediateSelectField } from '../ImmediateSelectField'
import { Loading } from '../Loading'

const StyledForm = styled(Form)`
  padding: 20px;
`

const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`

const LabelText = styled.div`
  margin-bottom: 5px;
`

interface Props {
  manuscript: Manuscript
  saveManuscript: (manuscript: Partial<Manuscript>) => void
}

interface ManuscriptValues {
  bundle: string
  primaryLanguageCode: string
}

interface OptionType {
  label: string
  value: string
}

interface State {
  styles: OptionsType<OptionType>
  locales: OptionsType<OptionType>
}

class ManuscriptForm extends React.Component<Props, State> {
  public state: Readonly<State> = {
    styles: [],
    locales: [],
  }

  public async componentDidMount() {
    const citationManager = new CitationManager(config.data.url)

    const bundles = await citationManager.fetchBundles()
    const locales = await citationManager.fetchLocales()

    this.setState({
      styles: bundles
        .filter(
          bundle => bundle.csl && bundle.csl.cslIdentifier && bundle.csl.title
        )
        .map(bundle => ({
          value: bundle._id,
          label: bundle.csl!.title!,
        })),
      locales: Object.entries(locales['language-names']).map(
        ([value, languageNames]) => ({
          value,
          label: languageNames[0],
        })
      ),
    })
  }

  public render() {
    const { manuscript, saveManuscript } = this.props
    const { styles, locales } = this.state

    if (!styles || !locales) {
      return <Loading>Loading citation styles…</Loading>
    }

    return (
      <Formik<ManuscriptValues>
        initialValues={{
          bundle: manuscript.bundle || DEFAULT_BUNDLE,
          primaryLanguageCode: manuscript.primaryLanguageCode || 'en-GB',
        }}
        onSubmit={saveManuscript}
        enableReinitialize={true}
      >
        <StyledForm>
          <Label>
            <LabelText>Citation Style</LabelText>

            <Field
              name={'bundle'}
              component={ImmediateSelectField}
              options={styles}
            />
          </Label>

          <Label>
            <LabelText>Locale</LabelText>

            <Field
              name={'primaryLanguageCode'}
              component={ImmediateSelectField}
              options={locales}
            />
          </Label>
        </StyledForm>
      </Formik>
    )
  }
}

export default ManuscriptForm
