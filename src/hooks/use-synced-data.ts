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

import { debounce } from 'lodash-es'
import { useCallback, useEffect, useRef, useState } from 'react'

export const useSyncedData = <T extends unknown>(
  propValue: T,
  handleChange: (value: T) => void,
  wait: number = 1000
): [T, (value: T) => void, (focused: boolean) => void] => {
  const [value, setValue] = useState<T>(propValue)
  const [editing, setEditing] = useState<boolean>(false)

  const propValueString = JSON.stringify(propValue)
  const previousPropValueString = useRef<string>(propValueString)

  // update the value from the prop if it has changed and the input isn't focused
  useEffect(() => {
    if (propValueString !== previousPropValueString.current) {
      previousPropValueString.current = propValueString

      if (!editing) {
        setValue(propValue)
      }
    }
  }, [previousPropValueString, propValueString])

  // update the value from the prop on blur
  useEffect(() => {
    if (!editing) {
      setValue(propValue)
    }
  }, [editing, propValue])

  const debouncedHandleChange = useCallback(debounce(handleChange, wait), [
    handleChange,
    wait,
  ])

  const handleLocalChange = useCallback(
    (value: T) => {
      setValue(value)
      debouncedHandleChange(value)
    },
    [debouncedHandleChange]
  )

  return [value, handleLocalChange, setEditing]
}
