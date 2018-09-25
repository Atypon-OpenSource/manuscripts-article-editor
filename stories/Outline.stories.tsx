import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import {
  Outline,
  OutlineDropPreview,
  OutlineItem,
  OutlineItemArrow,
  OutlineItemIcon,
  OutlineItemLink,
  OutlineItemLinkText,
  OutlineItemNoArrow,
} from '../src/components/Outline'
import { OutlineManuscript } from '../src/containers/OutlineManuscript'
import { nodeTypeIcon } from '../src/transformer/node-type-icons'
import { manuscript } from './data/manuscripts'
import { project } from './data/projects'

storiesOf('Outline', module)
  .add('Outline', () => (
    <Outline>
      <OutlineItem isSelected={false}>
        <OutlineItemArrow onClick={action('toggle')}>▼</OutlineItemArrow>
        <OutlineItemLink to={'#'}>
          <OutlineItemIcon>{nodeTypeIcon('figure')}</OutlineItemIcon>

          <OutlineItemLinkText className={`outline-text-figure`}>
            Figure
          </OutlineItemLinkText>
        </OutlineItemLink>
      </OutlineItem>
      <div>
        <div>
          <OutlineItem isSelected={true}>
            <OutlineItemNoArrow />
            <OutlineItemLink to={'#'}>
              <OutlineItemIcon>{nodeTypeIcon('figure')}</OutlineItemIcon>

              <OutlineItemLinkText className={`outline-text-figure`}>
                Figure
              </OutlineItemLinkText>
            </OutlineItemLink>
          </OutlineItem>
        </div>
      </div>
    </Outline>
  ))
  .add('Unselected item', () => (
    <OutlineItem isSelected={false}>
      <OutlineItemArrow onClick={action('toggle')}>▼</OutlineItemArrow>
      <OutlineItemLink to={'#'}>
        <OutlineItemIcon>{nodeTypeIcon('figure')}</OutlineItemIcon>

        <OutlineItemLinkText className={`outline-text-figure`}>
          Figure
        </OutlineItemLinkText>
      </OutlineItemLink>
    </OutlineItem>
  ))
  .add('Selected item', () => (
    <OutlineItem isSelected={true}>
      <OutlineItemNoArrow />
      <OutlineItemLink to={'#'}>
        <OutlineItemIcon>{nodeTypeIcon('figure')}</OutlineItemIcon>

        <OutlineItemLinkText className={`outline-text-figure`}>
          Figure
        </OutlineItemLinkText>
      </OutlineItemLink>
    </OutlineItem>
  ))
  .add('Collapsed manuscript', () => (
    <OutlineManuscript manuscript={manuscript} project={project} />
  ))
  .add('Drop preview', () => <OutlineDropPreview />)
