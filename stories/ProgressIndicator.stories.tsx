import { storiesOf } from '@storybook/react'
import React from 'react'
import {
  IndicatorKind,
  IndicatorSize,
  ProgressIndicator,
} from '../src/components/ProgressIndicator'

storiesOf('Progress Indicator', module)
  .add('Determinate Project Progress Indicator', () => (
    <ProgressIndicator
      isDeterminate={true}
      size={IndicatorSize.Large}
      progress={0.4}
      symbols={IndicatorKind.Project}
    />
  ))
  .add('Indeterminate Reference Library View', () => (
    <ProgressIndicator
      isDeterminate={false}
      size={IndicatorSize.Large}
      symbols={IndicatorKind.ReferenceLibrary}
    />
  ))
