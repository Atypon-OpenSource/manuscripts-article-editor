import axios from 'axios'
import CSL from 'citeproc'
import url from 'url'
import { BibliographyItem } from '../types/components'

export const convertBibliographyItemToData = (
  item: BibliographyItem
): CSL.Data => ({
  type: 'article-journal',
  id: item.id,
  title: item.title,
  author: item.author,
  issued: item.issued,
  // URL: item.URL, // TODO: keep if it's not doi.org?
  volume: item.volume,
  number: item.number,
  'page-first': item['page-first'],
  'number-of-pages': item['number-of-pages'],
  'collection-title': item['collection-title'],
})

class CitationManager {
  private readonly service: string

  constructor() {
    this.service = process.env.CSL_DATA_URL as string
  }

  public createProcessor = async (
    citationStyle: string,
    locale: string,
    getLibraryItem: (id: string) => BibliographyItem
  ) => {
    const citationStyleData = await this.fetchStyle(citationStyle)

    const citationLocales = await this.fetchCitationLocales(
      citationStyleData,
      locale
    )

    return new CSL.Engine(
      {
        retrieveItem: (id: string) =>
          convertBibliographyItemToData(getLibraryItem(id)),
        retrieveLocale: localeName => citationLocales.get(localeName) as string,
        // embedBibliographyEntry: '',
        // wrapCitationEntry: '',
      },
      citationStyleData,
      locale,
      false
    )
  }

  public fetchStyles = () => {
    return this.fetchJSON('/styles')
  }

  public fetchLocales = () => {
    return this.fetchJSON('/locales')
  }

  private async fetchText(path: string) {
    const response = await axios.get(url.resolve(this.service, path), {
      responseType: 'text',
    })

    return response.data
  }

  private async fetchJSON(path: string) {
    const response = await axios.get(url.resolve(this.service, path))

    return response.data
  }

  private fetchLocale(id: string) {
    return this.fetchText('/locales/' + id)
  }

  private fetchStyle(id: string) {
    return this.fetchText('/styles/' + id)
  }

  private async fetchCitationLocales(
    citationStyleData: string,
    locale: string
  ) {
    const locales: Map<string, string> = new Map()

    const localeNames = CSL.getLocaleNames(citationStyleData, locale)

    await Promise.all(
      localeNames.map(async localeName => {
        const data = await this.fetchLocale(localeName)
        locales.set(localeName, data)
      })
    )

    return locales
  }
}

export default CitationManager
