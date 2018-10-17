import { BIBLIOGRAPHIC_NAME } from '../../transformer/object-types'
import { BibliographyItem } from '../../types/models'
import {
  convertBibliographyItemToData,
  convertDataToBibliographyItem,
} from '../csl'

describe('CSL <=> bibliography model transforms', () => {
  it('should convert data from CSL to bibliography items', () => {
    const illustrator: CSL.Person = { family: 'Derp' }
    const date: CSL.LiteralDate = { literal: 'yesterday' }
    const data: CSL.Data = {
      id: 'foo',
      type: 'article',
      DOI: 'foo',
      illustrator: [illustrator],
      accessed: date,
    }
    const bibItem = convertDataToBibliographyItem(data)
    expect(bibItem.DOI).toMatch(data.DOI!)
    expect(bibItem.type).toMatch('article')
    // tslint:disable-next-line:no-any
    expect((bibItem.illustrator as any)[0].objectType).toMatch(
      BIBLIOGRAPHIC_NAME
    )
  })

  it('should convert bibliography items to CSL', () => {
    const item: BibliographyItem = {
      _id: 'MPBibliographyItem:x',
      objectType: 'MPBibliographyItem',
      DOI: 'foo',
      accessed: {
        _id: 'MPBibliographicDate:63937364-97E6-4722-AA96-0841EFBBAA0D',
        literal: 'yesterday',
        objectType: 'MPBibliographicDate',
      },
      illustrator: [
        {
          _id: 'MPBibliographicName:003024D5-CC4B-4C9B-95EA-C1D24255827E',
          family: 'Derp',
          objectType: 'MPBibliographicName',
        },
      ],
      type: 'article',
      containerID: 'ProjectX',
    }
    const data = convertBibliographyItemToData(item)

    expect(data).toEqual({
      DOI: 'foo',
      accessed: { literal: 'yesterday' },
      id: 'MPBibliographyItem:x',
      illustrator: [{ family: 'Derp' }],
      type: 'article',
    })

    const itemMissingType = { ...item }
    delete itemMissingType.type
    const dataWithDefaultType = convertBibliographyItemToData(itemMissingType)

    expect(dataWithDefaultType).toEqual({
      DOI: 'foo',
      accessed: { literal: 'yesterday' },
      id: 'MPBibliographyItem:x',
      illustrator: [{ family: 'Derp' }],
      type: 'article-journal',
    })
  })
})
