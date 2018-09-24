import components from '../../../stories/data/components.json'
import { AnyComponent, Section } from '../../types/components'
import { Decoder, getComponentData, sortSectionsByPriority } from '../decode'
import { MANUSCRIPT, SECTION } from '../object-types'

const createTestComponentMap = (): Map<string, AnyComponent> => {
  const componentMap = new Map()

  for (const component of components) {
    componentMap.set(component.id, component)
  }

  return componentMap
}

export const createTestDoc = () => {
  const componentMap = createTestComponentMap()

  const decoder = new Decoder(componentMap)

  return decoder.createArticleNode()
}

describe('transformer', () => {
  test('Decoder', async () => {
    const doc = createTestDoc()

    expect(doc).toMatchSnapshot()
  })

  test('getComponentData', () => {
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

  test('sortSectionsByPriority', () => {
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
