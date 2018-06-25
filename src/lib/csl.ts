import axios from 'axios'
import CSL from 'citeproc'
import url from 'url'
import { generateID } from '../transformer/id'
import {
  BIBLIOGRAPHIC_DATE,
  BIBLIOGRAPHIC_NAME,
} from '../transformer/object-types'
import {
  BibliographicDate,
  BibliographicName,
  BibliographyItem,
} from '../types/components'

const contributorFields = [
  'author',
  'collection-editor',
  'composer',
  'container-author',
  'director',
  'editor',
  'editorial-director',
  'interviewer',
  'illustrator',
  'original-author',
  'recipient',
  'reviewed-author',
  'translator',
]

const dateFields = [
  'accessed',
  'container',
  'event-date',
  'issued',
  'original-date',
  'submitted',
]

const standardFields = [
  'abstract',
  'annote',
  'archive',
  'archive-place',
  'archive_location',
  'authority',
  'call-number',
  'categories',
  'chapter-number',
  'citation-label',
  'citation-number',
  'collection-number',
  'collection-title',
  'container-title',
  'container-title-short',
  'dimensions',
  'DOI',
  'edition',
  'event',
  'event-place',
  'first-reference-note-number',
  'genre',
  'ISBN',
  'ISSN',
  'issue',
  'journalAbbreviation',
  'jurisdiction',
  'keyword',
  'language',
  'locator',
  'medium',
  'note',
  'number',
  'number-of-pages',
  'number-of-volumes',
  'original-publisher',
  'original-publisher-place',
  'original-title',
  'page',
  'page-first',
  'PMCID',
  'PMID',
  'publisher',
  'publisher-place',
  'references',
  'reviewed-title',
  'scale',
  'section',
  'shortTitle',
  'source',
  'status',
  'title',
  'title-short',
  'type',
  'URL',
  'version',
  'volume',
  'year-suffix',
]

export const convertDataToBibliographyItem = (
  data: CSL.Data
): Partial<BibliographyItem> =>
  Object.entries(data).reduce(
    (output, [key, item]) => {
      if (standardFields.includes(key)) {
        output[key] = item as string
      } else if (contributorFields.includes(key)) {
        output[key] = (item as CSL.Person[]).map((value: object) => ({
          ...value,
          id: generateID('bibliographic_name'),
          objectType: BIBLIOGRAPHIC_NAME,
        })) as BibliographicName[]
      } else if (dateFields.includes(key)) {
        output[key] = {
          ...(item as CSL.StructuredDate),
          id: generateID('bibliographic_date'),
          objectType: BIBLIOGRAPHIC_DATE,
        } as BibliographicDate // tslint:disable-line
      }

      return output
    },
    {} as Partial<BibliographyItem> // tslint:disable-line
  )

export const convertBibliographyItemToData = (
  item: BibliographyItem
): CSL.Data =>
  Object.entries(item).reduce(
    (output, [key, item]) => {
      if (standardFields.includes(key as CSL.StandardFieldKey)) {
        output[key] = item as string
      } else if (contributorFields.includes(key as CSL.PersonFieldKey)) {
        output[key] = (item as BibliographicName[]).map(name => {
          const { id, objectType, ...rest } = name
          return rest
        }) as CSL.Person[]
      } else if (dateFields.includes(key as CSL.DateFieldKey)) {
        const { id, objectType, ...rest } = item as BibliographicDate
        output[key] = rest as CSL.StructuredDate
      }

      return output
    },
    {
      id: item.id,
      type: item.type || 'article-journal',
    } as CSL.Data // tslint:disable-line
  )

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
