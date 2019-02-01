import { CitationManager, DEFAULT_BUNDLE } from '@manuscripts/manuscript-editor'
import { Manuscript } from '@manuscripts/manuscripts-json-schema'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import { OptionsType } from 'react-select/lib/types'
import config from '../../config'
import { styled } from '../../theme/styled-components'
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
      return <Loading />
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
