import { Manuscript } from '../../src/types/components'

const manuscripts: Manuscript[] = [
  {
    id: 'example-1',
    project: 'project-1',
    objectType: 'MPManuscript',
    title:
      'Landscape genomic prediction for restoration of a <em>Eucalyptus</em> foundation species under climate change',
    createdAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    updatedAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    citationStyle: 'apa',
    locale: 'en-GB',
  },

  {
    id: 'example-2',
    project: 'project-1',
    objectType: 'MPManuscript',
    title:
      'Two complement receptor one alleles have opposing associations with cerebral malaria and interact with α<sup>+</sup>thalassaemia',
    createdAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    updatedAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    citationStyle: 'nature',
    locale: 'en-US',
  },

  {
    id: 'example-3',
    project: 'project-1',
    objectType: 'MPManuscript',
    title:
      'Cryo-EM structure of the adenosine A<sub>2A</sub> receptor coupled to an engineered heterotrimeric G protein',
    createdAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    updatedAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    citationStyle: 'peerj',
    locale: 'ar',
  },
]

export default manuscripts
