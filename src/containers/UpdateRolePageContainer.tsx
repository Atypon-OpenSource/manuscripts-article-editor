import React from 'react'
import {
  ManuscriptBlueButton,
  TransparentGreyButton,
} from '../components/Button'
import { StyledModal, totalTransitionTime } from '../components/StyledModal'
import { styled, ThemedProps } from '../theme'

interface Props {
  selectedRole: string
  handleUpdateRole: (selectedRole: string) => void
  handleCancel: () => void
  updating: boolean
}

type ThemedDivProps = ThemedProps<HTMLDivElement>

const ModalBody = styled.div`
  border-radius: ${(props: ThemedDivProps) => props.theme.radius}px;
  box-shadow: 0 4px 9px 0 #d8d8d8;
  background: #fff;
`

const MessageContainer = styled.div`
  max-width: 297px;
  min-height: 95px;
  font-family: Barlow;
  font-size: 16px;
  color: #949494;
  margin-top: 15px;
  margin-left: 20px;
`
const HeaderContainer = styled.div`
  font-family: Barlow;
  font-size: 16px;
  font-weight: 500;
  padding-left: 20px;
  padding-top: 15px;
`
const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
  padding-bottom: 10px;
`
class UpdateRolePageContainer extends React.Component<Props> {
  public render() {
    return (
      <StyledModal
        isOpen={this.props.updating}
        onRequestClose={this.props.handleCancel}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={true}
        closeTimeoutMS={totalTransitionTime}
      >
        <ModalBody>
          <HeaderContainer>Update collaborator role</HeaderContainer>
          <MessageContainer>
            Are you sure you want to update collaborator role?
          </MessageContainer>
          <ButtonsContainer>
            <ManuscriptBlueButton onClick={this.props.handleCancel}>
              Cancel
            </ManuscriptBlueButton>
            <TransparentGreyButton onClick={this.handleUpdate}>
              Update Role
            </TransparentGreyButton>
          </ButtonsContainer>
        </ModalBody>
      </StyledModal>
    )
  }

  private handleUpdate = () => {
    try {
      this.props.handleUpdateRole(this.props.selectedRole)
      this.props.handleCancel()
    } catch (error) {
      alert(error)
    }
  }
}

export default UpdateRolePageContainer
