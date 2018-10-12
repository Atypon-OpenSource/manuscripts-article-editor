import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { CrossReferenceItems } from '../src/components/projects/CrossReferenceItems'
import { Target } from '../src/editor/config/plugins/objects'

const targets: Target[] = [
  {
    id: 'figure-1',
    type: 'figure',
    label: 'Figure 1',
    caption:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam bibendum diam nec tellus tincidunt condimentum. Etiam placerat lacinia libero id efficitur. Aenean sit amet tortor eget est imperdiet volutpat et vitae libero. Vivamus risus orci, viverra sed augue sed, commodo ultrices enim. Aliquam ac pharetra est, sit amet aliquam felis. Nunc eget est in arcu scelerisque accumsan id non eros. Proin semper lobortis pellentesque. Maecenas sit amet purus arcu.',
  },
  {
    id: 'table-1',
    type: 'table',
    label: 'Table 1',
    caption:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam bibendum diam nec tellus tincidunt condimentum. Etiam placerat lacinia libero id efficitur. Aenean sit amet tortor eget est imperdiet volutpat et vitae libero. Vivamus risus orci, viverra sed augue sed, commodo ultrices enim. Aliquam ac pharetra est, sit amet aliquam felis. Nunc eget est in arcu scelerisque accumsan id non eros. Proin semper lobortis pellentesque. Maecenas sit amet purus arcu.',
  },
]

storiesOf('Projects/Cross References', module).add('Picker', () => (
  <CrossReferenceItems targets={targets} handleSelect={action('select')} />
))
