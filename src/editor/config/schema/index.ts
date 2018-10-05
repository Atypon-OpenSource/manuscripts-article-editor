import { Schema } from 'prosemirror-model'

import marks, { Marks } from './marks'
import nodes, { Nodes } from './nodes'

export default new Schema<Nodes, Marks>({ nodes, marks })
