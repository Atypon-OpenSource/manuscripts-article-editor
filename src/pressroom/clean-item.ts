import { ObjectTypes } from '@manuscripts/manuscripts-json-schema'
import { JsonModel } from '../pressroom/importers'

// TODO: merge into one function?

// tslint:disable-next-line:no-any
const funcs: Array<(item: any) => JsonModel> = [
  // Remove duplicate id field from all items
  item => {
    const { id, _id } = item
    if (id) {
      if (_id && id !== _id) {
        throw new Error('Invalid id')
      }

      if (!_id) {
        item._id = id
      }

      delete item.id
    }

    return item
  },
  // Remove bundled and locked from all items
  ({ bundled, locked, ...item }) => item,
  // Remove derived fields from Contributors
  item => {
    if (item.objectType === ObjectTypes.Contributor) {
      const {
        firstName,
        fullName,
        lastName,
        middleNames,
        nameString,
        prename,
        ...rest
      } = item
      return rest
    } else {
      return item
    }
  },
  // Remove caption field from Table
  item => {
    if (item.objectType === ObjectTypes.Table) {
      const { caption, ...rest } = item
      return rest
    } else {
      return item
    }
  },
  // Remove _rev and collection from all items
  ({ _rev, collection, ...item }) => item,
  // Rename containingElement to containingObject with Citation items
  item => {
    if (item.objectType === ObjectTypes.Citation) {
      const { containingElement, containingObject, ...rest } = item
      if (
        containingObject &&
        containingElement &&
        containingObject !== containingElement
      ) {
        throw new Error('Mismatching container values for Citation')
      }
      return {
        ...rest,
        containingObject: containingElement,
      }
    } else {
      return item
    }
  },
  // Set a default type for BibliographyItems
  item => {
    if (item.objectType === ObjectTypes.BibliographyItem && !item.type) {
      item.type = 'article-journal'
    }
    return item
  },
  // Clean up author/embeddedAuthors in BibliographyItems
  item => {
    if (item.objectType === ObjectTypes.BibliographyItem) {
      const { author, embeddedAuthors } = item
      if (embeddedAuthors) {
        if (!author) {
          item.author = embeddedAuthors.slice()
        }
        delete item.embeddedAuthors
      }
    }
    return item
  },
]

// tslint:disable-next-line:no-any
export const cleanItem = (item: any): JsonModel => {
  for (const f of funcs) {
    item = f(item)
  }

  return item
}
