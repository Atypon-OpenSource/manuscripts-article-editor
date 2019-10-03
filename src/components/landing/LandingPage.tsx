/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import AppIcon from '@manuscripts/assets/react/AppIcon'
import NavIconOutline from '@manuscripts/assets/react/NavIconOutline'
import { AlertMessage, AlertMessageType } from '@manuscripts/style-guide'
import Avatar, { AvatarStyle } from 'avataaars'
import React from 'react'
import MailchimpSubscribe from 'react-mailchimp-subscribe'
import { styled } from '../../theme/styled-components'
import { GlobalStyle } from '../../theme/theme'
import AuthButtonContainer from '../account/AuthButtonContainer'
import { Login, Signup } from '../account/Authentication'
import AddedTick from './AddedTick@2x.png'
import Collaboration from './Collaboration@2x.png'
import EditContent from './EditContent@2x.png'
import HexagonWithCode from './HexagonWithCode@2x.png'
import HexagonWithTeam from './HexagonWithTeam@2x.png'
import ImportExport from './ImportExport@2x.png'
import Navigation from './Navigation@2x.png'
import ReferenceManagement from './ReferenceManagement@2x.png'
import ScreenshotChrome from './ScreenshotChrome@2x.png'
import Styling from './Styling@2x.png'

const Header = styled.div`
  background-color: ${props => props.theme.colors.brand.dark};
`

const Title = styled.h1`
  font-family: ${props => props.theme.font.family.sans};
  font-size: 46px;
  font-weight: ${props => props.theme.font.weight.xlight};
  color: ${props => props.theme.colors.text.onDark};
  margin-top: 0;
  padding-top: 0;
  text-align: center;
  height: 47px;
  line-height: 0.76;
  padding-bottom: 0px;
  margin-bottom: 10px;
`

const Subtitle = styled.h2`
  font-family: ${props => props.theme.font.family.sans};
  font-size: ${props => props.theme.font.size.large};
  font-weight: ${props => props.theme.font.weight.normal};
  font-style: normal;
  font-stretch: normal;
  line-height: 1.39;
  letter-spacing: normal;
  text-align: center;
  color: ${props => props.theme.colors.text.onDark};
  max-width: 80%;
  padding-left: 20px;
  padding-right: 20px;
  margin: auto;
  width: 800px;

  & > div > input {
    margin-top: 15px;
    border: 1px solid grey;
    border-radius: ${props => props.theme.grid.radius.default};
    padding: 10px;
    font-family: ${props => props.theme.font.family.sans};
  }

  & > div > button {
    border-radius: ${props => props.theme.grid.radius.default};
    padding: 10px;
    font-family: ${props => props.theme.font.family.sans};
    font-size: ${props => props.theme.font.size.large};
    margin-left: 5px;
    margin-top: 2px;
    background-color: ${props => props.theme.colors.background.primary};
  }

  & a:link,
  & a:visited {
    color: ${props => props.theme.colors.text.onDark};
    font-weight: ${props => props.theme.font.weight.semibold};
  }
`

const BlackSubtitle = styled(Subtitle)`
  color: ${props => props.theme.colors.text.info};
`

const HeaderBar = styled.div`
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
`

const HeaderButtonGroup = styled.div`
  display: flex;
  align-items: center;
`

const Logotype = styled.div`
  color: ${props => props.theme.colors.text.onDark};
  font-weight: ${props => props.theme.font.weight.xlight};
  font-size: ${props => props.theme.font.size.xlarge};
  margin-left: -2px;
  padding-bottom: 3px;
`

const HeavyLink = styled.a`
  font-weight: ${props => props.theme.font.weight.medium};
  color: inherit;
  display: block;
  text-decoration: none;
`

const Link = styled.a`
  color: inherit;
  display: block;
  text-decoration: none;
`

const HeroImageContainer = styled.div`
  width: 100%;
  margin: auto;
  text-align: center;
  padding-bottom: 30px;
`

const ScreenshotCaptionContainer = styled(HeroImageContainer)`
  padding-top: 20px;
`

const OpennessHeadingContainer = styled(HeroImageContainer)``
const TeamHeadingContainer = styled(HeroImageContainer)``
const OpennessHeading = styled.h2`
  font-family: ${props => props.theme.font.family.sans};
  font-size: 32px;
  font-weight: ${props => props.theme.font.weight.semibold};
  font-style: normal;
  font-stretch: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: ${props => props.theme.colors.text.info};
  padding-top: 0px;
  margin-top: 10px;
  margin-bottom: 0px;
`

const ScreenshotCaption = styled(Subtitle)``
const OpennessCaption = styled(Subtitle)`
  max-width: 80%;
  width: 627px;
  margin: auto;
  font-family: ${props => props.theme.font.family.sans};
  font-size: ${props => props.theme.font.size.xlarge};
  font-weight: ${props => props.theme.font.weight.normal};
  font-style: normal;
  font-stretch: normal;
  line-height: 1.6;
  letter-spacing: normal;
  text-align: left;
  color: ${props => props.theme.colors.brand.default};
  padding-bottom: 0.5em;
`

const CenteredImageContainer = styled.div`
  display: flex;
  justify-content: center; /* align horizontal */
  align-items: center;
`

const Screenshot = styled.img`
  max-height: 80%;
  max-width: 1100px;
  width: 80%;
  margin: auto;
  padding-top: 10px;
`

const HighlightsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  grid-gap: 50px;
  max-width: 1000px;
  margin: auto;
`

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  grid-gap: 30px;
  max-width: 600px;
  margin: auto;
`

const HighlightsHeading = styled.h2`
  font-family: ${props => props.theme.font.family.sans};
  font-size: 46px;
  font-weight: ${props => props.theme.font.weight.xlight};
  font-style: normal;
  font-stretch: normal;
  line-height: 0.76;
  letter-spacing: -1.5px;
  text-align: center;
  padding-top: 0px;
  margin-top: 0px;
`

const HighlightsCaptionContainer = styled.div`
  font-family: ${props => props.theme.font.family.sans};
  font-style: normal;
  padding-bottom: 40px;
`
const HighlightsCaption = styled.div`
  text-align: left;
  margin: auto;
  max-width: 1000px;

  & a:link,
  & a:visited {
    color: ${props => props.theme.colors.text.info};
    font-weight: ${props => props.theme.font.weight.medium};
  }
`

const HighlightTitle = styled.h3`
  font-weight: ${props => props.theme.font.weight.medium};
  margin-top: 0px;
`

const Highlight = styled.div``
const HighlightList = styled.ul`
  margin-left: 18px;
  padding-left: 0px;
  margin-bottom: 0px;
  margin-top: 0px;
`
const HighlightListItem = styled.li`
  margin-left: 0px;
  padding-left: 0px;
`

const HighlightsSection = styled.div`
  background-color: ${props => props.theme.colors.background.fifth};
  padding-top: 40px;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 0px;
  padding-bottom: 40px;
  color: ${props => props.theme.colors.text.info};
`

const HighlightImage = styled.img`
  height: 28px;
  vertical-align: text-bottom;
  margin-bottom: -3px;
  margin-right: ${props => props.theme.grid.unit * 2}px;
`

const OpennessSection = styled.div`
  padding-top: 40px;
  padding-bottom: 40px;
`

const OpennessCTAList = styled.ul`
  padding-left: 20px;

  & a:link,
  & a:visited {
    color: ${props => props.theme.colors.text.primary};
    font-weight: ${props => props.theme.font.weight.normal};
  }

  & b {
    color: ${props => props.theme.colors.text.info};
  }
`

const TeamSection = styled.div`
  padding-top: 40px;
  padding-bottom: 40px;
  color: ${props => props.theme.colors.text.info};
  background-color: ${props => props.theme.colors.brand.dark};
`

const TeamHeading = styled.div`
  font-family: ${props => props.theme.font.family.sans};
  font-size: 32px;
  font-weight: ${props => props.theme.font.weight.semibold};
  font-style: normal;
  font-stretch: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: ${props => props.theme.colors.background.fifth};
`

const TeamMember = styled.div`
  font-family: ${props => props.theme.font.family.sans};
  text-align: center;
  width: 160px;
`

const Name = styled.div`
  font-size: ${props => props.theme.font.size.xlarge};
  font-weight: ${props => props.theme.font.weight.medium};
  font-style: normal;
  font-stretch: normal;
  line-height: 1.6;
  letter-spacing: normal;
  text-align: center;
  color: ${props => props.theme.colors.text.onDark};
`

const Role = styled.div`
  font-family: ${props => props.theme.font.family.sans};
  font-size: ${props => props.theme.font.size.normal};
  font-weight: ${props => props.theme.font.weight.normal};
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: ${props => props.theme.colors.text.onDark};
`

const Callsign = styled.div`
  font-size: ${props => props.theme.font.size.normal};
  font-weight: ${props => props.theme.font.weight.normal};
  font-style: normal;
  font-stretch: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: #7fb5d5;

  & a:link,
  & a:visited {
    color: #7fb5d5;
    font-weight: ${props => props.theme.font.weight.bold};
  }
`

/*
const Badge = styled.sup`
  background-color: ${props => props.theme.colors.text.info};
  border: 2px solid white;
  border-radius: 4px;
  padding: 2px;
  margin-left: 4px;
  vertical-align: baseline;
  position: relative;
  top: -1em;
  text-transform: uppercase;
`
const WhiteBadge = styled.sup`
  background-color: ${props => props.theme.colors.text.onDark};
  border: 2px solid ${props => props.theme.colors.text.info};
  border-radius: 4px;
  padding: 2px;
  padding-left: 6px;
  padding-right: 6px;
  margin-left: 4px;
  vertical-align: baseline;
  position: relative;
  top: -1em;
  text-transform: uppercase;
  font-size: 18pt;
`
*/

const AlphaTestPrompt = styled.div`
  font-family: ${props => props.theme.font.family.sans};
  font-size: ${props => props.theme.font.size.large};
  font-weight: ${props => props.theme.font.weight.normal};
  font-style: normal;
  font-stretch: normal;
  line-height: ${props => props.theme.font.lineHeight.large};
  letter-spacing: normal;
  text-align: center;
  background-color: ${props => props.theme.colors.background.primary};
  border: 2px solid ${props => props.theme.colors.brand.dark};
  border-radius: ${props => props.theme.grid.radius.default};
  max-width: 1000px;
  margin: auto;
  margin-top: ${props => props.theme.grid.unit * 10}px;
  padding: ${props => props.theme.grid.unit * 2}px;

  & a:link {
    color: ${props => props.theme.colors.brand.dark};
  }

  & a:visited {
    color: ${props => props.theme.colors.brand.dark};
  }
`

const Footer = styled.div`
  max-width: 65%;
  text-align: center;
  margin: auto;
  color: #7fb5d5;
  padding-top: ${props => props.theme.grid.unit * 10}px;
`

const LoginButton = styled.div`
  position: absolute;
  right: ${props => props.theme.grid.unit * 5}px;
  margin-top: ${props => props.theme.grid.unit * 7}px;
`
const avatarStyle = { width: 90, height: 90 }

// TODO: move this to a configuration value
const MAILCHIMP_URL =
  'https://manuscriptsapp.us9.list-manage.com/subscribe/post?u=51d661dd6ff88ac326a06ac8d&id=65b296c438'

const action = window.location.hash.substr(1)

const LandingPage: React.FunctionComponent = ({}) => (
  <>
    <GlobalStyle />
    <Header>
      {action === 'sign-out' && (
        <AlertMessage type={AlertMessageType.info}>
          You have been logged out.
        </AlertMessage>
      )}
      <HeaderBar>
        <HeaderButtonGroup>
          <NavIconOutline width={50} />{' '}
          <Logotype>
            <Link href={'/intro'}>MANUSCRIPTS.IO</Link>
          </Logotype>
        </HeaderButtonGroup>
        <HeaderButtonGroup>
          <AuthButtonContainer component={Signup} />
        </HeaderButtonGroup>
        <LoginButton>
          <AuthButtonContainer component={Login} />
        </LoginButton>
      </HeaderBar>
      <HeroImageContainer>
        <AppIcon />
      </HeroImageContainer>
      <Title>Welcome to Manuscripts.io</Title>
      <Subtitle>
        <div>
          Manuscripts is a simple, <i>open</i> writing tool for complex
          documents.
        </div>
        <div>
          Manuscripts.io is a follow-up to{' '}
          <a href="https://www.manuscriptsapp.com">Manuscripts.app</a>, rebuilt
          for collaboration.
        </div>
      </Subtitle>

      <CenteredImageContainer>
        <Screenshot src={ScreenshotChrome} />
      </CenteredImageContainer>

      <ScreenshotCaptionContainer>
        <img src={AddedTick} width={59} />
        <ScreenshotCaption>
          <b>
            One beautiful app for collaborative writing in real time, online and
            offline.
          </b>
        </ScreenshotCaption>
      </ScreenshotCaptionContainer>
    </Header>

    <OpennessSection>
      <OpennessHeadingContainer>
        <CenteredImageContainer>
          <img src={HexagonWithCode} width={63} />
        </CenteredImageContainer>
        <OpennessHeading>Manuscripts is free and open</OpennessHeading>
      </OpennessHeadingContainer>
      <OpennessCaption>
        We are building Manuscripts openly to forge a community. Research is
        increasingly free and open to build on – tools for research should be,
        too.
      </OpennessCaption>
      <OpennessCaption>
        Manuscripts is modular: it is a product made of a series of separable
        components that can also be used to extend or create other systems.
        <OpennessCTAList>
          <li>
            To try out the beta version, go to{' '}
            <a href="https://test.manuscripts.io">test.manuscripts.io</a>
            <br />(<b>WARNING!</b> This is a test environment.)
          </li>
          <li>
            For source code + issue trackers, visit{' '}
            <a
              target="_blank"
              href="https://gitlab.com/mpapp-public"
              rel={'noopener noreferrer'}
            >
              gitlab.com/mpapp-public
            </a>
          </li>
          {/*
          <li>
            To keep up to date with Manuscripts developments and to send us
            feedback, head over to{' '}
            <a href="https://community.manuscripts.io">
              community.manuscripts.io
            </a>
          </li>
          */}
          <li>
            To chat with the team, find us on{' '}
            <a
              target="_blank"
              href="https://manuscripts-friends-slack.herokuapp.com"
              rel={'noopener noreferrer'}
            >
              Slack
            </a>
          </li>
        </OpennessCTAList>
      </OpennessCaption>
    </OpennessSection>

    <HighlightsSection>
      <HighlightsHeading>What's coming</HighlightsHeading>

      <HighlightsCaptionContainer>
        <HighlightsCaption>
          Manuscripts.io is a next generation writing tool to follow up{' '}
          <a
            target="_blank"
            href="https://www.manuscriptsapp.com"
            rel={'noopener'}
          >
            Manuscripts.app (Manuscripts for Mac)
          </a>{' '}
          re-engineered to support collaboration, whilst still allowing for a
          fully offline workflow, with both web and native desktop app client
          applications in the works (with{' '}
          <a href="https://test.manuscripts.io">beta version</a> of the web
          client available).
        </HighlightsCaption>
      </HighlightsCaptionContainer>

      <HighlightsContainer>
        <Highlight>
          <HighlightTitle>
            <HighlightImage src={EditContent} />
            Write
          </HighlightTitle>
          <HighlightList>
            <HighlightListItem>
              Write collaboratively (or fully offline)
            </HighlightListItem>
            <HighlightListItem>
              Multi-panel figures and tables
            </HighlightListItem>
            <HighlightListItem>
              Equations and inline math with LaTeX support
            </HighlightListItem>
            <HighlightListItem>Cross-referencing</HighlightListItem>
            <HighlightListItem>Footnotes and endnotes</HighlightListItem>
            <HighlightListItem>
              Syntax highlighted code snippets
            </HighlightListItem>
            <HighlightListItem>
              Great menu and keyboard shortcuts
            </HighlightListItem>
          </HighlightList>
        </Highlight>
        <Highlight>
          <HighlightTitle>
            <HighlightImage src={ReferenceManagement} />
            Cite
          </HighlightTitle>
          <HighlightList>
            <HighlightListItem>
              Format citations and bibliographies automatically in over 8,000
              styles
            </HighlightListItem>
            <HighlightListItem>
              Search for and add citations easily from CrossRef, PubMed,
              DataCite, and more
            </HighlightListItem>
            <HighlightListItem>
              View and share references in a library across documents and
              projects
            </HighlightListItem>
          </HighlightList>
        </Highlight>
        <Highlight>
          <HighlightTitle>
            <HighlightImage src={ImportExport} />
            Import and export
          </HighlightTitle>
          <HighlightList>
            <HighlightListItem>
              Import from Markdown, MS Word, LaTeX
            </HighlightListItem>
            <HighlightListItem>
              Export to Markdown, MS Word, LaTeX, PDF, JATS XML
            </HighlightListItem>
            <HighlightListItem>
              Directly submit your manuscripts to hundreds of journals in one
              click
            </HighlightListItem>
            <HighlightListItem>
              HTML5 + JSON based document format with documentation and schema
              validation tools
            </HighlightListItem>
          </HighlightList>
        </Highlight>
        <Highlight>
          <HighlightTitle>
            <HighlightImage src={Styling} />
            Style
          </HighlightTitle>
          <HighlightList>
            <HighlightListItem>
              Strong style system for paragraphs, figures, tables, equations,
              with styles reflected in export formats as diverse as DOCX and
              LaTeX
            </HighlightListItem>
            <HighlightListItem>
              Document templates that amount to "computer readable journal
              guidelines", with styles and automatically enforceable content
              requirements
            </HighlightListItem>
          </HighlightList>
        </Highlight>
        {/*
        <Highlight>
          <HighlightTitle>
            <HighlightImage src={Annotations} />
            Annotations
          </HighlightTitle>
          <HighlightList>
            <HighlightListItem>
              Annotate paragraphs, figures, tables, equations, code listings and
              citations.
            </HighlightListItem>
            <HighlightListItem>
              Include quotes in annotation comments.
            </HighlightListItem>
            <HighlightListItem>
              Mention keywords with #hashtags in annotation contents.
            </HighlightListItem>
            <HighlightListItem>
              Mention contributors with @mentiosn in annotation contents
            </HighlightListItem>
          </HighlightList>
        </Highlight>
        */}
        <Highlight>
          <HighlightTitle>
            <HighlightImage src={Navigation} />
            Navigate
          </HighlightTitle>
          <HighlightList>
            <HighlightListItem>
              Navigate and manipulate document structure using an outline
            </HighlightListItem>
            <HighlightListItem>
              Smart gutter: shortcuts for fast access to essential actions
            </HighlightListItem>
          </HighlightList>
        </Highlight>
        <Highlight>
          <HighlightTitle>
            <HighlightImage src={Collaboration} />
            Collaborate
          </HighlightTitle>
          <HighlightList>
            <HighlightListItem>
              Share documents using links (read-write and read-only)
            </HighlightListItem>
            <HighlightListItem>
              Invite collaborators and manage their roles
            </HighlightListItem>
            <HighlightListItem>
              Collaboratively format author lists with contributions and
              affiliations
            </HighlightListItem>
          </HighlightList>
        </Highlight>
      </HighlightsContainer>
      <AlphaTestPrompt>
        To try out the Manuscripts.io beta{' '}
        <b>
          go to <a href="https://test.manuscripts.io">test.manuscripts.io</a>
        </b>
        .<br /> <b>This is a development environment</b> – please do{' '}
        <b>
          <i>NOT</i>
        </b>{' '}
        write anything you do not expect to lose!
        <BlackSubtitle>
          Stay up to date on the latest developments by signing up for our
          newsletter.
          <MailchimpSubscribe url={MAILCHIMP_URL} />
        </BlackSubtitle>
      </AlphaTestPrompt>
    </HighlightsSection>

    <TeamSection>
      <TeamHeadingContainer>
        <CenteredImageContainer>
          <img src={HexagonWithTeam} width={63} />
        </CenteredImageContainer>
        <TeamHeading>Meet the team</TeamHeading>
      </TeamHeadingContainer>

      <TeamGrid>
        <TeamMember>
          <Avatar
            style={avatarStyle}
            avatarStyle={AvatarStyle.Circle}
            topType="ShortHairTheCaesar"
            accessoriesType="Blank"
            hairColor="Blonde"
            facialHairType="BeardMedium"
            facialHairColor="Blonde"
            clotheType="BlazerShirt"
            eyeType="Surprised"
            eyebrowType="RaisedExcited"
            mouthType="Default"
            skinColor="Light"
          />
          <Name>Matias Piipari</Name>
          <Role>
            Senior Product Director
            <br />
            (Chief Moog Operator)
          </Role>
          <Callsign>
            <a
              target="_blank"
              href="https://twitter.com/mz2"
              rel={'noopener noreferrer'}
            >
              @mz2
            </a>
          </Callsign>
        </TeamMember>

        <TeamMember>
          <Avatar
            style={avatarStyle}
            avatarStyle="Circle"
            topType="LongHairBun"
            accessoriesType="Blank"
            hairColor="BrownDark"
            facialHairType="Blank"
            clotheType="BlazerShirt"
            eyeType="Squint"
            eyebrowType="DefaultNatural"
            mouthType="Default"
            skinColor="Tanned"
          />
          <Name>Alberto Pepe</Name>
          <Role>
            Product Director
            <br />
            (Spiritual Warrior)
          </Role>
          <Callsign>
            <a
              target="_blank"
              href="https://twitter.com/albertopepe"
              rel={'noopener noreferrer'}
            >
              @albertopepe
            </a>
          </Callsign>
        </TeamMember>

        <TeamMember>
          <Avatar
            style={avatarStyle}
            avatarStyle="Circle"
            topType="ShortHairDreads01"
            accessoriesType="Blank"
            hairColor="Blonde"
            facialHairType="BeardLight"
            facialHairColor="Blonde"
            clotheType="ShirtVNeck"
            eyeType="Wink"
            eyebrowType="RaisedExcited"
            mouthType="Serious"
            skinColor="Light"
          />
          <Name>Alf Eaton</Name>
          <Role>Senior Software Engineer</Role>
          <Callsign>
            <a
              target="_blank"
              href="https://twitter.com/invisiblecomma"
              rel={'noopener noreferrer'}
            >
              @invisiblecomma
            </a>
          </Callsign>
        </TeamMember>

        <TeamMember>
          <Avatar
            style={avatarStyle}
            avatarStyle="Circle"
            topType="Hijab"
            accessoriesType="Blank"
            clotheType="CollarSweater"
            clotheColor="Gray01"
            eyeType="Happy"
            eyebrowType="DefaultNatural"
            mouthType="Smile"
            skinColor="Light"
          />
          <Name>Islam Momani</Name>
          <Role>Software Engineer</Role>
          <Callsign>
            <a
              target="_blank"
              href="https://gitlab.com/Islamjmomani"
              rel={'noopener noreferrer'}
            >
              @IslamJMomani
            </a>
          </Callsign>
        </TeamMember>

        <TeamMember>
          <Avatar
            style={avatarStyle}
            avatarStyle="Circle"
            topType="ShortHairShortCurly"
            accessoriesType="Blank"
            hairColor="Brown"
            facialHairType="Blank"
            clotheType="ShirtCrewNeck"
            clotheColor="PastelGreen"
            eyeType="Side"
            eyebrowType="UnibrowNatural"
            mouthType="Smile"
            skinColor="Brown"
          />
          <Name>Will Bartlett</Name>
          <Role>Software Engineer</Role>
          <Callsign>
            <a
              target="_blank"
              href="https://github.com/will118"
              rel={'noopener noreferrer'}
            >
              @will118
            </a>
          </Callsign>
        </TeamMember>

        <TeamMember>
          <Avatar
            style={avatarStyle}
            avatarStyle="Circle"
            topType="ShortHairShortRound"
            accessoriesType="Blank"
            hairColor="Black"
            facialHairType="BeardLight"
            facialHairColor="Black"
            clotheType="Hoodie"
            clotheColor="Black"
            eyeType="Hearts"
            eyebrowType="DefaultNatural"
            mouthType="Smile"
            skinColor="Light"
          />
          <Name>Bader Al-Hamdan</Name>
          <Role>Software Engineer</Role>
          <Callsign>
            <a
              target="_blank"
              href="https://gitlab.com/BaderAlhamdan"
              rel={'noopener noreferrer'}
            >
              @baderalhamdan
            </a>
          </Callsign>
        </TeamMember>

        <TeamMember>
          <Avatar
            style={avatarStyle}
            avatarStyle="Circle"
            topType="ShortHairShortFlat"
            accessoriesType="Blank"
            hairColor="Blonde"
            facialHairType="BeardLight"
            facialHairColor="Blonde"
            clotheType="Hoodie"
            clotheColor="Heather"
            eyeType="Happy"
            eyebrowType="DefaultNatural"
            mouthType="Default"
            skinColor="Pale"
          />
          <Name>Dan Browne</Name>
          <Role>Software Engineer</Role>
          <Callsign>
            <a
              target="_blank"
              href="https://github.com/danielrbrowne"
              rel={'noopener noreferrer'}
            >
              @danielrbrowne
            </a>
          </Callsign>
        </TeamMember>
        <TeamMember>
          <Avatar
            style={avatarStyle}
            avatarStyle="Circle"
            topType="ShortHairShortWaved"
            accessoriesType="Blank"
            hairColor="Brown"
            facialHairType="BeardLight"
            facialHairColor="Brown"
            clotheType="CollarSweater"
            clotheColor="Heather"
            eyeType="Wink"
            eyebrowType="FlatNatural"
            mouthType="Default"
            skinColor="Light"
          />
          <Name>Yannis Saniotis</Name>
          <Role>Director of Product Design</Role>
        </TeamMember>
      </TeamGrid>
      <Footer>
        <div>Copyright © 2019 Atypon Systems, LLC.</div>
        <div>
          <HeavyLink href={'https://www.atypon.com/privacy-policy/'}>
            Privacy policy
          </HeavyLink>
        </div>
      </Footer>
    </TeamSection>
  </>
)

export default LandingPage
