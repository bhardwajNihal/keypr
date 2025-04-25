import { atom } from 'jotai'
import { cardPreviewType } from '../components/cards/cardsList'

export const cardAtom = atom<cardPreviewType[]>([])