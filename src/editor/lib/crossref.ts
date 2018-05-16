import { stringify } from 'qs'

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

export const fetch = (url: string) =>
  window
    .fetch(url, {
      headers: {
        accept: 'application/vnd.citationstyles.csl+json',
      },
    })
    .then(response => response.json())
