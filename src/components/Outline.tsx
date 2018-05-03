import { styled } from '../theme'

export const Outline = styled.div`
  font-size: 14px;
  position: relative;

  & > div > div {
    padding-left: 16px;
  }
`

export const OutlineItemIcon = styled.span`
  display: inline-flex;
  width: 1.2em;
  background: linear-gradient(to bottom, #8bbbff 0%, #65a3ff 100%);
  color: #fff;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  font-size: 9px;
  padding: 1px;
  flex-shrink: 0;
`

export const OutlineItem = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  box-sizing: border-box;
  overflow-x: hidden;
  cursor: pointer;
  color: #444;

  &:hover ${OutlineItemIcon} {
    background: linear-gradient(to bottom, #617ba8 0%, #4966a8 100%);
  }
`

export const OutlineItemArrow = styled.button`
  display: inline-block;
  color: #777;
  cursor: pointer;
  border: none;
  background: transparent;
  padding: 0 8px;
  flex-shrink: 0;

  &:hover {
    color: #000;
  }

  &:focus {
    outline: none;
  }
`

export const OutlineItemNoArrow = styled.span`
  display: inline-block;
  width: 26px;
  flex-shrink: 0;
`

export const OutlineDropPreview = styled.div`
  width: 100%;
  background: #65a3ff;
  height: 1px;
  position: absolute;
  margin-left: 42px;

  &:before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 5px;
    border: 1px solid #65a3ff;
    border-radius: 6px;
    position: absolute;
    top: -3px;
    left: -6px;
  }
`

export const OutlineItemLink = styled.a`
  flex: 1;
  display: inline-flex;
  align-items: center;
  overflow-x: hidden;
  color: inherit;
  text-decoration: none;
  padding: 1px 0;
  height: 100%;

  &:focus,
  &:active {
    outline: none;
  }
`

export const OutlineItemLinkText = styled.span`
  flex: 1;
  display: inline-block;
  overflow-x: hidden;
  text-overflow: ellipsis;
  margin-left: 8px;
`
