import React from 'react'
import { RouteComponentProps } from 'react-router'
import styled from 'styled-components'

const FullSizeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const CenteredArtwork = styled.svg`
  display: block;
  margin: auto;
`

const Message = styled.div`
  display: table;
  margin: auto;
  text-align: center;
`

const NotFoundPath = styled.span`
  font-weight: 600;
`

const NotFound = (props: RouteComponentProps) => (
  <FullSizeContainer>
    <CenteredArtwork width={395} height={302} {...props}>
      <title>{`404`}</title>
      <defs>
        <linearGradient x1="48.514%" y1="167.953%" x2="50%" y2="100%" id="a">
          <stop stopColor="#C8C8C8" offset="0%" />
          <stop stopColor="#979797" offset="100%" />
        </linearGradient>
        <linearGradient x1="100%" y1="89.009%" x2="100%" y2="50%" id="b">
          <stop stopColor="#C8C8C8" stopOpacity={0} offset="0%" />
          <stop stopColor="#979797" offset="100%" />
        </linearGradient>
        <linearGradient x1="100%" y1="100%" x2="100%" y2="50%" id="c">
          <stop stopColor="#C8C8C8" stopOpacity={0} offset="21.981%" />
          <stop stopColor="#979797" offset="100%" />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <g transform="translate(17)">
          <path
            d="M196.73 9.981l94.19 54.347a37 37 0 0 1 18.509 32.048v108.653a37 37 0 0 1-18.51 32.048l-94.19 54.346a37 37 0 0 1-36.982 0l-94.19-54.346a37 37 0 0 1-18.51-32.048V96.376a37 37 0 0 1 18.51-32.048l94.19-54.347a37 37 0 0 1 36.982 0z"
            fill="#EFF4F4"
            opacity={0.599}
          />
          <rect
            fill="#D5E7E9"
            x={288.619}
            y={184.455}
            width={54.286}
            height={2.713}
            rx={1.356}
          />
          <rect
            fill="#D5E7E9"
            x={351.952}
            y={184.455}
            width={9.048}
            height={2.713}
            rx={1.356}
          />
          <rect
            fill="#D5E7E9"
            x={16.286}
            y={195.305}
            width={45.238}
            height={2.713}
            rx={1.356}
          />
          <rect
            fill="#D5E7E9"
            y={195.305}
            width={7.238}
            height={2.713}
            rx={1.356}
          />
          <rect
            fill="#E2F0F2"
            x={258.762}
            y={114.832}
            width={18.095}
            height={2.713}
            rx={1.356}
          />
          <rect
            fill="#D5E7E9"
            x={57}
            y={52.443}
            width={45.238}
            height={2.713}
            rx={1.356}
          />
        </g>
        <g transform="translate(74 67)" strokeWidth={3}>
          <ellipse stroke="url(#a)" cx={124.5} cy={56.5} rx={115.5} ry={56.5} />
          <ellipse stroke="url(#a)" cx={123} cy={65.5} rx={86} ry={41.5} />
          <ellipse
            strokeOpacity={0.853}
            stroke="#979797"
            cx={123}
            cy={87}
            rx={67}
            ry={32}
          />
          <ellipse stroke="url(#a)" cx={123.5} cy={99} rx={41.5} ry={21} />
          <ellipse
            strokeOpacity={0.754}
            stroke="#979797"
            cx={123.5}
            cy={110}
            rx={41.5}
            ry={21}
          />
          <ellipse
            strokeOpacity={0.7}
            stroke="#979797"
            cx={123.5}
            cy={129.5}
            rx={30.5}
            ry={15.5}
          />
          <ellipse
            strokeOpacity={0.732}
            stroke="#979797"
            cx={124}
            cy={150}
            rx={18}
            ry={9}
          />
          <ellipse
            strokeOpacity={0.573}
            stroke="#979797"
            cx={123.5}
            cy={164}
            rx={12.5}
            ry={6}
          />
          <ellipse
            strokeOpacity={0.52}
            stroke="#979797"
            cx={124}
            cy={177}
            rx={9}
            ry={4}
          />
          <ellipse
            strokeOpacity={0.5}
            stroke="#979797"
            cx={124}
            cy={191.5}
            rx={5}
            ry={2.5}
          />
          <ellipse
            strokeOpacity={0.401}
            stroke="#979797"
            cx={123.5}
            cy={200.5}
            rx={2.5}
            ry={1.5}
          />
          <path
            d="M48 3c6.323 2.76 12.086 6.09 17.288 9.989 22.076 16.544 38.592 43.105 45.483 64.47 12.383 38.394 16.684 83.575 12.902 135.541"
            stroke="url(#b)"
          />
          <path
            d="M0 47c26.466.08 44.877 3.93 55.234 11.547C101.078 92.267 124 143.752 124 213"
            stroke="url(#c)"
          />
          <path
            d="M123 4c5.618 2.596 10.777 5.66 15.477 9.19 22.006 16.527 38.47 43.062 45.339 64.405 12.344 38.356 16.63 83.49 12.861 135.405"
            stroke="url(#c)"
            transform="matrix(-1 0 0 1 321 0)"
          />
          <path
            d="M125 47.003c27.128-.119 45.916 3.73 56.367 11.545C226.456 92.268 249 143.752 249 213"
            stroke="url(#c)"
            transform="matrix(-1 0 0 1 374 0)"
          />
        </g>
      </g>
    </CenteredArtwork>
    <Message>
      <h2>This is probably not what you were looking for.</h2>
      <p>
        Nothing found at <NotFoundPath>{props.location.pathname}</NotFoundPath>
      </p>
    </Message>
  </FullSizeContainer>
)

export default NotFound
