/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { TemplateData } from '../../src/lib/templates'

export const templatesData: Array<Omit<TemplateData, 'titleAndType'>> = [
  {
    template: {
      _id:
        'MPManuscriptTemplate:www-zotero-org-styles-drugs-and-aging-Drugs-&-Aging-Journal--Publication',
      aim:
        'Drugs & Aging promotes optimum drug therapy in older adults by providing a programme of review articles covering the most important aspects of clinical pharmacology and patient management in this unique group. Age-related physiological changes with clinical implications for drug therapy also fall within the scope of the Journal.',
      bundle: 'MPBundle:www-zotero-org-styles-drugs-and-aging',
      category: 'MPManuscriptCategory:research-article',
      createdAt: 1433095331.944184,
      desc:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Metus dictum at tempor commodo ullamcorper a lacus vestibulum sed. Sit amet aliquam id diam maecenas. Amet mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Amet mattis vulputate enim nulla aliquet. Elit sed vulputate mi sit amet mauris commodo quis imperdiet. Ultrices gravida dictum fusce ut placerat orci nulla pellentesque dignissim. Massa vitae tortor condimentum lacinia quis vel eros donec ac. Orci dapibus ultrices in iaculis nunc sed augue lacus viverra. Nunc pulvinar sapien et ligula ullamcorper malesuada proin libero. Semper auctor neque vitae tempus. Faucibus purus in massa tempor nec feugiat nisl. Quisque id diam vel quam elementum pulvinar. Sed ullamcorper morbi tincidunt ornare massa. Id venenatis a condimentum vitae sapien pellentesque habitant morbi.',
      objectType: 'MPManuscriptTemplate',
      priority: 2204,
      publisher: 'MPPublisher:springer',
      mandatorySectionRequirements: [
        'MPMandatorySubsectionsRequirement:7F656DBF-F545-474F-AD4C-F4C48673E45B',
      ],
      title: 'Drugs & Aging Journal  Publication',
      updatedAt: 1433095363.404891,
    },
    bundle: {
      _id: 'MPBundle:www-zotero-org-styles-drugs-and-aging',
      csl: {
        ISSNs: ['1170229X'],
        _id: 'MPCitationStyle:www-zotero-org-styles-drugs-and-aging',
        cslIdentifier: 'http://www.zotero.org/styles/drugs-and-aging',
        defaultLocale: 'en-US',
        'documentation-URL':
          'http://www.springer.com/cda/content/document/cda_downloaddocument/manuscript-guidelines-1.0.pdf',
        eISSNs: ['11791969'],
        fields: ['MPResearchField:medicine'],
        'independent-parent-URL':
          'http://www.zotero.org/styles/springer-vancouver-brackets',
        license: 'http://creativecommons.org/licenses/by-sa/3.0/',
        'self-URL': 'http://www.zotero.org/styles/drugs-and-aging',
        title: 'Drugs & Aging',
        updatedAt: 1400151600,
        version: '1.0',
      },
      objectType: 'MPBundle',
      createdAt: 0,
      updatedAt: 0,
    },
    title: 'Drugs & Aging',
    articleType: 'Journal Publication',
    publisher: {
      _id: 'MPPublisher:springer',
      objectType: 'MPPublisher',
      name: 'Springer Science+Business Media',
      websiteURL: 'http://www.springer.com',
      bundled: true,
      canArchivePreprint: true,
      canArchivePostprint: true,
      synonyms: ['Springer Verlag'],
      createdAt: 0,
      updatedAt: 0,
    },
    category: 'MPManuscriptCategory:research-article',
  },
  {
    template: {
      _id:
        'MPManuscriptTemplate:www-zotero-org-styles-drugs-and-aging-Drugs-&-Aging-Journal--Publication-Review-Article',
      aim:
        'Drugs & Aging promotes optimum drug therapy in older adults by providing a programme of review articles covering the most important aspects of clinical pharmacology and patient management in this unique group. Age-related physiological changes with clinical implications for drug therapy also fall within the scope of the Journal.',
      bundle: 'MPBundle:www-zotero-org-styles-drugs-and-aging',
      category: 'MPManuscriptCategory:research-article',
      createdAt: 1433095357.797592,
      desc:
        'Provides an authoritative, balanced, comprehensive, fully referenced and critical review of the literature.',
      objectType: 'MPManuscriptTemplate',
      parent: 'Drugs & Aging Journal  Publication',
      publisher: 'MPPublisher:springer',
      mandatorySectionRequirements: [
        'MPMandatorySubsectionsRequirement:03FFC4C4-E01F-4413-8CA6-19D2B0104E47',
      ],
      maxWordCountRequirement:
        'MPMaximumManuscriptWordCountRequirement:1415DDB6-79D8-4B6C-84FE-5774713B3B28',
      styles: { body: {} },
      title: 'Review Article',
      updatedAt: 1433095363.408076,
    },
    bundle: {
      _id: 'MPBundle:www-zotero-org-styles-drugs-and-aging',
      csl: {
        ISSNs: ['1170229X'],
        _id: 'MPCitationStyle:www-zotero-org-styles-drugs-and-aging',
        cslIdentifier: 'http://www.zotero.org/styles/drugs-and-aging',
        defaultLocale: 'en-US',
        'documentation-URL':
          'http://www.springer.com/cda/content/document/cda_downloaddocument/manuscript-guidelines-1.0.pdf',
        eISSNs: ['11791969'],
        fields: ['MPResearchField:medicine'],
        'independent-parent-URL':
          'http://www.zotero.org/styles/springer-vancouver-brackets',
        license: 'http://creativecommons.org/licenses/by-sa/3.0/',
        'self-URL': 'http://www.zotero.org/styles/drugs-and-aging',
        title: 'Drugs & Aging',
        updatedAt: 1400151600,
        version: '1.0',
      },
      objectType: 'MPBundle',
      createdAt: 0,
      updatedAt: 0,
    },
    title: 'Drugs & Aging',
    articleType: 'Review Article',
    publisher: {
      _id: 'MPPublisher:springer',
      objectType: 'MPPublisher',
      name: 'Springer Science+Business Media',
      websiteURL: 'http://www.springer.com',
      bundled: true,
      canArchivePreprint: true,
      canArchivePostprint: true,
      synonyms: ['Springer Verlag'],
      createdAt: 0,
      updatedAt: 0,
    },
    category: 'MPManuscriptCategory:research-article',
  },
  {
    template: {
      _id:
        'MPManuscriptTemplate:www-zotero-org-styles-drugs-and-aging-Drugs-&-Aging-Journal--Publication-Current-Opinion',
      aim:
        'Drugs & Aging promotes optimum drug therapy in older adults by providing a programme of review articles covering the most important aspects of clinical pharmacology and patient management in this unique group. Age-related physiological changes with clinical implications for drug therapy also fall within the scope of the Journal.',
      bundle: 'MPBundle:www-zotero-org-styles-drugs-and-aging',
      category: 'MPManuscriptCategory:research-article',
      createdAt: 1433095357.83534,
      desc:
        'Places an area in perspective given that it is of current international interest and a consensus has not yet been reached; therefore, the arguments presented may be controversial, but at the same time must be balanced and rational.',
      objectType: 'MPManuscriptTemplate',
      parent: 'Drugs & Aging Journal  Publication',
      publisher: 'MPPublisher:springer',
      mandatorySectionRequirements: [
        'MPMandatorySubsectionsRequirement:0CEE208D-5C07-4810-8B39-E7ED62FBC24B',
      ],
      maxWordCountRequirement:
        'MPMaximumManuscriptWordCountRequirement:B72EFA69-D479-40F8-BFBB-86D73F2112E5',
      minWordCountRequirement:
        'MPMinimumManuscriptWordCountRequirement:FAAC47D2-A782-4C17-8643-BB3CBA007A8A',
      styles: { body: {} },
      title: 'Current Opinion',
      updatedAt: 1433095363.40808,
    },
    bundle: {
      _id: 'MPBundle:www-zotero-org-styles-drugs-and-aging',
      csl: {
        ISSNs: ['1170229X'],
        _id: 'MPCitationStyle:www-zotero-org-styles-drugs-and-aging',
        cslIdentifier: 'http://www.zotero.org/styles/drugs-and-aging',
        defaultLocale: 'en-US',
        'documentation-URL':
          'http://www.springer.com/cda/content/document/cda_downloaddocument/manuscript-guidelines-1.0.pdf',
        eISSNs: ['11791969'],
        fields: ['MPResearchField:medicine'],
        'independent-parent-URL':
          'http://www.zotero.org/styles/springer-vancouver-brackets',
        license: 'http://creativecommons.org/licenses/by-sa/3.0/',
        'self-URL': 'http://www.zotero.org/styles/drugs-and-aging',
        title: 'Drugs & Aging',
        updatedAt: 1400151600,
        version: '1.0',
      },
      objectType: 'MPBundle',
      createdAt: 0,
      updatedAt: 0,
    },
    title: 'Drugs & Aging',
    articleType: 'Current Opinion',
    publisher: {
      _id: 'MPPublisher:springer',
      objectType: 'MPPublisher',
      name: 'Springer Science+Business Media',
      websiteURL: 'http://www.springer.com',
      bundled: true,
      canArchivePreprint: true,
      canArchivePostprint: true,
      synonyms: ['Springer Verlag'],
      createdAt: 0,
      updatedAt: 0,
    },
    category: 'MPManuscriptCategory:research-article',
  },
  {
    template: {
      _id:
        'MPManuscriptTemplate:www-zotero-org-styles-drugs-and-aging-Drugs-&-Aging-Journal--Publication-Leading-Article',
      aim:
        'Drugs & Aging promotes optimum drug therapy in older adults by providing a programme of review articles covering the most important aspects of clinical pharmacology and patient management in this unique group. Age-related physiological changes with clinical implications for drug therapy also fall within the scope of the Journal.',
      bundle: 'MPBundle:www-zotero-org-styles-drugs-and-aging',
      category: 'MPManuscriptCategory:research-article',
      createdAt: 1433095357.847189,
      desc:
        'Provides a short, balanced overview of the current state of development of an emerging area.',
      objectType: 'MPManuscriptTemplate',
      parent: 'Drugs & Aging Journal  Publication',
      publisher: 'MPPublisher:springer',
      mandatorySectionRequirements: [
        'MPMandatorySubsectionsRequirement:928A1FBE-B13B-4406-9D72-CA02671B8E23',
      ],
      maxWordCountRequirement:
        'MPMaximumManuscriptWordCountRequirement:02D12024-F05E-4932-908C-1A15EDDD8433',
      title: 'Leading Article',
      updatedAt: 1433095363.408083,
    },
    bundle: {
      _id: 'MPBundle:www-zotero-org-styles-drugs-and-aging',
      csl: {
        ISSNs: ['1170229X'],
        _id: 'MPCitationStyle:www-zotero-org-styles-drugs-and-aging',
        cslIdentifier: 'http://www.zotero.org/styles/drugs-and-aging',
        defaultLocale: 'en-US',
        'documentation-URL':
          'http://www.springer.com/cda/content/document/cda_downloaddocument/manuscript-guidelines-1.0.pdf',
        eISSNs: ['11791969'],
        fields: ['MPResearchField:medicine'],
        'independent-parent-URL':
          'http://www.zotero.org/styles/springer-vancouver-brackets',
        license: 'http://creativecommons.org/licenses/by-sa/3.0/',
        'self-URL': 'http://www.zotero.org/styles/drugs-and-aging',
        title: 'Drugs & Aging',
        updatedAt: 1400151600,
        version: '1.0',
      },
      objectType: 'MPBundle',

      createdAt: 0,
      updatedAt: 0,
    },
    title: 'Drugs & Aging',
    articleType: 'Leading Article',
    publisher: {
      _id: 'MPPublisher:springer',
      objectType: 'MPPublisher',
      name: 'Springer Science+Business Media',
      websiteURL: 'http://www.springer.com',
      bundled: true,
      canArchivePreprint: true,
      canArchivePostprint: true,
      synonyms: ['Springer Verlag'],
      createdAt: 0,
      updatedAt: 0,
    },
    category: 'MPManuscriptCategory:research-article',
  },
  {
    template: {
      _id:
        'MPManuscriptTemplate:www-zotero-org-styles-drugs-and-aging-Drugs-&-Aging-Journal--Publication-Therapy-in-Practice',
      aim:
        'Drugs & Aging promotes optimum drug therapy in older adults by providing a programme of review articles covering the most important aspects of clinical pharmacology and patient management in this unique group. Age-related physiological changes with clinical implications for drug therapy also fall within the scope of the Journal.',
      bundle: 'MPBundle:www-zotero-org-styles-drugs-and-aging',
      category: 'MPManuscriptCategory:research-article',
      createdAt: 1433095357.858777,
      desc:
        "Provides a succinct, clinically orientated guide to the optimum management of the disease/disorder/situation which highlights practical, clinically relevant considerations and recommendations, rather than those of theoretical or academic interest. May include management 'flow charts' or treatment protocols where appropriate.",
      objectType: 'MPManuscriptTemplate',
      parent: 'Drugs & Aging Journal  Publication',
      publisher: 'MPPublisher:springer',
      mandatorySectionRequirements: [
        'MPMandatorySubsectionsRequirement:F49F53D8-89E0-4524-86F4-6A0D49DE88DF',
      ],
      maxWordCountRequirement:
        'MPMaximumManuscriptWordCountRequirement:6CA1572D-1F5D-420E-859D-4FE5D3583C8C',
      title: 'Therapy in Practice',
      updatedAt: 1433095363.408087,
    },
    bundle: {
      _id: 'MPBundle:www-zotero-org-styles-drugs-and-aging',
      csl: {
        ISSNs: ['1170229X'],
        _id: 'MPCitationStyle:www-zotero-org-styles-drugs-and-aging',
        cslIdentifier: 'http://www.zotero.org/styles/drugs-and-aging',
        defaultLocale: 'en-US',
        'documentation-URL':
          'http://www.springer.com/cda/content/document/cda_downloaddocument/manuscript-guidelines-1.0.pdf',
        eISSNs: ['11791969'],
        fields: ['MPResearchField:medicine'],
        'independent-parent-URL':
          'http://www.zotero.org/styles/springer-vancouver-brackets',
        license: 'http://creativecommons.org/licenses/by-sa/3.0/',
        'self-URL': 'http://www.zotero.org/styles/drugs-and-aging',
        title: 'Drugs & Aging',
        updatedAt: 1400151600,
        version: '1.0',
      },
      objectType: 'MPBundle',
      createdAt: 0,
      updatedAt: 0,
    },
    title: 'Drugs & Aging',
    articleType: 'Therapy in Practice',
    publisher: {
      _id: 'MPPublisher:springer',
      objectType: 'MPPublisher',
      name: 'Springer Science+Business Media',
      websiteURL: 'http://www.springer.com',
      bundled: true,
      canArchivePreprint: true,
      canArchivePostprint: true,
      synonyms: ['Springer Verlag'],
      createdAt: 0,
      updatedAt: 0,
    },
    category: 'MPManuscriptCategory:research-article',
  },
  {
    template: {
      _id:
        'MPManuscriptTemplate:www-zotero-org-styles-drugs-and-aging-Drugs-&-Aging-Journal--Publication-Systematic-Review',
      aim:
        'Drugs & Aging promotes optimum drug therapy in older adults by providing a programme of review articles covering the most important aspects of clinical pharmacology and patient management in this unique group. Age-related physiological changes with clinical implications for drug therapy also fall within the scope of the Journal.',
      bundle: 'MPBundle:www-zotero-org-styles-drugs-and-aging',
      category: 'MPManuscriptCategory:research-article',
      desc:
        'Collates all empirical evidence that fits pre-specified eligibility criteria to answer a specific research question. It uses explicit, systematic methods that are selected with a view to minimizing bias, thus providing reliable findings from which conclusions can be drawn and decisions made.',
      objectType: 'MPManuscriptTemplate',
      parent: 'Drugs & Aging Journal  Publication',
      publisher: 'MPPublisher:springer',
      mandatorySectionRequirements: [
        'MPMandatorySubsectionsRequirement:1490A50B-F84D-4580-A1DA-BEE701961BF8',
      ],
      maxWordCountRequirement:
        'MPMaximumManuscriptWordCountRequirement:4FF2440B-1282-41D6-83FE-2F3C7358DBE6',
      title: 'Systematic Review',
      createdAt: 0,
      updatedAt: 0,
    },
    bundle: {
      _id: 'MPBundle:www-zotero-org-styles-drugs-and-aging',
      csl: {
        ISSNs: ['1170229X'],
        _id: 'MPCitationStyle:www-zotero-org-styles-drugs-and-aging',
        cslIdentifier: 'http://www.zotero.org/styles/drugs-and-aging',
        defaultLocale: 'en-US',
        'documentation-URL':
          'http://www.springer.com/cda/content/document/cda_downloaddocument/manuscript-guidelines-1.0.pdf',
        eISSNs: ['11791969'],
        fields: ['MPResearchField:medicine'],
        'independent-parent-URL':
          'http://www.zotero.org/styles/springer-vancouver-brackets',
        license: 'http://creativecommons.org/licenses/by-sa/3.0/',
        'self-URL': 'http://www.zotero.org/styles/drugs-and-aging',
        title: 'Drugs & Aging',
        updatedAt: 1400151600,
        version: '1.0',
      },
      objectType: 'MPBundle',
      createdAt: 0,
      updatedAt: 0,
    },
    title: 'Drugs & Aging',
    articleType: 'Systematic Review',
    publisher: {
      _id: 'MPPublisher:springer',
      objectType: 'MPPublisher',
      name: 'Springer Science+Business Media',
      websiteURL: 'http://www.springer.com',
      bundled: true,
      canArchivePreprint: true,
      canArchivePostprint: true,
      synonyms: ['Springer Verlag'],
      createdAt: 0,
      updatedAt: 0,
    },
    category: 'MPManuscriptCategory:research-article',
  },
  {
    template: {
      _id:
        'MPManuscriptTemplate:MPBundle:www-zotero-org-styles-harvard1-cambridge_university_press_journal_publication',
      createdAt: 1439123042.550768,
      licenses: [
        'MPLicense:cc-by',
        'MPLicense:cc-by-nc-nd',
        'MPLicense:cc-by-nc-sa',
      ],
      objectType: 'MPManuscriptTemplate',
      publisher: 'MPPublisher:cup',
      title: 'Cambridge University Press Journal Publication',
      updatedAt: 1439123085.200659,
    },
    publisher: {
      _id: 'MPPublisher:cup',
      objectType: 'MPPublisher',
      name: 'Cambridge University Press',
      websiteURL: 'http://www.cambridge.org',
      bundled: true,
      createdAt: 0,
      updatedAt: 0,
    },
    title: 'Cambridge University Press',
    articleType: 'Journal Publication',
    category: 'MPManuscriptCategory:research-article',
  },
  {
    template: {
      _id:
        'MPManuscriptTemplate:MPManuscriptTemplate:MPBundle:www-zotero-org-styles-harvard1-cambridge_university_press_journal_publication-MPBundle:www-zotero-org-styles-harvard1-thalamus_and_related_systems_',
      ISSNs: ['1472-9288'],
      acceptableFigureFormats: ['tiff'],
      acceptableManuscriptFormats: [],
      aim:
        'Thalamus and Related Systems publishes papers on the structure, organization and chemistry of thalamic neurons, including the development, single-cell electrophysiology and synaptic interaction, molecular biology, neuropsychology, computational neurobiology and pathology of the thalamus. Experimental studies, using a variety of techniques in vivo, in vitro and in computo, as well as clinical and behavioural studies (but not case reports), will be considered for publication. Papers with relevance to the thalamus and related systems, such as activities in thalamo–cortical, cortico–thalamic or brainstem–thalamic interactions, will also be considered. Multiple-part papers are encouraged. The journal publishes regular articles, short communications, occasional feature articles to address current and important issues (by invitation), mini-reviews and commentaries, and book reviews relevant to the thalamus. ',
      authorInstructionsURL: 'http://assets.cambridge.org/THL/THL_ifc.pdf',
      bodyLineSpacing: 2,
      createdAt: 1439128912.826068,
      eISSNs: ['1744-8107'],
      embeddedTableElementNumberingStyle: {
        _id: 'MPNumberingStyle:BE3C61B9-2956-4153-A8E3-C19438C8BD38',
        numberingScheme: 'decimal',
        objectType: 'MPNumberingStyle',
        startIndex: 1,
      },
      minFigureScreenDPIRequirement:
        'MPMinimumFigureDPIRequirement:DE4E12A7-7357-4DE4-8720-B8DEE85413DD',
      notes:
        'Allow margins of at least 1" (25 mm); do not hyphenate words at the end of lines and do not justify right margins.',
      objectType: 'MPManuscriptTemplate',
      parent:
        'MPManuscriptTemplate:MPBundle:www-zotero-org-styles-harvard1-cambridge_university_press_journal_publication',
      publisher: 'MPPublisher:cup',
      mandatorySectionRequirements: [
        'MPMandatorySubsectionsRequirement:D7B7E262-2A3A-4AF9-87A2-DFEC15249E28',
        'MPMandatorySubsectionsRequirement:84515E0C-D99D-4A90-86C3-DBC64758028D',
        'MPMandatorySubsectionsRequirement:0E0E68FF-B0E8-46EB-B991-B9F6A6ABA5E9',
        'MPMandatorySubsectionsRequirement:1C685656-E6E3-4AC2-AA73-F19926371261',
        'MPMandatorySubsectionsRequirement:B494C794-F828-4841-A981-BB90CF4163AA',
        'MPMandatorySubsectionsRequirement:E127CF98-2969-406E-8778-A6A38D9379BA',
        'MPMandatorySubsectionsRequirement:709C9593-ADCA-48EB-83FB-71381741C62E',
        'MPMandatorySubsectionsRequirement:26AD7604-90E4-4640-880C-EDBBA7A228EF',
        'MPMandatorySubsectionsRequirement:D308FDD8-61B1-47CB-BE16-7F3CAE8DBCC2',
        'MPMandatorySubsectionsRequirement:04ED0E97-8E60-47DE-9544-2A356F801F3E',
        'MPMandatorySubsectionsRequirement:54733CFE-7222-4440-83D5-97AD279E106E',
      ],
      sourceURL: 'http://journals.cambridge.org/action/displayJournal?jid=THL',
      tableElementFileLayout: 4,
      title: 'Thalamus and Related Systems',
      updatedAt: 1439129561.421373,
    },
    title: 'Thalamus and Related Systems',
    category: 'MPManuscriptCategory:research-article',
  },
  {
    bundle: {
      _id: 'MPBundle:www-zotero-org-styles-zoology-in-the-middle-east',
      csl: {
        ISSNs: ['09397140'],
        _id: 'MPCitationStyle:www-zotero-org-styles-zoology-in-the-middle-east',
        cslIdentifier:
          'http://www.zotero.org/styles/zoology-in-the-middle-east',
        defaultLocale: 'en-US',
        'documentation-URL':
          'http://www.tandfonline.com/action/authorSubmission?journalCode=TZME20&page=instructions',
        eISSNs: ['23262680'],
        fields: ['MPResearchField:biology'],
        'independent-parent-URL': 'http://www.zotero.org/styles/apa',
        license: 'http://creativecommons.org/licenses/by-sa/3.0/',
        'self-URL': 'http://www.zotero.org/styles/zoology-in-the-middle-east',
        title: 'Zoology in the Middle East',
        updatedAt: 1400324400,
        version: '1.0',
      },
      objectType: 'MPBundle',
      createdAt: 0,
      updatedAt: 0,
    },
    title: 'Zoology in the Middle East',
    category: 'MPManuscriptCategory:research-article',
  },
]
