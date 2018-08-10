import {
  AFFILIATION,
  AUXILIARY_OBJECT_REFERENCE,
  BIBLIOGRAPHIC_DATE,
  BIBLIOGRAPHIC_NAME,
  BIBLIOGRAPHY_ITEM,
  CITATION_ITEM,
  CONTRIBUTOR,
  FIGURE,
  KEYWORD,
  MANUSCRIPT,
  PROJECT,
} from '../../transformer/object-types'
import { BibliographicName, BibliographyItem } from '../../types/components'
import {
  buildAffiliation,
  buildAuxiliaryObjectReference,
  buildBibliographicDate,
  buildBibliographicName,
  buildBibliographyItem,
  buildCitation,
  buildContributor,
  buildFigure,
  buildKeyword,
  buildManuscript,
  buildProject,
} from '../commands'

describe('commands', () => {
  it('buildProject', () => {
    const proj = buildProject('Mr Derp')
    expect(proj.id).toMatch(/MPProject:\S+/)
    expect(proj.objectType).toEqual(PROJECT)
    expect(proj.owners).toEqual(['Mr Derp'])
    expect(proj.writers).toEqual([])
    expect(proj.viewers).toEqual([])
    expect(proj.title).toEqual('')
  })

  it('buildManuscript', () => {
    const manuscriptA = buildManuscript('Teh title')
    expect(manuscriptA.id).toMatch(/MPManuscript:\S+/)
    expect(manuscriptA.objectType).toEqual(MANUSCRIPT)
    expect(manuscriptA.title).toEqual('Teh title')
    expect(manuscriptA.figureElementNumberingScheme).toEqual('')
    expect(manuscriptA.figureNumberingScheme).toEqual('')

    const manuscriptB = buildManuscript()
    expect(manuscriptB.id).toMatch(/MPManuscript:\S+/)
    expect(manuscriptB.objectType).toEqual(MANUSCRIPT)
    expect(manuscriptB.title).toEqual('')
  })

  it('buildContributor', () => {
    const name: BibliographicName = {
      _id: 'contributor-a',
      objectType: BIBLIOGRAPHIC_NAME,
      nonDroppingParticle: 'van der',
      family: 'Derp',
    }
    const contributor = buildContributor(name, 'author', 3)
    expect(contributor.objectType).toEqual(CONTRIBUTOR)
    expect(contributor.priority).toEqual(3)
    expect(contributor.role).toEqual('author')
    expect(contributor.affiliations).toEqual([])
    expect(contributor.bibliographicName.nonDroppingParticle).toEqual(
      name.nonDroppingParticle
    )
    expect(contributor.bibliographicName.family).toEqual(name.family)
    expect(contributor.bibliographicName.objectType).toEqual(BIBLIOGRAPHIC_NAME)
  })

  it('buildBibliographyItem', () => {
    const data: Partial<BibliographyItem> = {
      title: 'Bibliography item title',
      DOI: 'xyz',
      URL: 'https://humdi.net/evo/',
    }
    const item = buildBibliographyItem(data)
    expect(item.id).toMatch(/MPBibliographyItem:\S+/)
    expect(item.objectType).toMatch(BIBLIOGRAPHY_ITEM)
    expect(item.title).toMatch(data.title!)
    expect(item.DOI).toMatch(data.DOI!)
    expect(item.URL).toMatch(data.URL!)
  })

  it('buildBibliographicName', () => {
    const name = {
      given: 'Herp',
      family: 'Derp',
    }
    const bibName = buildBibliographicName(name)
    expect(bibName.given).toMatch(name.given)
    expect(bibName.family).toMatch(name.family)
    expect(bibName._id).toMatch(/MPBibliographicName:\S+/)
    expect(bibName.objectType).toMatch(BIBLIOGRAPHIC_NAME)
  })

  it('buildBibliographicDate', () => {
    const cslDate = { 'date-parts': [['1998', '20', '1']] }
    const date = buildBibliographicDate(cslDate as Partial<CSL.StructuredDate>)
    expect(date._id).toMatch(/MPBibliographicDate:\S+/)
    expect(date.objectType).toMatch(BIBLIOGRAPHIC_DATE)
    expect(date['date-parts']).toEqual(cslDate['date-parts'])
  })

  it('buildAuxiliaryObjectReference', () => {
    const auxRef = buildAuxiliaryObjectReference('x', 'y')
    expect(auxRef.id).toMatch(/MPAuxiliaryObjectReference:\S+/)
    expect(auxRef.objectType).toMatch(AUXILIARY_OBJECT_REFERENCE)
    expect(auxRef.containingObject).toMatch('x')
    expect(auxRef.referencedObject).toMatch('y')
  })

  it('buildCitation', () => {
    const citation = buildCitation('x', 'y')
    expect(citation.id).toMatch(/MPCitation:\S+/)
    expect(citation.containingObject).toMatch('x')
    expect(citation.embeddedCitationItems.length).toEqual(1)
    expect(citation.embeddedCitationItems[0].objectType).toEqual(CITATION_ITEM)
  })

  it('buildKeyword', () => {
    const keyword = buildKeyword('foo')
    expect(keyword.name).toMatch('foo')
    expect(keyword.id).toMatch(/MPKeyword:\S+/)
    expect(keyword.objectType).toMatch(KEYWORD)
  })

  it('buildFigure', () => {
    const file = new Blob(['foo'], {
      type: 'image/png',
    })

    const fig = buildFigure(file as File)
    expect(fig.id).toMatch(/MPFigure:\S+/)
    expect(fig.objectType).toMatch(FIGURE)
    expect(fig.contentType).toMatch(file.type)
    expect(fig.src).toMatch(
      /^blob:https:\/\/localhost\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/
    )
  })

  it('buildAffiliation', () => {
    const aff = buildAffiliation('x')
    expect(aff.id).toMatch(/MPAffiliation:\S+/)
    expect(aff.objectType).toMatch(AFFILIATION)
    expect(aff.name).toMatch('x')
  })
})
