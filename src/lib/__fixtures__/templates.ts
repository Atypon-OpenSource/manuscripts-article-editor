import { TemplatesDataType } from '../../types/templates'

export const templates: TemplatesDataType[] = [
  {
    _id:
      'MPManuscriptTemplate:www-zotero-org-styles-nonlinear-dynamics-Nonlinear-Dynamics-Journal-Publication',
    LaTeXTemplateURL:
      'http://static.springer.com/sgw/documents/468198/application/zip/LaTeX.zip',
    aim:
      'Nonlinear Dynamics provides a forum for the rapid publication of original research in the developing field of nonlinear dynamics. The scope of the journal encompasses all nonlinear dynamic phenomena associated with mechanical, structural, civil, aeronautical, ocean, electrical and control systems. Review articles and original contributions based on analytical, computational, and experimental methods are solicited, dealing with such topics as perturbation and computational methods, symbolic manipulation, dynamic stability, local and global methods, bifurcations, chaos, deterministic and random vibrations, Lie groups, multibody dynamics, robotics, fluid-solid interactions, system modelling and identification, friction and damping models, signal analysis, measurement techniques.',
    bundle: 'MPBundle:www-zotero-org-styles-nonlinear-dynamics',
    category: 'MPManuscriptCategory:research-article',
    createdAt: 1433095331.928713,
    objectType: 'MPManuscriptTemplate',
    priority: 2199,
    publisher: 'MPPublisher:springer',
    requirementIDs: [
      'MPMandatorySubsectionsRequirement:5C105460-B50D-4616-8A12-ADC99EFF359E',
      'MPMandatorySubsectionsRequirement:AA78B79C-17AB-45C4-8E11-E21FAB3F8B86',
      'MPMandatorySubsectionsRequirement:75CC5A24-8D8E-41BA-9488-36B0A138C27A',
      'MPMandatorySubsectionsRequirement:4238F0B9-E8E8-4E7A-9B58-2B9657C9338F',
      'MPMandatorySubsectionsRequirement:44CAA244-C3E7-46FC-8407-7733D14925ED',
    ],
    requirements: {
      auxiliaries: {},
      equations: {},
      figures: {},
      manuscript: {},
      references: {},
      sections: {
        abstract: {
          maxWordCount: 250,
          minWordCount: 150,
          required: true,
        },
        acknowledgements: {
          required: true,
        },
        competingInterests: {
          required: true,
          title: 'Conflict of interest',
        },
        coverLetter: {},
        keywords: {
          maxKeywordCount: 6,
          minKeywordCount: 4,
          required: true,
        },
      },
      tables: {},
    },
    styles: {
      figureStyle: {
        caption: {
          fontWeight: 'bold',
        },
        figureTitleComponents: 'lowercase-latin',
        numberingScheme: 'decimal',
      },
      tableStyle: {
        numberingScheme: 'decimal',
      },
    },
    title: 'Nonlinear Dynamics Journal Publication',
    updatedAt: 1433095363.404887,
  },
  {
    _id:
      'MPMandatorySubsectionsRequirement:5C105460-B50D-4616-8A12-ADC99EFF359E',
    createdAt: 1433095331.931018,
    embeddedSectionDescriptions: [
      {
        _id: 'MPSectionDescription:BFAC45E0-2403-4997-A145-183188A83F78',
        maxWordCount: 250,
        minWordCount: 150,
        objectType: 'MPSectionDescription',
        required: true,
        sectionCategory: 'MPSectionCategory:abstract',
      },
    ],
    evaluatedObject:
      'MPManuscriptTemplate:www-zotero-org-styles-nonlinear-dynamics-Nonlinear-Dynamics-Journal-Publication',
    objectType: 'MPMandatorySubsectionsRequirement',
    severity: 0,
    updatedAt: 1433095331.931018,
  },
  {
    _id:
      'MPMandatorySubsectionsRequirement:AA78B79C-17AB-45C4-8E11-E21FAB3F8B86',
    createdAt: 1433095331.9331,
    embeddedSectionDescriptions: [
      {
        _id: 'MPSectionDescription:0E79AC48-EC81-4631-976E-E8EE625235D0',
        objectType: 'MPSectionDescription',
        required: true,
        sectionCategory: 'MPSectionCategory:competing-interests',
        title: 'Conflict of interest',
      },
    ],
    evaluatedObject:
      'MPManuscriptTemplate:www-zotero-org-styles-nonlinear-dynamics-Nonlinear-Dynamics-Journal-Publication',
    objectType: 'MPMandatorySubsectionsRequirement',
    severity: 0,
    updatedAt: 1433095331.9331,
  },
  {
    _id:
      'MPMandatorySubsectionsRequirement:75CC5A24-8D8E-41BA-9488-36B0A138C27A',
    createdAt: 1433095331.935472,
    embeddedSectionDescriptions: [
      {
        _id: 'MPSectionDescription:270515CA-0192-4512-9048-5F5D029CF8D7',
        objectType: 'MPSectionDescription',
        required: true,
        sectionCategory: 'MPSectionCategory:acknowledgement',
      },
    ],
    evaluatedObject:
      'MPManuscriptTemplate:www-zotero-org-styles-nonlinear-dynamics-Nonlinear-Dynamics-Journal-Publication',
    objectType: 'MPMandatorySubsectionsRequirement',
    severity: 0,
    updatedAt: 1433095331.935472,
  },
  {
    _id:
      'MPMandatorySubsectionsRequirement:4238F0B9-E8E8-4E7A-9B58-2B9657C9338F',
    createdAt: 1433095331.937757,
    embeddedSectionDescriptions: [
      {
        _id: 'MPSectionDescription:B7973910-764E-459A-961B-8E15E95A4666',
        maxKeywordCount: 6,
        minKeywordCount: 4,
        objectType: 'MPSectionDescription',
        required: true,
        sectionCategory: 'MPSectionCategory:keywords',
      },
    ],
    evaluatedObject:
      'MPManuscriptTemplate:www-zotero-org-styles-nonlinear-dynamics-Nonlinear-Dynamics-Journal-Publication',
    objectType: 'MPMandatorySubsectionsRequirement',
    severity: 0,
    updatedAt: 1433095331.937757,
  },
  {
    _id:
      'MPMandatorySubsectionsRequirement:44CAA244-C3E7-46FC-8407-7733D14925ED',
    createdAt: 1433095331.940251,
    embeddedSectionDescriptions: [
      {
        _id: 'MPSectionDescription:8238598C-4D69-4D7E-BBEF-781B9EFD321A',
        objectType: 'MPSectionDescription',
        sectionCategory: 'MPSectionCategory:cover-letter',
      },
    ],
    evaluatedObject:
      'MPManuscriptTemplate:www-zotero-org-styles-nonlinear-dynamics-Nonlinear-Dynamics-Journal-Publication',
    objectType: 'MPMandatorySubsectionsRequirement',
    severity: 0,
    updatedAt: 1433095331.940251,
  },
]
