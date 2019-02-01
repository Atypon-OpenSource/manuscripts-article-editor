// https://github.com/pubkey/broadcast-channel#clear-tmp-folder
import BroadcastChannel from 'broadcast-channel'

export const clearChannelFolder = () => BroadcastChannel.clearNodeFolder()
