/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2025 Atypon Systems LLC. All Rights Reserved.
 */

import { ManuscriptNode } from '@manuscripts/transform'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { compareDocuments } from '../lib/comparison/compare-documents'
import { useStore } from '../store'

export const useCompareDocuments = () => {
  const [searchParams] = useSearchParams()
  const originalId = searchParams.get('originalId') || undefined
  const comparisonId = searchParams.get('comparisonId') || undefined

  const [{ getSnapshot }] = useStore((store) => ({
    getSnapshot: store.getSnapshot,
  }))
  const [comparedDoc, setComparedDoc] = useState<ManuscriptNode | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isComparingMode = Boolean(originalId && comparisonId)

  useEffect(() => {
    const fetchAndCompareDocuments = async () => {
      if (!originalId || !comparisonId) {
        setComparedDoc(null)
        setError(null)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const [originalSnapshot, comparisonSnapshot] = await Promise.all([
          getSnapshot(originalId),
          getSnapshot(comparisonId),
        ])

        if (!originalSnapshot || !comparisonSnapshot) {
          throw new Error('Failed to fetch one or both snapshots')
        }

        const comparedDocument = compareDocuments(
          originalSnapshot,
          comparisonSnapshot
        )
        setComparedDoc(comparedDocument)
      } catch (err) {
        console.error('Error comparing documents:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
        setComparedDoc(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAndCompareDocuments()
  }, [originalId, comparisonId, getSnapshot])

  // Reset state when exiting comparison mode
  useEffect(() => {
    if (!isComparingMode) {
      setComparedDoc(null)
      setError(null)
      setIsLoading(false)
    }
  }, [isComparingMode])

  return {
    comparedDoc,
    isComparingMode,
    isLoading,
    error,
  }
}
