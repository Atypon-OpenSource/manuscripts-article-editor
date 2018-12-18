import { ManuscriptCategory } from '@manuscripts/manuscripts-json-schema'

export const manuscriptCategories: ManuscriptCategory[] = [
  {
    _id: 'MPManuscriptCategory:research-article',
    name: 'Research Article',
    desc: 'Peer reviewed research publications.',
    imageName: 'Research',
    objectType: 'MPManuscriptCategory',
    typicalFixedSectionTreeDepth: 1,
    priority: 100,
    containerID: 'MPProject:example',
    createdAt: 0,
    updatedAt: 0,
  },
  {
    _id: 'MPManuscriptCategory:essay',
    name: 'Essay',
    desc: 'Essays',
    imageName: 'Essay',
    objectType: 'MPManuscriptCategory',
    typicalFixedSectionTreeDepth: 1,
    priority: 200,
    containerID: 'MPProject:example',
    createdAt: 0,
    updatedAt: 0,
  },
  {
    _id: 'MPManuscriptCategory:dissertation',
    name: 'Dissertation',
    desc: "Master's & PhD theses, and other dissertations.",
    imageName: 'Dissertation',
    objectType: 'MPManuscriptCategory',
    typicalFixedSectionTreeDepth: 1,
    priority: 300,
    containerID: 'MPProject:example',
    createdAt: 0,
    updatedAt: 0,
  },
  {
    _id: 'MPManuscriptCategory:book',
    name: 'Book',
    desc: 'A book or a book chapter',
    imageName: 'Chapter',
    objectType: 'MPManuscriptCategory',
    typicalFixedSectionTreeDepth: 2,
    priority: 400,
    containerID: 'MPProject:example',
    createdAt: 0,
    updatedAt: 0,
  },
  {
    _id: 'MPManuscriptCategory:grant-application',
    name: 'Grant Application',
    desc: 'An application for funding.',
    imageName: 'Patent',
    objectType: 'MPManuscriptCategory',
    typicalFixedSectionTreeDepth: 1,
    priority: 500,
    containerID: 'MPProject:example',
    createdAt: 0,
    updatedAt: 0,
  },
  {
    _id: 'MPManuscriptCategory:blog-post',
    name: 'Blog Post',
    desc: 'A blog post',
    imageName: 'Blog',
    objectType: 'MPManuscriptCategory',
    typicalFixedSectionTreeDepth: 0,
    priority: 600,
    containerID: 'MPProject:example',
    createdAt: 0,
    updatedAt: 0,
  },
  {
    _id: 'MPManuscriptCategory:manual',
    name: 'Manual',
    desc: 'A manual (for a software product etc).',
    imageName: 'Manual',
    objectType: 'MPManuscriptCategory',
    typicalFixedSectionTreeDepth: 1,
    priority: 700,
    containerID: 'MPProject:example',
    createdAt: 0,
    updatedAt: 0,
  },
]
