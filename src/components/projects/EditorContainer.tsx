import { styled } from '../../theme'

export const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 16px;
  overflow: hidden;
  padding-left: 30px;
`

export const EditorHeader = styled.div`
  width: 100%;
  padding: 5px 24px;
  background: white;
`

export const EditorBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
`
