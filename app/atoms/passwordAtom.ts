import { atom } from 'jotai'
import { passwordPreviewType } from '../components/passwords/passwordsList'

export const passwordAtom = atom<passwordPreviewType[]>([])