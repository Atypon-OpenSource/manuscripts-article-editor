import * as Conflicts from '../conflicts'

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
