import React from 'react'
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

const FooterContainer: React.SFC = () => <Footer links={links} />

export default FooterContainer
