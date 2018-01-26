import * as React from 'react'
import { Footer } from '../components/Footer'

// TODO: read this from somewhere else?
const links = [
  {
    url: '/status',
    text: 'Status',
  },
  {
    url: '/disclaimer',
    text: 'Disclaimer',
  },
]

class FooterContainer extends React.Component {
  public render() {
    return <Footer links={links} />
  }
}

export default FooterContainer
