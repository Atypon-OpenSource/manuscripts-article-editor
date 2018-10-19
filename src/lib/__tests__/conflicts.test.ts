import { ReplaceStep } from 'prosemirror-transform'
import { Decoder } from '../../transformer'
import { Paragraph } from '../../types/models'
import * as Conflicts from '../conflicts'
import * as Merge from '../merge'

jest.mock('rxdb')
jest.mock('../../transformer/serializer')
jest.mock('rxdb/plugins/core')

describe('events', () => {
  it('calls rxdb change emit function', () => {
    // tslint:disable-next-line:no-any
    const collection: any = {
      $emit: jest.fn(),
    }

    // tslint:disable-next-line:no-any
    const doc: any = { _rev: '2-foo' }

    Conflicts.updateDoc(collection, doc)
    expect(collection.$emit).toBeCalled()
  })
})

describe('tree mutations', () => {
  const treeJson = JSON.stringify([
    {
      pos: 1,
      ids: [
        'initial',
        {
          status: 'available',
        },
        [
          [
            'localconflict',
            {
              status: 'available',
            },
            [
              [
                'morelocalconflict',
                {
                  status: 'available',
                },
                [],
              ],
            ],
          ],
          [
            'remote',
            {
              status: 'available',
            },
            [],
          ],
        ],
      ],
    },
  ])

  it('should prune a branch from the tree', () => {
    const tree = JSON.parse(treeJson)
    // 2-localconflict should be at this path
    expect(tree[0].ids[2][0][0]).toEqual('localconflict')
    expect(tree[0].ids[2].length).toEqual(2)
    const pruneFn = Conflicts.prune('localconflict')
    pruneFn(tree)
    // 2-remote should _now_ be at this path
    expect(tree[0].ids[2][0][0]).toEqual('remote')
    expect(tree[0].ids[2].length).toEqual(1)
  })

  it('should throw if the revision cannot be found/removed', () => {
    const tree = JSON.parse(treeJson)
    const pruneFn = Conflicts.prune('nonexistent-rev')
    expect(() => pruneFn(tree)).toThrow()
  })
})

describe('remove conflicts', () => {
  it('should throw if a winning revision cannot be found', () => {
    // tslint:disable-next-line:no-any
    const collection: any = {
      pouch: {
        _purgeRevs: jest.fn(),
      },
    }

    // tslint:disable-next-line:no-any
    const conflict: any = {
      ancestor: {},
      local: {
        _revisions: {
          ids: [],
        },
      },
      remote: {},
    }

    expect(() => Conflicts.removeConflict(collection, conflict)).toThrow()
  })

  it('should call pouch._purgeRevs with correct arguments', async () => {
    // tslint:disable-next-line:no-any
    const collection: any = {
      pouch: {
        _purgeRevs: jest.fn((_, __, ___, cb) => cb()),
      },
      $emit: jest.fn(),
    }

    // tslint:disable-next-line:no-any
    const conflict: any = {
      ancestor: {
        _rev: '2-ancestorRev',
      },
      local: {
        _rev: '4-localRevB',
        _revisions: {
          ids: ['localRevB', 'localRevA', 'ancestorRev', 'initialRev'],
        },
      },
      remote: {
        _rev: '6-remote',
      },
    }

    await Conflicts.removeConflict(collection, conflict)

    const winningRev = conflict.remote._rev

    expect(collection.pouch._purgeRevs).toHaveBeenCalledWith(
      conflict.local._id,
      expect.any(Function),
      winningRev,
      expect.any(Function)
    )
  })
})

describe('parse rev number', () => {
  it('parse rev number correctly', () => {
    expect(Conflicts.getRevNumber('24-barbaz')).toEqual(24)
  })

  it('should fail to parse broken rev number', () => {
    expect(() => Conflicts.getRevNumber('-barbaz')).toThrow()
  })

  it('should fail to parse empty string', () => {
    expect(() => Conflicts.getRevNumber('')).toThrow()
  })
})

describe('apply remote step', () => {
  const manuscriptID = 'MPManuscript:21333'
  const componentID = 'MPParagraphElement:6AB75E6E-65FC-42AB-8FA5-98BAF03977B0'

  const encodedContents = (contents: string) => {
    return `<p xmlns="http://www.w3.org/1999/xhtml" id="${componentID}" class="MPElement" data-object-type="MPParagraphElement">${contents}</p>`
  }

  const conflict: Conflicts.Conflict<Paragraph> = {
    id: '3-cae48a6191f8e130f9aceaf01c7ab788:3-c7aaa9280b8b60eb7c708f9c5e9fb04b',
    ancestor: {
      objectType: 'MPParagraphElement',
      elementType: 'p',
      contents: encodedContents('money in a big box'),
      containerID: 'MPProject:5BCCEC56-7E77-4BEC-82FA-E884078B5000',
      manuscriptID,
      _id: componentID,
      _rev: '1-68e5c5ecb0364bf48a0345808b162aa8',
      _revisions: {
        ids: [],
        start: 0,
      },
    },
    local: {
      objectType: 'MPParagraphElement',
      elementType: 'p',
      contents: encodedContents('money outsiiiide a smaaall box'),
      containerID: 'MPProject:5BCCEC56-7E77-4BEC-82FA-E884078B5000',
      manuscriptID,
      _id: componentID,
      _rev: '3-cae48a6191f8e130f9aceaf01c7ab788',
      _revisions: {
        ids: [],
        start: 0,
      },
    },
    remote: {
      objectType: 'MPParagraphElement',
      elementType: 'p',
      contents: encodedContents('money inside a smaaall box'),
      containerID: 'MPProject:5BCCEC56-7E77-4BEC-82FA-E884078B5000',
      manuscriptID,
      _id: componentID,
      _rev: '4-cae48a6191f8e130f9aceaf01c7ab788',
      _revisions: {
        ids: [],
        start: 0,
      },
    },
  }

  const current: Paragraph = {
    objectType: 'MPParagraphElement',
    elementType: 'p',
    contents: encodedContents('money inside a shoe box'),
    containerID: 'MPProject:5BCCEC56-7E77-4BEC-82FA-E884078B5000',
    manuscriptID,
    _id: componentID,
    _rev: '4-fffffff191f8e130f9aceaf01c7ab788',
  }

  const decoder = new Decoder(new Map())

  const localConflicts = {
    [componentID]: {
      [conflict.id]: conflict,
    },
  }

  // tslint:disable-next-line:no-any
  const collection: any = {
    upsertLocal: jest.fn((manuscriptID, updatedLocalConflicts) => ({
      toJSON: () => updatedLocalConflicts,
    })),
    getLocal: () => ({
      toJSON: () => localConflicts,
    }),
  }

  it('updates the conflict if there are remaining conflicts', async () => {
    const { localNode, ancestorNode } = Merge.hydrateConflictNodes(
      conflict,
      decoder.decode
    )

    const apply = Conflicts.applyRemoteStep(collection)

    const currentNode = decoder.decode(current)

    const step = new ReplaceStep(6, 16, currentNode.slice(6, 12))

    const isFinalConflict = false

    const updatedConflicts = await apply(
      conflict,
      {
        ancestor: ancestorNode,
        current: currentNode,
        local: localNode,
      },
      step,
      isFinalConflict
    )

    // tslint:disable-next-line:no-any
    const updatedLocal: any = updatedConflicts[componentID][conflict.id].local

    expect(updatedLocal.contents).toEqual(
      encodedContents('money inside a smaaall box')
    )

    expect(collection.upsertLocal).toHaveBeenCalledWith(
      manuscriptID,
      localConflicts
    )
  })

  it('removes the conflict if there are no remaining conflicts', async () => {
    const { localNode, ancestorNode } = Merge.hydrateConflictNodes(
      conflict,
      decoder.decode
    )

    const applyFn = Conflicts.applyRemoteStep(collection)

    const currentNode = decoder.decode(current)

    const step = new ReplaceStep(6, 16, currentNode.slice(6, 12))

    const isFinalConflict = true

    const updatedConflicts = await applyFn(
      conflict,
      {
        ancestor: ancestorNode,
        current: currentNode,
        local: localNode,
      },
      step,
      isFinalConflict
    )

    expect(updatedConflicts[componentID]).toBeUndefined()

    expect(collection.upsertLocal).toHaveBeenCalledWith(manuscriptID, {})
  })
})

describe('apply local step', () => {
  const manuscriptID = 'MPManuscript:21333'
  const componentID = 'MPParagraphElement:6AB75E6E-65FC-42AB-8FA5-98BAF03977B0'

  const encodedContents = (contents: string) => {
    return `<p xmlns="http://www.w3.org/1999/xhtml" id="${componentID}" class="MPElement" data-object-type="MPParagraphElement">${contents}</p>`
  }

  // tslint:disable-next-line:no-any
  const conflict: Conflicts.Conflict<Paragraph> = {
    id: '3-cae48a6191f8e130f9aceaf01c7ab788:3-c7aaa9280b8b60eb7c708f9c5e9fb04b',
    ancestor: {
      objectType: 'MPParagraphElement',
      elementType: 'p',
      contents: encodedContents('money in a big box'),
      containerID: 'MPProject:5BCCEC56-7E77-4BEC-82FA-E884078B5000',
      manuscriptID,
      _id: componentID,
      _rev: '1-68e5c5ecb0364bf48a0345808b162aa8',
      _revisions: {
        ids: [],
        start: 0,
      },
    },
    local: {
      objectType: 'MPParagraphElement',
      elementType: 'p',
      contents: encodedContents('money outsiiiide a smaaall box'),
      containerID: 'MPProject:5BCCEC56-7E77-4BEC-82FA-E884078B5000',
      manuscriptID,
      _id: componentID,
      _rev: '3-cae48a6191f8e130f9aceaf01c7ab788',
      _revisions: {
        ids: [],
        start: 0,
      },
    },
    remote: {
      objectType: 'MPParagraphElement',
      elementType: 'p',
      contents: encodedContents('money inside a smaaall box'),
      containerID: 'MPProject:5BCCEC56-7E77-4BEC-82FA-E884078B5000',
      manuscriptID,
      _id: componentID,
      _rev: '4-cae48a6191f8e130f9aceaf01c7ab788',
      _revisions: {
        ids: [],
        start: 0,
      },
    },
  }

  const localConflicts = {
    [componentID]: {
      [conflict.id]: conflict,
    },
  }

  // tslint:disable-next-line:no-any
  const collection: any = {
    upsertLocal: jest.fn((manuscriptID, updatedLocalConflicts) => ({
      toJSON: () => updatedLocalConflicts,
    })),
    getLocal: () => ({
      toJSON: () => localConflicts,
    }),
  }

  it('does nothing if there are remaining conflicts', async () => {
    const apply = Conflicts.applyLocalStep(collection)

    const isFinalConflict = false

    const updatedConflicts = await apply(conflict, isFinalConflict)

    expect(updatedConflicts).toEqual(localConflicts)

    expect(collection.upsertLocal).toHaveBeenCalledWith(
      manuscriptID,
      localConflicts
    )
  })

  it('removes the conflicts if there are no remaining conflicts', async () => {
    const apply = Conflicts.applyLocalStep(collection)

    const isFinalConflict = true

    const updatedConflicts = await apply(conflict, isFinalConflict)

    expect(updatedConflicts[componentID]).toBeUndefined()

    expect(collection.upsertLocal).toHaveBeenCalledWith(manuscriptID, {})
  })
})
