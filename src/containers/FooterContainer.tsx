import React from 'react'
import { Footer } from '../components/Footer'

// TODO: read this from somewhere else?

interface Link {
  url: string
  text: string
}

const links: Link[] = [
  /*
  {
    url: '/status',
    text: 'Status',
  },
  {
    url: '/disclaimer',
    text: 'Disclaimer',
  },*/
]

const FooterContainer: React.SFC = () => <Footer links={links} />

export default FooterContainer
