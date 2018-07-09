import { Section } from '../../types/components'
import { getComponentData, sortSectionsByPriority } from '../decode'
import { MANUSCRIPT, SECTION } from '../object-types'

describe('transformer', () => {
  it('getComponentData', () => {
    const data = getComponentData({
      _rev: 'x',
      _deleted: true,
      updatedAt: Date.now(),
      createdAt: Date.now(),
      sessionID: 'xyz',
      id: 'MPManuscript:X',
      objectType: MANUSCRIPT,
    })
    expect(data).toEqual({
      id: 'MPManuscript:X',
      objectType: MANUSCRIPT,
    })
  })

  it('sortSectionsByPriority', () => {
    const sectionA: Section = {
      id: 'MPSection:A',
      objectType: SECTION,
      priority: 0,
      title: 'A',
      path: ['MPSection:A'],
      elementIDs: [],
      containerID: 'MPProject:X',
    }
    const sectionB: Section = {
      id: 'MPSection:B',
      objectType: SECTION,
      priority: 1,
      title: 'B',
      path: ['MPSection:A'],
      elementIDs: [],
      containerID: 'MPProject:X',
    }
    expect(sortSectionsByPriority(sectionA, sectionA)).toEqual(0)
    expect(sortSectionsByPriority(sectionA, sectionB)).toEqual(-1)
    expect(sortSectionsByPriority(sectionB, sectionA)).toEqual(1)
  })
})
