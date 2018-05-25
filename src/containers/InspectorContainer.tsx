import { Field, Form, Formik } from 'formik'
import React from 'react'
import { Option } from 'react-select'
import { ImmediateSelectField } from '../components/ImmediateSelectField'
import { Spinner } from '../components/Spinner'
import { StringMap } from '../editor/config/types'
import CitationManager from '../lib/csl'
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
}

interface Style {
  id: string
  title: string
  shortTitle: string
}

interface Locales {
  'language-names': StringMap<string[]>
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

    const styles = (await citationManager.fetchStyles()) as StringMap<Style>
    const locales = (await citationManager.fetchLocales()) as Locales

    this.setState({
      styles: Object.entries(styles).map(([value, style]) => ({
        value,
        label: style.title,
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

    // TODO: match the defaults in the citation processor
    const initialValues: Manuscript = {
      citationStyle: 'nature',
      locale: 'en-GB',
      ...manuscript,
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
              name={'citationStyle'}
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
