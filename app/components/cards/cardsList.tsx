import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { GoTrash } from 'react-icons/go'
import { RiLock2Fill } from 'react-icons/ri'
import { ClipLoader } from 'react-spinners';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { CopyIcon } from 'lucide-react';
import { FaArrowLeft } from "react-icons/fa";
import toast from 'react-hot-toast';
import { useRecoilState } from 'recoil';
import { cardAtom } from '@/app/recoil/cardAtom';


export interface cardPreviewType {
  _id: string;
  title: string;
  cardNumber: string;
  expiry: string;
  cvv: string
}
interface cardDetailsType {
  title: string;
  CardHolderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string
}
const AddedCards = () => {

  const [pin, setPin] = useState("");
  const [cardId, setCardId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [cards, setCards] = useRecoilState<cardPreviewType[]>(cardAtom);
  const [loading, setLoading] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)
  const [error, setError] = useState("");
  const [cardDetails, setCardDetails] = useState<cardDetailsType>()
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);

  useEffect(() => {

    async function fetchCards() {
      try {
        setLoading(true);
        const res = await axios.get("/api/users/preview/cards");
        // console.log(res.data.cards);
        setCards(res.data.cards);
        setLoading(false);
      } catch (error) {
        console.error("error fetching cards!, ERROR", error)
      }
    }
    fetchCards()
  }, [setCards]);

  useEffect(() => {
    if (pin.length === 4 && cardId !== null) {
      async function fetchDetails() {
        try {
          setIsDetailsLoading(true);
          const res = await axios.post(`/api/users/details/card/${cardId}`,
            { pin },
            { validateStatus: () => true }    // desables auto throwing error, so that we can handle it in our way
          )
          if (res.status !== 200) {
            setError(res.data.message)
            setPin("");
            setIsDetailsLoading(false);
            return;
          };
          // console.log(res);
          setCardDetails(res.data.CardDetails)
          setPin("");
          setCardId("");
          setIsOpen(false);
          setIsDetailsLoading(false);
        } catch (error) {
          console.error("Error fetching password details", error);
          setIsDetailsLoading(false);
          setPin("");
          setCardId("");
          setIsOpen(false);
        }
      }
      fetchDetails();
    }
  }, [pin, cardId])

  async function handleDelete(cardId: string) {
      try {
        setDeletingCardId(cardId);
        const res = await axios.delete(`api/users/delete/card/${cardId}`,)
        toast.success(res.data.message);
        setDeletingCardId(null);
      } catch (error) {
        console.error("Error deleting Card!", error);
        toast.error("Error deleting card!");
        setDeletingCardId(null);
      }
  }

  // useEffect(() => {
  //   console.log(cardDetails);
  // }, [cardDetails])

  return (
    <div className='shadow shadow-purple-900 h-screen w-full md:w-3/5 rounded flex flex-col gap-3 px-2 sm:px-4 pb-6 overflow-hidden overflow-y-auto '>

      <h2 className="font-semibold text-lg sticky top-0 py-3 bg-background/30 z-50 backdrop-blur-xl">Added Cards</h2>

      {loading && <div className='text-center mt-12'><ClipLoader color='gray' /></div>}
      {(cards && cards.length > 0 && !loading)
        ? cards.map(card =>
          <div
            onClick={() => {
              setIsOpen(true)
              setCardId(card._id)
            }}
            key={card._id}
            className="group shadow-sm shadow-purple-900 relative w-full rounded-2xl p-4 bg-card backdrop-blur-lg border border-border shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            {/* Lock Icon */}
            <div className="absolute top-4 left-4 text-muted-foreground group-hover:text-foreground transition-colors">
              <RiLock2Fill size={20} />
            </div>

            {/* Delete Icon */}
            <button
            onClick={(e) => {
              e.stopPropagation(); 
              handleDelete(card._id)
            }}
            className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition">
              {deletingCardId===card._id ? <ClipLoader size={15} color='gray'/> : <GoTrash size={18} />}
            </button>

            {/* Content */}
            <div className="pl-8 pr-3 pt-2">
              <h2 className="text-lg font-semibold text-foreground">{card.title}</h2>

              <div className="mt-2 sm:flex justify-between items-end text-sm text-muted-foreground">
                <div className="font-mono tracking-wide">
                  {card.cardNumber}
                </div>
                <div className="flex gap-6 font-mono text-xs sm:text-sm text-muted-foreground/70">
                  <span>{card.expiry.slice(0, 2)}/{card.expiry.slice(-2)}</span>
                  <span>{card.cvv}</span>
                </div>
              </div>
            </div>
          </div>)
        : !loading && <div className="text-center mt-8 text-muted-foreground/60">No Credentials added yet!</div>
      }

      {/* enter pin popup */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-center'>Enter Pin to acess details!</DialogTitle>
            <div>
              {<div>
                <InputOTP
                  value={pin}
                  onChange={setPin}
                  maxLength={4}
                  pattern={REGEXP_ONLY_DIGITS}
                  type='password'
                >
                  <InputOTPGroup className='flex gap-3 justify-center w-full my-4'>
                    <InputOTPSlot index={0} className='text-lg h-12 w-12 rounded border border-purple-900 ' />
                    <InputOTPSlot index={1} className='text-lg h-12 w-12 rounded border border-purple-900 ' />
                    <InputOTPSlot index={2} className='text-lg h-12 w-12 rounded border border-purple-900 ' />
                    <InputOTPSlot index={3} className='text-lg h-12 w-12 rounded border border-purple-900 ' />
                  </InputOTPGroup>
                </InputOTP>
                {isDetailsLoading && <div className='text-center w-full'><ClipLoader size={"16px"} color='gray' /></div>}
                {error && !isDetailsLoading && <p className='text-center text-sm text-red-700'>{error}</p>}
                <p className='text-xs md:text-sm text-center'>Forget pin! <span className='text-blue-600 hover:underline cursor-pointer'>reset</span></p>
              </div>
              }
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {cardDetails && <div className='min-h-screen w-full flex items-center justify-center absolute top-0 left-0 z-50'>

        <div className="w-full max-w-md mx-auto mt-6 p-6 rounded-2xl shadow-xl shadow-purple-900 bg-background/70 backdrop-blur-lg shadow-lg text-foreground space-y-3 relative">

          <span className='absolute top-8 left-12 text-muted-foreground hover:text-purple-500 hover:-translate-x-1 duration-300 cursor-pointer' onClick={() => setCardDetails(undefined)}><FaArrowLeft/></span>
          <h3 className="text-xl font-bold text-center text-purple-600 dark:text-purple-400">
            💳Card Details
          </h3>

          <div className="flex justify-between border-b border-border pb-3">
            <div className="font-mono text-center w-full text-lg font-semibold">{cardDetails.title}</div>
          </div>

          <div className="flex justify-between border-b border-border pb-2 relative">
            <span className="font-medium text-muted-foreground">Cardholder Name</span>
            <span className="font-mono mr-8">{cardDetails.CardHolderName}</span>
            <span className='text-muted-foreground/50 absolute right-0'>
              <CopyIcon
                onClick={() => {
                  navigator.clipboard.writeText(cardDetails.CardHolderName)
                  toast.success("Copied to clipboard!", {position:"bottom-center"})
                }}
                className='hover:text-purple-400' size={"15px"} />
            </span>
          </div>

          <div className="flex justify-between border-b border-border pb-2 relative">
            <span className="font-medium text-muted-foreground">Card Number</span>
            <span className="font-mono mr-8">{cardDetails.cardNumber}</span>
            <span className='text-muted-foreground/50 hover:bg-purple-900/10 absolute right-0'>
              <CopyIcon
                onClick={() => {
                  navigator.clipboard.writeText(cardDetails.cardNumber)
                  toast.success("Copied to clipboard!", {position:"bottom-center"})
                }}
                className='hover:text-purple-400' size={"15px"} />
            </span>
          </div>

          <div className="flex justify-between border-b border-border pb-2 relative">
            <span className="font-medium text-muted-foreground">Expiry</span>
            <span className="font-mono mr-8">{cardDetails.expiry.slice(0, 2)}/{cardDetails.expiry.slice(2, 4)}</span>
            <span className='text-muted-foreground/50 hover:bg-purple-900/10 absolute right-0'>
              <CopyIcon
                onClick={() => {
                  navigator.clipboard.writeText(`${cardDetails.expiry.slice(0, 2)}/${cardDetails.expiry.slice(2, 4)}`)
                  toast.success("Copied to clipboard!", {position:"bottom-center"})
                }}
                className='hover:text-purple-400' size={"15px"} />
            </span>
          </div>

          <div className="flex justify-between relative">
            <span className="font-medium text-muted-foreground">CVV</span>
            <span className="font-mono mr-8">{cardDetails.cvv}</span>
            <span className='text-muted-foreground/50 hover:bg-purple-900/10 absolute right-0'>
              <CopyIcon
                onClick={() => {
                  navigator.clipboard.writeText(cardDetails.cvv)
                  toast.success("Copied to clipboard!", {position:"bottom-center"})
                }}
                className='hover:text-purple-400' size={"15px"} />
            </span>
          </div>

        </div>

      </div>}

    </div >
  )
}

export default AddedCards