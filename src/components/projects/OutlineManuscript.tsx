import OutlineIconManuscript from '@manuscripts/assets/react/OutlineIconManuscript'
import * as React from 'react'
import { titleText } from '../../editor/lib/text'
import { nodeTitlePlaceholder } from '../../transformer/node-title'
import { Manuscript, Project } from '../../types/components'
import {
  Outline,
  OutlineItem,
  OutlineItemArrow,
  OutlineItemIcon,
  OutlineItemLink,
  OutlineItemLinkText,
  OutlineItemPlaceholder,
} from './Outline'

interface Props {
  project: Project
  manuscript: Manuscript
}

export const OutlineManuscript: React.SFC<Props> = ({
  project,
  manuscript,
}) => (
  <Outline>
    <OutlineItem isSelected={false}>
      <OutlineItemLink
        to={`/projects/${project.id}/manuscripts/${manuscript.id}`}
      >
        <OutlineItemArrow>▶</OutlineItemArrow>

        <OutlineItemIcon>
          <OutlineIconManuscript />
        </OutlineItemIcon>

        <OutlineItemLinkText className={'outline-text-doc'}>
          {manuscript.title ? (
            titleText(manuscript.title)
          ) : (
            <OutlineItemPlaceholder>
              {nodeTitlePlaceholder('doc')}
            </OutlineItemPlaceholder>
          )}
        </OutlineItemLinkText>
      </OutlineItemLink>
    </OutlineItem>
  </Outline>
)
