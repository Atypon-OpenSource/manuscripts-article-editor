import { Field, Form, Formik } from 'formik'
import React from 'react'
import { Option } from 'react-select'
import { ImmediateSelectField } from '../components/ImmediateSelectField'
import { Spinner } from '../components/Spinner'
import { Selected } from '../editor/lib/utils'
import CitationManager, { DEFAULT_BUNDLE } from '../lib/csl'
import { styled } from '../theme'
import { Manuscript } from '../types/components'

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
  saveManuscript: (manuscript: Manuscript) => void
  selected: Selected | null
}

interface State {
  styles: Option[]
  locales: Option[]
}

class InspectorContainer extends React.Component<Props, State> {
  public state: Readonly<State> = {
    styles: [],
    locales: [],
  }

  public async componentDidMount() {
    const citationManager = new CitationManager()

    const bundles = await citationManager.fetchBundles()
    const locales = await citationManager.fetchLocales()

    this.setState({
      styles: bundles
        .filter(
          bundle => bundle.csl && bundle.csl.cslIdentifier && bundle.csl.title
        )
        .map(bundle => ({
          value: bundle._id,
          label: bundle.csl!.title,
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
      return <Spinner />
    }

    const initialValues: Partial<Manuscript> = {
      targetBundle: manuscript.targetBundle || DEFAULT_BUNDLE,
      primaryLanguageCode: manuscript.primaryLanguageCode || 'en-GB',
    }

    return (
      <Formik
        initialValues={initialValues}
        onSubmit={saveManuscript}
        enableReinitialize={true}
      >
        <StyledForm>
          <Label>
            <LabelText>Citation Style</LabelText>

            <Field
              name={'targetBundle'}
              component={ImmediateSelectField}
              options={styles}
            />
          </Label>

          <Label>
            <LabelText>Locale</LabelText>

            <Field
              name={'locale'}
              component={ImmediateSelectField}
              options={locales}
            />
          </Label>
        </StyledForm>
      </Formik>
    )
  }
}

export default InspectorContainer
