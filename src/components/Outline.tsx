import React from 'react'
import Panel from './Panel'

const Outline: React.SFC = () => (
  <div>
    <Panel name={'outlineTop'} minSize={50} direction={'column'} side={'end'}>
      <div style={{ padding: 20 }}>TOP</div>
    </Panel>
    <div style={{ padding: 20 }}>BOTTOM</div>
  </div>
)

export default Outline
