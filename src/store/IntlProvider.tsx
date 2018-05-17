import React from 'react'
import * as Intl from 'react-intl'
import { StringMap } from '../editor/config/types'
import Spinner from '../icons/spinner'
import preferences from '../lib/preferences'
// import client from './lib/client'

interface Messages {
  error?: string
  manuscripts?: string
  manage_account?: string
  preferences?: string
  sign_in?: string
  sign_out?: string
  empty_manuscripts?: string
  import_manuscript?: string
}

const translations: StringMap<Messages> = {
  ar: {
    error: 'خطأ',
    manuscripts: 'المخطوطات',
    manage_account: 'إدارة الحساب',
    preferences: 'تفضيلات',
    sign_in: 'تسجيل الدخول',
    sign_out: 'خروج',
    empty_manuscripts: 'لا مخطوطات بعد',
    import_manuscript:
      'استخدم الزر + لإنشاء مخطوطة جديدة أو قم باستيراد واحدة من جهاز الكمبيوتر الخاص بك.',
  },
  en: {
    error: 'Error',
    manuscripts: 'Manuscripts',
    manage_account: 'Manage account',
    preferences: 'Preferences',
    sign_in: 'Sign in',
    sign_out: 'Sign out',
    empty_manuscripts: 'No manuscripts yet',
    import_manuscript:
      'Use the + button to create a new Manuscript or import one from your computer.',
  },
  zh: {
    error: '错误',
    manuscripts: '手稿',
    empty_manuscripts: '没有手稿',
    import_manuscript: '使用+按钮来创建一个新的手稿或从您的计算机导入一个。',
  },
}

interface State {
  locale: string
  loading: boolean
  error: boolean
  messages: Messages | null
}

export interface IntlProviderContext extends State {
  locale: string
  setLocale: (locale: string) => void
}

export interface IntlProps {
  intl: IntlProviderContext
}

export const IntlContext = React.createContext<IntlProviderContext | null>(null)

export const withIntl = (
  // tslint:disable-next-line:no-any
  Component: React.ComponentType<any>
  // tslint:disable-next-line:no-any
): React.ComponentType<any> => (props: object) => (
  <IntlContext.Consumer>
    {value => <Component {...props} intl={value as IntlProviderContext} />}
  </IntlContext.Consumer>
)

class IntlProvider extends React.Component<{}, State> {
  public state: State = {
    locale: 'en',
    loading: true,
    error: false,
    messages: null,
  }

  public componentDidMount() {
    this.updateLocale()
  }

  public render() {
    const { locale, error, loading, messages } = this.state

    if (error) {
      return <div>🙊</div>
    }

    if (loading) {
      return <Spinner />
    }

    const value = {
      ...this.state,
      setLocale: this.setLocale,
    }

    return (
      <Intl.IntlProvider locale={locale} key={locale} messages={messages}>
        <IntlContext.Provider value={value}>
          {this.props.children}
        </IntlContext.Provider>
      </Intl.IntlProvider>
    )
  }

  // TODO: switch by cookie/header?
  // navigator.language || navigator.browserLanguage
  // Accept-Language header for the server
  // https://www.smashingmagazine.com/2017/01/internationalizing-react-apps/
  /*private readLocale = () => {
    const params = new URLSearchParams(window.location.search.substr(1))

    const locale = params.get('locale')

    if (locale && translations[locale]) {
      preferences.set({
        ...preferences.get(),
        locale,
      })
    }
  }*/

  private setLocale = (locale: string) => {
    preferences.set({
      ...preferences.get(),
      locale,
    })

    this.updateLocale()
  }

  private updateLocale = () => {
    // this.readLocale()

    const { locale } = preferences.get()

    // client.get(`/translations/${locale}.json`)
    //   .then(response => this.setState({
    //     loading: false,
    //     messages: response.data
    //   }))
    //   .catch(() => this.setState({ error: true }))

    this.setState({
      locale,
      loading: true,
      messages: null,
      error: false,
    })

    import(`react-intl/locale-data/${locale}`)
      .then(localeData => {
        Intl.addLocaleData(localeData.default)

        this.setState({
          loading: false,
          messages: translations[locale],
        })
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: true,
        })
      })
  }
}

export default IntlProvider
