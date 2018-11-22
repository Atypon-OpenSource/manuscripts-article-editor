import { cleanItem } from '../clean-item'

describe('cleanItem', () => {
  it('_rev & collection', () => {
    // tslint:disable-next-line:no-any
    const bibliographyElement: any = {
      _id: 'MPBibliographyElement:80EFCE66-58E9-4BB7-A80A-2058507A5970',
      objectType: 'MPBibliographyElement',
      elementType: 'div',
      collection: 'elements',
      paragraphStyle: 'MPParagraphStyle:9775D435-19CA-42B8-A71F-9AF65FF36CAA',
      contents:
        '<div class="csl-bib-body" id="MPBibliographyElement:80EFCE66-58E9-4BB7-A80A-2058507A5970"></div>',
      placeholderInnerHTML:
        'This bibliography updates automatically as you cite.',
      createdAt: 1446411417,
      sessionID: '3171e7fd-2fdd-4f7f-82af-3be04fa5b904',
      _rev: '1-e2e23253d560b8e8016189569d5fe01e',
    }

    const { collection, _rev, ...rest } = bibliographyElement

    expect(cleanItem(bibliographyElement)).toEqual(rest)
  })

  it('bundled & locked', () => {
    // tslint:disable-next-line:no-any
    const auxiliaryObjectReferenceStyle: any = {
      updatedAt: 1446410358.4180989,
      objectType: 'MPAuxiliaryObjectReferenceStyle',
      _id:
        'MPAuxiliaryObjectReferenceStyle:5112AB27-BB17-44CC-B61D-B49103ABB36C',
      priority: 10,
      prototype: 'MPAuxiliaryObjectReferenceStyle:default',
      title: 'Default',
      locked: true,
      bundled: 0,
      embeddedReferenceStringComponents: [
        {
          bold: true,
          _id:
            'MPStyleableStringComponent:B8CF9955-0956-4114-AAC7-F9C6CC99688F',
          // tslint:disable-next-line:no-invalid-template-strings
          placeholderString: '${kind} ${elementIndex}',
          italic: false,
          objectType: 'MPStyleableStringComponent',
        },
      ],
      createdAt: 1443870579.8159499,
      name: 'default',
    }

    const { bundled, locked, ...rest } = auxiliaryObjectReferenceStyle

    expect(cleanItem(auxiliaryObjectReferenceStyle)).toEqual(rest)
  })

  it('contributor derived fields', () => {
    // tslint:disable-next-line:no-any
    const contributor: any = {
      prename: 'Seondeok',
      updatedAt: 1446650108.566662,
      lastName: 'Jin',
      firstName: 'Seondeok',
      objectType: 'MPContributor',
      bibliographicName: {
        given: 'Seondeok',
        _id: 'MPBibliographicName:79DEAF93-8CB2-4502-AC4B-F44719AAC018',
        objectType: 'MPBibliographicName',
        family: 'Jin',
      },
      _id: 'MPContributor:0D10E892-9E8E-428A-A006-535AADC8C63F',
      priority: 1,
      affiliations: ['MPAffiliation:4924615F-0071-42F0-90A9-E6447C64C5FE'],
      middleNames: '',
      fullName: 'Seondeok Jin',
      role: 'author',
      nameString: '[1] Jin [4] Seondeok ',
      createdAt: 1446648927.935875,
    }

    const {
      firstName,
      fullName,
      lastName,
      middleNames,
      nameString,
      prename,
      ...rest
    } = contributor

    expect(cleanItem(contributor)).toEqual(rest)
  })

  it('id and _id', () => {
    // tslint:disable-next-line:no-any
    const figureElement: any = {
      figureStyle: 'MPFigureStyle:E173019C-00BB-415E-926A-D0C57ED43303',
      id: 'MPFigureElement:347C7D2A-5C1D-4A9B-AED0-97CAEB91F210',
      updatedAt: 1446418208.071364,
      caption:
        'Demographic history of the cinereous vulture. g, generation time (years); , mutation rate per site per generation time; Tsuf, atmospheric surface air temperature; RSL, relative sea level; 10 m.s.l.e., 10 m sea level equivalent',
      objectType: 'MPFigureElement',
      _id: 'MPFigureElement:347C7D2A-5C1D-4A9B-AED0-97CAEB91F210',
      containedObjectIDs: ['MPFigure:855BACE1-2483-4E3A-9D46-3FF3CFD4FB5E'],
      elementType: 'figure',
      createdAt: 1446418195,
      sessionID: '76C48FD4-2B6F-4121-A060-8FFBCAB44786',
    }

    const { id, ...rest } = figureElement

    expect(cleanItem(figureElement)).toEqual(rest)

    expect(() => {
      cleanItem({ ...figureElement, id: 'MPFigureElement:foo' })
    }).toThrow()
  })

  it('Table caption', () => {
    // tslint:disable-next-line:no-any
    const table: any = {
      _id: 'MPTable:0D470DF3-AF6A-4C13-A918-4DAE53B52500',
      objectType: 'MPTable',
      contents:
        '<table class="MPElement MPTableStyle_90E921F3-EB4A-4DBF-9226-6C42A45616D4 MPParagraphStyle_9775D435-19CA-42B8-A71F-9AF65FF36CAA" id="MPTableElement:95254D7A-F05E-4365-9E88-30FE19417792" data-contained-object-id="MPTable:0D470DF3-AF6A-4C13-A918-4DAE53B52500"></table>',
      sessionID: 'e9d2e168-19b3-45c5-9194-c5f853997187',
      createdAt: 1446414871,
      caption: 'Caption',
    }

    const { caption, ...rest } = table

    expect(cleanItem(table)).toEqual(rest)
  })

  it('Citation containingElement', () => {
    // tslint:disable-next-line:no-any
    const citation: any = {
      _id: 'MPCitation:015A478A-4AE3-4266-981C-D07642524ABB',
      containingElement:
        'MPParagraphElement:872C613C-4BD6-48DC-CC11-5CEC1ED4DBA0',
      embeddedCitationItems: [
        {
          _id: 'MPCitationItem:AB67E6B8-1ACE-48CE-9A04-5D93B77BC0CE',
          objectType: 'MPCitationItem',
          bibliographyItem:
            'MPBibliographyItem:B040481C-8DAD-43F3-B6E7-865A64D5E434',
        },
      ],
      objectType: 'MPCitation',
      collationType: 0,
      updatedAt: 1446415186.157666,
      createdAt: 1446415186.157666,
    }

    const { containingElement, ...rest } = citation

    expect(cleanItem(citation)).toEqual({
      ...rest,
      containingObject: containingElement,
    })

    expect(
      cleanItem({ ...citation, containingObject: containingElement })
    ).toEqual({
      ...rest,
      containingObject: containingElement,
    })

    expect(() => {
      cleanItem({ ...citation, containingObject: 'MPParagraphElement:bar' })
    }).toThrow()
  })

  it('bibliography item', () => {
    // tslint:disable-next-line:no-any
    const bibliographyItem: any = {
      _id: 'MPBibliographyItem:3F84F837-7E5D-4DC5-957D-6222ECC0500F',
      objectType: 'MPBibliographyItem',
      title: '61',
      updatedAt: 1446418952.04394,
      createdAt: 1446418952.04394,
      'citation-label': '61',
      URL: 'http://www.genomebiology.com/2015/16/1/215#B61',
    }

    expect(cleanItem(bibliographyItem)).toEqual({
      ...bibliographyItem,
      type: 'article-journal',
    })

    const author1 = {
      given: 'S F',
      _id: 'MPBibliographicName:B592B6C3-21FA-46CF-AFB0-363B4EC97872',
      objectType: 'MPBibliographicName',
      family: 'Altschul',
    }

    expect(
      cleanItem({ ...bibliographyItem, embeddedAuthors: [author1] })
    ).toEqual({
      ...bibliographyItem,
      author: [author1],
      type: 'article-journal',
    })

    expect(
      cleanItem({ ...bibliographyItem, author: [], embeddedAuthors: [author1] })
    ).toEqual({
      ...bibliographyItem,
      author: [],
      type: 'article-journal',
    })

    const author2 = {
      ...author1,
      given: 'Foo',
      _id: 'MPBibliographicName:B5222222-21FA-46CF-AFB0-363B4EC97872',
    }

    const author3 = {
      ...author1,
      given: 'Bar',
      _id: 'MPBibliographicName:B5333333-21FA-46CF-AFB0-363B4EC97872',
    }

    expect(
      cleanItem({
        ...bibliographyItem,
        author: [author1, author2],
        embeddedAuthors: [author3],
      })
    ).toEqual({
      ...bibliographyItem,
      author: [author1, author2],
      type: 'article-journal',
    })
  })
})
