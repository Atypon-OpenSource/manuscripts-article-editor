import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import { UserProfile } from '@manuscripts/manuscripts-json-schema'
import { RxDocument } from 'rxdb'

export const buildUser = async (
  doc: RxDocument<UserProfile>
): Promise<UserProfileWithAvatar> => {
  const item = doc.toJSON() as UserProfileWithAvatar

  const attachment = await doc.getAttachment('image')

  if (attachment) {
    item.avatar = window.URL.createObjectURL(await attachment.getData())
  }

  return item
}

export const buildUserMap = async (docs: Array<RxDocument<UserProfile>>) => {
  const output: Map<string, UserProfileWithAvatar> = new Map()

  for (const doc of docs) {
    const item = await buildUser(doc)

    output.set(item.userID, item)
  }

  return output
}
