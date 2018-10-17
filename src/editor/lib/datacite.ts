import { stringify } from 'qs'
import { convertDataToBibliographyItem } from '../../lib/csl'
import { BibliographyItem } from '../../types/models'

interface DataCiteItem {
  attributes: {
    doi: string
  }
}

export const search = (query: string, rows: number) =>
  window
    .fetch(
      'https://api.datacite.org/works?' +
        stringify({
          query,
          'page[size]': rows,
        })
    )
    .then(response => response.json())
    .then(data =>
      data.data.map((item: DataCiteItem) => ({
        ...item.attributes,
        DOI: item.attributes.doi,
      }))
    )

export const fetch = (item: BibliographyItem) =>
  window
    .fetch(
      'https://data.datacite.org/' + encodeURIComponent(item.DOI as string),
      {
        headers: {
          accept: 'application/vnd.citationstyles.csl+json',
        },
      }
    )
    .then(response => response.json())
    .then(convertDataToBibliographyItem)
