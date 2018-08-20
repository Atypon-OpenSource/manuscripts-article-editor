import { storiesOf } from '@storybook/react'
import React from 'react'
import {
  IndicatorKind,
  IndicatorSize,
  ProgressIndicator,
} from '../src/components/ProgressIndicator'

storiesOf('Progress Indicator', module)
  .add('Determinate', () => (
    <div>
      <ProgressIndicator
        isDeterminate={true}
        progress={0.1}
        size={IndicatorSize.Large}
        symbols={IndicatorKind.Author}
      />
      <ProgressIndicator
        isDeterminate={true}
        progress={0.3}
        size={IndicatorSize.Large}
        symbols={IndicatorKind.ContributorDetail}
      />
      <ProgressIndicator
        isDeterminate={true}
        progress={0.5}
        size={IndicatorSize.Large}
        symbols={IndicatorKind.Contributors}
      />
      <ProgressIndicator
        isDeterminate={true}
        progress={0.7}
        size={IndicatorSize.Large}
        symbols={IndicatorKind.Project}
      />
      <ProgressIndicator
        isDeterminate={true}
        progress={0.9}
        size={IndicatorSize.Large}
        symbols={IndicatorKind.ReferenceLibrary}
      />
    </div>
  ))
  .add('Indeterminate', () => (
    <div>
      <ProgressIndicator
        isDeterminate={false}
        size={IndicatorSize.Large}
        symbols={IndicatorKind.Author}
      />
      <ProgressIndicator
        isDeterminate={false}
        size={IndicatorSize.Large}
        symbols={IndicatorKind.ContributorDetail}
      />
      <ProgressIndicator
        isDeterminate={false}
        size={IndicatorSize.Large}
        symbols={IndicatorKind.Contributors}
      />
      <ProgressIndicator
        isDeterminate={false}
        size={IndicatorSize.Large}
        symbols={IndicatorKind.Project}
      />
      <ProgressIndicator
        isDeterminate={false}
        size={IndicatorSize.Large}
        symbols={IndicatorKind.ReferenceLibrary}
      />
    </div>
  ))
