const storage = window.localStorage

export interface Pane {
  size: number
  collapsed: boolean
}

export interface Layout {
  [key: string]: Pane
}

const defaultPane: Pane = {
  size: 200,
  collapsed: false,
}

const load = (): Layout => {
  const json = storage.getItem('layout')

  return json ? JSON.parse(json) : {}
}

const save = (data: Layout): Layout => {
  storage.setItem('layout', JSON.stringify(data))

  return data
}

export default {
  get: (name: string): Pane => {
    const data = load()

    return data[name] || defaultPane
  },
  set: (name: string, pane: Pane): Pane => {
    const data = load()
    data[name] = pane
    save(data)

    return pane
  },
  remove: () => storage.removeItem('layout'),
}
