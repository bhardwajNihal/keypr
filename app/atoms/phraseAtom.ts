import { atom } from 'jotai'
import { phrasePreviewType } from '../components/secretePhares/secretsList'

export const phraseAtom = atom<phrasePreviewType[]>([])