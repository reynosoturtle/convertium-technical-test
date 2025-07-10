import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { auth } from './firebase'

const storage = getStorage()

export const uploadProfileImage = async (file: File): Promise<string> => {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('No authenticated user')

  const imageRef = ref(storage, `profileImages/${uid}/${file.name}`)
  await uploadBytes(imageRef, file)
  return await getDownloadURL(imageRef)
}
