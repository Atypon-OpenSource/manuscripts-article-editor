/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */

import licenses from '@manuscripts/data/dist/shared/licenses.json'
import { License, ObjectTypes } from '@manuscripts/manuscripts-json-schema'
import React, { useCallback, useMemo } from 'react'
import Select from 'react-select'
import { useSyncedData } from '../../hooks/use-synced-data'
import { selectStyles } from '../../lib/select-styles'

const options = licenses as License[]

const licensed = {
  _id: 'MPLicense:any',
  objectType: ObjectTypes.License,
  name: 'Licensed (Unspecified)',
}

options.unshift(licensed as License)

export const LicenseInput: React.FC<{
  value?: string
  handleChange: (value?: string) => void
}> = ({ value, handleChange }) => {
  const [currentValue, handleLocalChange] = useSyncedData<string | undefined>(
    value,
    handleChange,
    500
  )

  const selectedLicense = useMemo(() => {
    return currentValue
      ? options.find(license => license._id === currentValue)
      : undefined
  }, [currentValue, options])

  const handleInputChange = useCallback(
    (value: License) => {
      handleLocalChange(value ? value._id : undefined)
    },
    [handleLocalChange]
  )

  return (
    <Select<License>
      options={options}
      value={selectedLicense}
      getOptionValue={item => item._id}
      getOptionLabel={item => item.name || 'Untitled License'}
      onChange={handleInputChange}
      styles={selectStyles}
      isClearable={true}
    />
  )
}
