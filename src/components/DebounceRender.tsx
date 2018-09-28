// adapted from https://github.com/podefr/react-debounce-render/pull/12/

import { DebounceSettings } from 'lodash'
import { debounce } from 'lodash-es'
import React, { Component } from 'react'

export const debounceRender = <Props extends {}>(
  DebouncedComponent: React.ComponentType<Props>, // tslint:disable-line:no-any
  wait?: number,
  options?: DebounceSettings
) => {
  return class DebouncedContainer extends Component<Props> {
    public updateDebounced = debounce(this.forceUpdate, wait, options)

    public shouldComponentUpdate() {
      this.updateDebounced()
      return false
    }

    public componentWillUnmount() {
      this.updateDebounced.cancel()
    }

    public render() {
      return <DebouncedComponent {...this.props} />
    }
  }
}
