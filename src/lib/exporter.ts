import JSZip from 'jszip'
import * as ObjectTypes from '../transformer/object-types'
import {
  Component,
  ComponentMap,
  ComponentWithAttachment,
  Figure,
  UserProfile,
} from '../types/components'
import { JsonComponent, ProjectDump } from './importers'
import { convert } from './pressroom'

// tslint:disable-next-line:no-any
export const removeEmptyStyles = (component: { [key: string]: any }) => {
  Object.entries(component).forEach(([key, value]) => {
    if (value === '' && key.match(/Style$/)) {
      delete component[key]
    }
  })
}

const createProjectDump = (componentMap: ComponentMap, manuscriptID: string): ProjectDump => ({
  version: '2.0',
  data: Array.from(componentMap.values()).filter((component: JsonComponent) => {
    return component.objectType !== ObjectTypes.MANUSCRIPT || component.id === manuscriptID
  }).map((component: JsonComponent) => {
    component._id = component._id || component.id
    delete component.id
    delete component._attachments
    delete component.attachment
    delete component.src

    removeEmptyStyles(component)

    return component
  }),
})

const componentHasObjectType = <T extends Component>(
  component: Component,
  objectType: string
): component is T => {
  return component.objectType === objectType
}

const fetchBlob = (url: string) => fetch(url).then(res => res.blob())

const fetchAttachment = (
  component: ComponentWithAttachment
): Promise<Blob> | null => {
  if (
    componentHasObjectType<UserProfile>(component, ObjectTypes.USER_PROFILE) &&
    component.image
  ) {
    return fetchBlob(component.image)
  }

  if (
    componentHasObjectType<Figure>(component, ObjectTypes.FIGURE) &&
    component.src
  ) {
    return fetchBlob(component.src)
  }

  return null
}

export const generateAttachmentFilename = (id: string) => id.replace(':', '_')

const buildProjectBundle = (componentMap: ComponentMap, manuscriptID: string) => {
  const data = createProjectDump(componentMap, manuscriptID)

  const zip = new JSZip()

  zip.file<'string'>('index.manuscript-json', JSON.stringify(data))

  for (const component of componentMap.values()) {
    const attachment = fetchAttachment(component)

    if (attachment) {
      const filename = generateAttachmentFilename(
        (component as JsonComponent)._id
      )
      zip.file<'blob'>('Data/' + filename, attachment)
    }
  }

  return zip.generateAsync({ type: 'blob' })
}

export const generateDownloadFilename = (title: string) =>
  title
    .replace(/<[^>]*>/g, '') // remove markup
    .replace(/\W/g, '_') // remove non-word characters
    .replace(/_+(.)/g, matches => matches[1].toUpperCase()) // convert snake case to camel case
    .replace(/_+$/, '') // remove any trailing underscores

export const downloadExtension = (format: string): string => {
  switch (format) {
    case '.docx':
    case '.pdf':
      return format

    default:
      return '.zip'
  }
}

export const exportProject = async (
  componentMap: ComponentMap,
  manuscriptID: string,
  format: string
) => {
  const file = await buildProjectBundle(componentMap, manuscriptID)
  // download(file, 'manuscript.manuproj.zip')

  const form = new FormData()
  form.append('file', file, 'export.manuproj')

  return convert(form, format)
}
