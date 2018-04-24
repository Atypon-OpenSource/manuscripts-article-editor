const headers = {
  accept: 'application/vnd.citationstyles.csl+json',
}

export const sample = (query: string) =>
  fetch(
    'https://api.crossref.org/works?rows=1&filter=type:journal-article&query=' +
      encodeURIComponent(query)
  )
    .then(response => response.json())
    .then(data => data.message.items[0])
    .then(item => fetch(item.URL, { headers }))
    .then(response => response.json())
