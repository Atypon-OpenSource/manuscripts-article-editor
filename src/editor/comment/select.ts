import { CSSProperties } from 'react'

export const plainStyles = {
  control: (base: CSSProperties): CSSProperties => ({
    ...base,
    border: 'none',
    background: 'none',
    outline: 'none',
    boxShadow: 'none',
    minHeight: 0,
  }),
  dropdownIndicator: (): CSSProperties => ({
    display: 'none',
  }),
  indicatorSeparator: (): CSSProperties => ({
    display: 'none',
  }),
  input: () => ({
    width: 1,
  }),
  menu: (base: CSSProperties): CSSProperties => ({
    ...base,
    width: 'auto',
    fontFamily: 'Barlow, sans-serif',
  }),
  option: (base: CSSProperties): CSSProperties => ({
    ...base,
    padding: '8px 16px',
    whiteSpace: 'nowrap',
    overflow: 'visible',
    textOverflow: 'ellipsis',
    minWidth: 200,
    maxWidth: 500,
    width: 200,
  }),
  singleValue: (base: CSSProperties): CSSProperties => ({
    ...base,
    overflow: 'visible',
    width: 'auto',
    position: 'relative',
    transform: 'none',
    marginLeft: 0,
    marginRight: 0,
    color: '#617ba8',
  }),
  valueContainer: (base: CSSProperties): CSSProperties => ({
    ...base,
    padding: 0,
  }),
}
