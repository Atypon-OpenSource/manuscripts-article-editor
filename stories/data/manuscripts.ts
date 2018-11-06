import { Manuscript } from '@manuscripts/manuscripts-json-schema'

const manuscripts: Manuscript[] = [
  {
    _id: 'example-1',
    containerID: 'project-1',
    objectType: 'MPManuscript',
    title:
      'Landscape genomic prediction for restoration of a <em>Eucalyptus</em> foundation species under climate change',
    createdAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    updatedAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    bundle: 'MPBundle:www-zotero-org-styles-apa-5th-edition',
    primaryLanguageCode: 'en-GB',
  },

  {
    _id: 'example-2',
    containerID: 'project-1',
    objectType: 'MPManuscript',
    title:
      'Two complement receptor one alleles have opposing associations with cerebral malaria and interact with α<sup>+</sup>thalassaemia',
    createdAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    updatedAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    bundle: 'MPBundle:www-zotero-org-styles-nature',
    primaryLanguageCode: 'en-US',
  },

  {
    _id: 'example-3',
    containerID: 'project-1',
    objectType: 'MPManuscript',
    title:
      'Cryo-EM structure of the adenosine A<sub>2A</sub> receptor coupled to an engineered heterotrimeric G protein',
    createdAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    updatedAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    bundle: 'MPBundle:www-zotero-org-styles-peerj',
    primaryLanguageCode: 'ar',
  },
]

export default manuscripts

export const manuscript = manuscripts[0]
