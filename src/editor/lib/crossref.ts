import { stringify } from 'qs'
import { convertDataToBibliographyItem } from '../../lib/csl'
import { BibliographyItem } from '../../types/components'

export const search = (query: string, rows: number) =>
  window
    .fetch(
      'https://api.crossref.org/works?' +
        stringify({
          filter: 'type:journal-article',
          query,
          rows,
        })
    )
    .then(response => response.json())
    .then(data => data.message.items)

export const fetch = (item: BibliographyItem) =>
  window
    .fetch(
      'https://data.crossref.org/' + encodeURIComponent(item.DOI as string),
      {
        headers: {
          accept: 'application/vnd.citationstyles.csl+json',
        },
      }
    )
    .then(response => response.json())
    .then(convertDataToBibliographyItem)
