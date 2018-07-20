import React from 'react'
import { CloseButton } from '../../components/SimpleModal'
import { StyledModal, totalTransitionTime } from '../../components/StyledModal'
import Close from '../../icons/close'
import Expander from '../../icons/expander'
import { styled, ThemedProps } from '../../theme'
import { Affiliation, Contributor, Manuscript } from '../../types/components'
import { Affiliations } from './Affiliations'
import { AuthorAffiliation } from './Author'
import { AuthorForm, AuthorValues } from './AuthorForm'
import Authors from './Authors'
import AuthorsSidebar from './AuthorsSidebar'
import { Header, HeaderContainer } from './Header'
import { AffiliationMap } from './lib/authors'
import { StyledTitleField } from './TitleField'

type ThemedDivProps = ThemedProps<HTMLDivElement>

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${(props: ThemedDivProps) => props.theme.fontFamily};
  width: 800px;
  max-width: 100%;
  margin: auto;
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 8px;
`

const ModalBody = styled.div`
  flex: 1;
  display: flex;
  border-radius: ${(props: ThemedDivProps) => props.theme.radius}px;
  box-shadow: 0 4px 9px 0 #d8d8d8;
  background: #fff;
`

const ModalSidebar = styled.div`
  width: 300px;
  height: 70vh;
  overflow: hidden;
`

const ModalMain = styled.div`
  flex: 1;
  height: 70vh;
  overflow-y: auto;
`

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
`

const AuthorsContainer = styled.div`
  margin-top: 16px;
`

const ExpanderButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`

interface Props {
  saveTitle: (title: string) => void
  manuscript: Manuscript
  authors: Contributor[]
  authorAffiliations: Map<string, AuthorAffiliation[]>
  affiliations: AffiliationMap
  startEditing: () => void
  editing: boolean
  stopEditing: () => void
  createAuthor: (priority: number) => void
  removeAuthor: (data: Contributor) => void
  selectAuthor: (data: Contributor) => void
  selectedAuthor: Contributor | null
  handleSaveAuthor: (values: AuthorValues) => Promise<void>
  createAffiliation: (name: string) => Promise<Affiliation>
  expanded: boolean
  toggleExpanded: () => void
}

export const Metadata: React.SFC<Props> = ({
  saveTitle,
  manuscript,
  authors,
  authorAffiliations,
  affiliations,
  startEditing,
  editing,
  stopEditing,
  createAuthor,
  removeAuthor,
  selectAuthor,
  selectedAuthor,
  handleSaveAuthor,
  createAffiliation,
  expanded,
  toggleExpanded,
}) => (
  <HeaderContainer>
    <Header>
      <TitleContainer>
        <StyledTitleField
          id={'manuscript-title-field'}
          value={manuscript.title}
          autoFocus={!manuscript.title}
          handleChange={saveTitle}
        />
        <ExpanderButton
          onClick={toggleExpanded}
          style={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <Expander />
        </ExpanderButton>
      </TitleContainer>

      {expanded && (
        <AuthorsContainer>
          <Authors
            authors={authors}
            authorAffiliations={authorAffiliations}
            startEditing={startEditing}
          />

          <Affiliations affiliations={affiliations} />
        </AuthorsContainer>
      )}

      <StyledModal
        isOpen={editing}
        onRequestClose={stopEditing}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={true}
        closeTimeoutMS={totalTransitionTime}
      >
        <ModalContainer>
          <ModalHeader>
            <CloseButton onClick={stopEditing}>
              <Close size={24} />
            </CloseButton>
          </ModalHeader>

          <ModalBody>
            <ModalSidebar>
              <AuthorsSidebar
                authors={authors}
                authorAffiliations={authorAffiliations}
                createAuthor={createAuthor}
                removeAuthor={removeAuthor}
                selectAuthor={selectAuthor}
                selectedAuthor={selectedAuthor}
              />
            </ModalSidebar>

            <ModalMain>
              {selectedAuthor && (
                <AuthorForm
                  manuscript={manuscript.id}
                  author={selectedAuthor}
                  affiliations={affiliations}
                  authorAffiliations={
                    authorAffiliations.get(
                      selectedAuthor.id
                    ) as AuthorAffiliation[]
                  }
                  handleSave={handleSaveAuthor}
                  createAffiliation={createAffiliation}
                />
              )}
            </ModalMain>
          </ModalBody>
        </ModalContainer>
      </StyledModal>
    </Header>
  </HeaderContainer>
)
