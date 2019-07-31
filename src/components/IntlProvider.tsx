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

import React from 'react'
import * as Intl from 'react-intl'
import preferences from '../lib/preferences'
import { Loading } from './Loading'

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

const translations: { [key: string]: Messages } = {
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

export const IntlContext = React.createContext<IntlProviderContext>(
  // tslint:disable-next-line:no-object-literal-type-assertion
  {} as IntlProviderContext
)

export const withIntl = <Props extends IntlProps>(
  Component: React.ComponentType<Props>
): React.ComponentType<Omit<Props, keyof IntlProps>> => (props: Props) => (
  <IntlContext.Consumer>
    {value => <Component {...props} intl={value} />}
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
      return <Loading />
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
      .catch(() => {
        this.setState({
          loading: false,
          error: true,
        })
      })
  }
}

export default IntlProvider
