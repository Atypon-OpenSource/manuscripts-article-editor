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

import { Post, Topic } from '../../src/components/nav/Updates'

interface Feed {
  posts: Post[]
  topics: Topic[]
}

export const feed: Feed = {
  posts: [
    {
      id: 24,
      created_at: '2018-10-05T21:51:55.184Z',
      cooked:
        '<p>Tooltips just became prettier – woot! Stay tuned for keyboard shortcut hints on tooltips.</p>\n<p><div class="lightbox-wrapper"><a class="lightbox" href="//community.manuscripts.io/uploads/db9514/original/1X/20632742ab122069e7e690416a6d9953397fda98.png" data-download-href="//community.manuscripts.io/uploads/db9514/20632742ab122069e7e690416a6d9953397fda98" title="Improved Tooltips.png"><img src="//community.manuscripts.io/uploads/db9514/original/1X/20632742ab122069e7e690416a6d9953397fda98.png" alt="Improved%20Tooltips" width="690" height="454"><div class="meta">\n<span class="filename">Improved Tooltips.png</span><span class="informations">698x460 23.2 KB</span>\n</div></a></div></p>',
      blurb:
        'Tooltips just became prettier – woot! Stay tuned for keyboard shortcut hints on tooltips. Improved Tooltips.png Improved%20Tooltips Improved Tooltips.png 698x460 23.2 KB',
      topic_id: 20,
    },
    {
      id: 23,
      created_at: '2018-10-05T21:43:57.753Z',
      cooked:
        '<p>The <a href="http://Manuscripts.io">Manuscripts.io</a> editor compatibility with the Manuscripts for Mac file format is greatly improved:</p>\n<ul>\n<li>Bug fixes to handling all of figures, tables, code listings, equations to allow them to be loaded and stored in a form compatible with the Mac app.</li>\n<li>Footnotes and endnotes are now loaded from .manuscripts files and internally represented by <a href="http://Manuscripts.io">Manuscripts.io</a> (but not yet presented in the editor).</li>\n</ul>\n<p>Next steps to follow on this front:</p>\n<ul>\n<li>ensure that all parts of the project <em>synchronise</em> across devices: the sync system is strict in accepting only known kinds of data, and we are yet to “train” it to all the kinds of content that is encountered in real documents.</li>\n<li>show error situations encountered during document syncing to make it clear when some parts of the document fail to be saved on the server (all data is always stored locally so no data is lost).</li>\n</ul>',
      blurb:
        'The http://Manuscripts.io Manuscripts.io editor compatibility with the Manuscripts for Mac file format is greatly improved: Bug fixes to handling all of figures, tables, code listings, equations to allow them to be loaded and stored in a form compatible with the Mac app. Footnotes and endnotes ar...',
      topic_id: 19,
    },
  ],
  topics: [
    {
      id: 20,
      title: 'Improved tooltips',
      created_at: '2018-10-05T21:51:55.061Z',
    },
    {
      id: 19,
      title: 'Much improved compatibility with Manuscripts for Mac file format',
      created_at: '2018-10-05T21:43:57.654Z',
    },
  ],
}
