"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIntl = exports.IntlProvider = void 0;
const react_1 = __importStar(require("react"));
const Intl = __importStar(require("react-intl"));
const preferences_1 = __importDefault(require("../lib/preferences"));
const Loading_1 = require("./Loading");
const translations = {
    ar: {
        error: 'خطأ',
        manuscripts: 'المخطوطات',
        manage_account: 'إدارة الحساب',
        preferences: 'تفضيلات',
        sign_in: 'تسجيل الدخول',
        sign_out: 'خروج',
        empty_manuscripts: 'لا مخطوطات بعد',
        import_manuscript: 'استخدم الزر + لإنشاء مخطوطة جديدة أو قم باستيراد واحدة من جهاز الكمبيوتر الخاص بك.',
    },
    en: {
        error: 'Error',
        manuscripts: 'Manuscripts',
        manage_account: 'Manage account',
        preferences: 'Preferences',
        sign_in: 'Sign in',
        sign_out: 'Sign out',
        empty_manuscripts: 'No manuscripts yet',
        import_manuscript: 'Use the + button to create a new Manuscript or import one from your computer.',
    },
    // zh: {
    //   error: '错误',
    //   manuscripts: '手稿',
    //   empty_manuscripts: '没有手稿',
    //   import_manuscript: '使用+按钮来创建一个新的手稿或从您的计算机导入一个。',
    // },
};
const IntlContext = react_1.default.createContext({});
const IntlProvider = ({ children }) => {
    const [state, setState] = react_1.useState({
        locale: 'en',
        loading: true,
        error: false,
        messages: null,
    });
    const updateLocale = () => {
        // this.readLocale()
        const { locale } = preferences_1.default.get();
        // client.get(`/translations/${locale}.json`)
        //   .then(response => this.setState({
        //     loading: false,
        //     messages: response.data
        //   }))
        //   .catch(() => this.setState({ error: true }))
        setState({
            locale,
            loading: false,
            messages: translations[locale],
            error: false,
        });
    };
    react_1.useEffect(() => {
        updateLocale();
    }, []);
    const { locale, error, loading, messages } = state;
    if (error) {
        // eslint-disable-next-line jsx-a11y/accessible-emoji
        return react_1.default.createElement("div", null, "\uD83D\uDE4A");
    }
    if (loading) {
        return react_1.default.createElement(Loading_1.LoadingPage, null);
    }
    if (!messages) {
        return null;
    }
    const setLocale = (locale) => {
        preferences_1.default.set(Object.assign(Object.assign({}, preferences_1.default.get()), { locale }));
        updateLocale();
    };
    const value = Object.assign(Object.assign({}, state), { setLocale: setLocale });
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
    return (react_1.default.createElement(Intl.IntlProvider, { locale: locale, key: locale, messages: messages },
        react_1.default.createElement(IntlContext.Provider, { value: value }, children)));
};
exports.IntlProvider = IntlProvider;
const useIntl = () => react_1.useContext(IntlContext);
exports.useIntl = useIntl;
//# sourceMappingURL=IntlHookableProvider.js.map