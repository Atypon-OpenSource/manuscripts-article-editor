/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import AppIcon from '@manuscripts/assets/react/AppIcon'
import NavIconOutline from '@manuscripts/assets/react/NavIconOutline'
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
  background-color: #2a6f9d;
`

const Title = styled.h1`
  font-family: Barlow, sans-serif;
  font-size: 46px;
  font-weight: 300;
  color: white;
  margin-top: 0;
  padding-top: 0;
  text-align: center;
  height: 47px;
  line-height: 0.76;
  padding-bottom: 0px;
  margin-bottom: 40px;
`

const Subtitle = styled.h2`
  font-family: Barlow, sans-serif;
  font-size: 18px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.39;
  letter-spacing: normal;
  text-align: center;
  color: white;
  max-width: 80%;
  padding-left: 20px;
  padding-right: 20px;
  margin: auto;
  margin-top: 10px;
  width: 800px;

  & > div > input {
    margin-top: 15px;
    border: 1px solid grey;
    border-radius: 5px;
    padding: 10px;
    font-family: Barlow, sans-serif;
    font-size: 18px;
  }

  & > div > button {
    border-radius: 5px;
    padding: 10px;
    font-family: Barlow, sans-serif;
    font-size: 18px;
    margin-left: 5px;
    margin-top: 2px;
    background-color: white;
  }

  & a:link,
  & a:visited {
    color: white;
    font-weight: 600;
  }
`

const BlackSubtitle = styled(Subtitle)`
  color: #2a6f9d;
`

const NewsletterSignupSubtitle = styled(BlackSubtitle)`
  font-size: 22px;
  margin-top: 0px;
  text-align: center;
  margin: auto;
  padding: 0;
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
  color: white;
  font-weight: 200;
  font-size: 20px;
  margin-left: -2px;
  padding-bottom: 3px;
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
  font-family: Barlow, sans-serif;
  font-size: 32px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: #2a6f9d;
  padding-top: 0px;
  margin-top: 10px;
  margin-bottom: 0px;
`

const ScreenshotCaption = styled(Subtitle)``
const OpennessCaption = styled(Subtitle)`
  max-width: 80%;
  width: 627px;
  margin: auto;
  font-family: Barlow, sans-serif;
  font-size: 20px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.6;
  letter-spacing: normal;
  text-align: left;
  color: var(--mid-blue);
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
  font-family: Barlow, sans-serif;
  font-size: 46px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: 0.76;
  letter-spacing: -1.5px;
  text-align: center;
  padding-top: 0px;
  margin-top: 0px;
`

const HighlightsCaptionContainer = styled.div`
  font-family: Barlow, sans-serif;
  font-style: normal;
  padding-bottom: 40px;
`
const HighlightsCaption = styled.div`
  text-align: left;
  margin: auto;
  max-width: 1000px;

  & a:link,
  & a:visited {
    color: #2a6f9d;
    font-weight: 500;
  }
`

const HighlightTitle = styled.h3`
  font-weight: 500;
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
  background-color: #d8edf8;
  padding-top: 40px;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 0px;
  padding-bottom: 40px;
  color: #2a6f9d;
`

const HighlightImage = styled.img`
  height: 28px;
  vertical-align: text-bottom;
  margin-bottom: -3px;
  margin-right: 8px;
`

const OpennessSection = styled.div`
  padding-top: 40px;
  padding-bottom: 40px;
`

const OpennessCTAList = styled.ul`
  padding-left: 20px;

  & a:link,
  & a:visited {
    color: black;
    font-weight: 400;
  }

  & b {
    color: #2a6f9d;
  }
`

const TeamSection = styled.div`
  padding-top: 40px;
  padding-bottom: 40px;
  color: #2a6f9d;
  background-color: #2a6f9d;
`

const TeamHeading = styled.div`
  font-family: Barlow, sans-serif;
  font-size: 32px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: #d8edf8;
`

const TeamMember = styled.div`
  font-family: Barlow, sans-serif;
  text-align: center;
  width: 160px;
`

const Name = styled.div`
  font-size: 20px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.6;
  letter-spacing: normal;
  text-align: center;
  color: white;
`

const Role = styled.div`
  font-family: Barlow, sans-serif;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: white;
`

const Callsign = styled.div`
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: #7fb5d5;

  & a:link,
  & a:visited {
    color: #7fb5d5;
    font-weight: bold;
  }
`

/*
const Badge = styled.sup`
  background-color: #2a6f9d;
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
  background-color: white;
  border: 2px solid #2a6f9d;
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
  font-family: Barlow, sans-serif;
  font-size: 18px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.39;
  letter-spacing: normal;
  text-align: center;
  background-color: white;
  border: 2px solid #2a6f9d;
  border-radius: 6px;
  max-width: 1000px;
  margin: auto;
  margin-top: 40px;
  padding: 10px;

  & a:link {
    color: #2a6f9d;
  }

  & a:visited {
    color: #2a6f9d;
  }
`

const NewsletterSignupPrompt = styled(AlphaTestPrompt)`
  margin-top: 30px;
  margin-bottom: 20px;
  border-color: #d8edf8;
  width: 395px;
  padding-left: 0;
  padding-right: 0;

  @media only screen and (max-width: 600px) {
    border-radius: 0px;
    border-left: none;
    border-right: none;
    padding-left: 0px;
    padding-right: 0px;
    width: 100%;
  }
`

const Footer = styled.div`
  max-width: 65%;
  text-align: center;
  margin: auto;
  color: #7fb5d5;
  padding-top: 40px;
`

const LoginButton = styled.div`
  position: absolute;
  right: 20px;
  margin-top: 30px;
`
const avatarStyle = { width: 90, height: 90 }

// TODO: move this to a configuration value
const MAILCHIMP_URL =
  'https://manuscriptsapp.us9.list-manage.com/subscribe/post?u=51d661dd6ff88ac326a06ac8d&id=65b296c438'

const LandingPage: React.FunctionComponent = ({}) => (
  <>
    <GlobalStyle />
    <Header>
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
          We are building a simple, <i>open</i> writing tool for complex
          documents.
        </div>
        <div>
          Manuscripts.io is a follow-up to{' '}
          <a href="https://www.manuscriptsapp.com">Manuscripts.app</a>, rebuilt
          for collaboration.
        </div>
      </Subtitle>

      <NewsletterSignupPrompt>
        <NewsletterSignupSubtitle>
          Sign up to learn more.
          <MailchimpSubscribe url={MAILCHIMP_URL} />
        </NewsletterSignupSubtitle>
      </NewsletterSignupPrompt>

      <CenteredImageContainer>
        <Screenshot src={ScreenshotChrome} />
      </CenteredImageContainer>

      <ScreenshotCaptionContainer>
        <img src={AddedTick} width={59} />
        <ScreenshotCaption>
          <b>COMING SOON</b>
          <br />
          One beautiful app for collaborating in real time, online and offline.
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
      </Footer>
    </TeamSection>
  </>
)

export default LandingPage
