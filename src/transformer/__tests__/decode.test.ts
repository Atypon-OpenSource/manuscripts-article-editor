import { Node as ProsemirrorNode } from 'prosemirror-model'
import { Nodes } from '../../editor/config/schema/nodes'
import { ComponentMap, Section } from '../../types/components'
import { Decoder, getComponentData, sortSectionsByPriority } from '../decode'
import { MANUSCRIPT, SECTION } from '../object-types'
import { createTestComponentMap, createTestDoc } from './__helpers__/doc'

const countDescendantsOfType = (node: ProsemirrorNode, type: Nodes) => {
  let count = 0

  node.descendants(node => {
    if (node.type.name === type) {
      count++
    }
  })

  return count
}

const createDoc = (componentMap: ComponentMap) => {
  const decoder = new Decoder(componentMap)

  return decoder.createArticleNode()
}

describe('decoder', () => {
  test('create test doc', async () => {
    const doc = createTestDoc()

    expect(doc).toMatchSnapshot()
  })

  test('create test doc with missing data', async () => {
    const componentMap = createTestComponentMap()

    const beforeDoc = createDoc(componentMap)
    expect(countDescendantsOfType(beforeDoc, 'placeholder')).toBe(0)
    expect(countDescendantsOfType(beforeDoc, 'placeholder_element')).toBe(0)
    expect(beforeDoc).toMatchSnapshot('decoded-without-placeholders')

    componentMap.delete('MPTable:2A2413E2-71F5-4B6C-F513-7B44748E49A8')
    componentMap.delete('MPFigureElement:A5D68C57-B5BB-4D10-E0C3-ECED717A2AA7')
    componentMap.delete(
      'MPParagraphElement:05A0ED43-8928-4C69-A17C-0A98795001CD'
    )
    componentMap.delete(
      'MPBibliographyItem:8C394C86-F7B0-48CE-D5BC-E7A10FCE7FA5'
    )
    componentMap.delete('MPCitation:C1BA9478-E940-4273-CB5C-0DDCD62CFBF2')

    const afterDoc = createDoc(componentMap)
    expect(countDescendantsOfType(afterDoc, 'placeholder')).toBe(1)
    expect(countDescendantsOfType(afterDoc, 'placeholder_element')).toBe(2)
    expect(afterDoc).toMatchSnapshot('decoded-with-placeholders')
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
