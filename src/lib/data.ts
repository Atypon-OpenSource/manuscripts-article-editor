import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import { UserProfile } from '@manuscripts/manuscripts-json-schema'
import { RxDocument } from 'rxdb'

export const buildUserMap = async (docs: Array<RxDocument<UserProfile>>) => {
  const output: Map<string, UserProfile> = new Map()

  for (const doc of docs) {
    const item = doc.toJSON() as UserProfileWithAvatar

    const attachment = await doc.getAttachment('image')

    if (attachment) {
      item.avatar = window.URL.createObjectURL(attachment.getData())
    }

    output.set(item.userID, item)
  }

  return output
}
