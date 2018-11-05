import NotFound from '@manuscripts/assets/react/NotFound'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import styled from 'styled-components'

const FullSizeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  text-align: center;
  font-family: ${props => props.theme.fontFamily};
`

const Message = styled.div`
  margin: 10px;
  flex-shrink: 0;
`

const Heading = styled.p`
  font-size: 150%;
  font-weight: bold;
`

const NotFoundPath = styled.span`
  font-weight: 600;
`

const NotFoundPage = (props: RouteComponentProps) => (
  <FullSizeContainer>
    <NotFound />

    <Message>
      <Heading>This is probably not what you were looking for.</Heading>
      <p>
        Nothing found at <NotFoundPath>{props.location.pathname}</NotFoundPath>
      </p>
    </Message>
  </FullSizeContainer>
)

export default NotFoundPage
