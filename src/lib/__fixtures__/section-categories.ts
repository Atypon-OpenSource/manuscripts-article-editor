import { SectionCategory } from '../../types/templates'

export const sectionCategories: SectionCategory[] = [
  {
    _id: 'MPSectionCategory:abstract',
    name: 'Abstract',
    desc: 'A short summary of your work.',
    objectType: 'MPSectionCategory',
    titles: ['abstract', 'summary', 'lead-in'],

    priority: 100,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    _id: 'MPSectionCategory:author-summary',
    name: 'Author Summary',
    desc:
      'A non-technical summary of the work, typically immediately follows the abstract.',
    objectType: 'MPSectionCategory',
    priority: 150,
    titles: ['author summary', 'authorSummary'],
    createdAt: 0,
    updatedAt: 0,
  },
  {
    _id: 'MPSectionCategory:keywords',
    name: 'Keywords',
    desc: 'List of keywords relevant to the manuscript.',
    objectType: 'MPSectionCategory',
    titles: ['Keywords', 'List of keywords'],
    priority: 175,
    createdAt: 0,
    updatedAt: 0,
  },
]
