import * as React from 'react'
import { ManuscriptsActionCreators } from '../store/manuscripts/types'
import { ManuscriptInterface } from '../types/manuscript'
import { ActionButton } from './Button'
import { Manuscripts } from './Manuscripts'
import { PageHeading } from './PageHeading'
import { Search } from './Search'

interface ManuscriptsPageProps {
  manuscripts: ManuscriptInterface[]
}

const ManuscriptsPage: React.SFC<
  ManuscriptsPageProps & ManuscriptsActionCreators
> = ({ manuscripts }) => (
  <React.Fragment>
    <PageHeading
      title={'Manuscripts'}
      action={<ActionButton>+</ActionButton>}
    />
    <Search />
    <Manuscripts manuscripts={manuscripts} />
  </React.Fragment>
)

export default ManuscriptsPage
