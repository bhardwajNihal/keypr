import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { GoTrash } from 'react-icons/go'
import { RiLock2Fill } from 'react-icons/ri'
import { ClipLoader } from 'react-spinners';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

interface cardPreviewType {
  _id: string;
  title: string;
  cardNumber: string;
  expiry: string;
  cvv: string
}
const AddedCards = () => {

  const [pin, setPin] = useState("");
  const [cardId, setCardId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [cards, setCards] = useState<cardPreviewType[]>([])
  const [loading, setLoading] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)
  const [error, setError] = useState("");

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
  }, []);

  useEffect(() => {
    if (pin.length === 4 && cardId !== null) {
      async function fetchDetails() {
        try {
          setIsDetailsLoading(true);
          const res = await axios.post(`/api/users/details/card/${cardId}`,
            { pin },
            { validateStatus: () => true }    // desables auto throwing error, so that we can handle it in our way
          )
          console.log(res);
          if (res.status !== 200) {
            setError(res.data.message)
            setPin("");
            setIsDetailsLoading(false);
            return;
          };
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

  // useEffect(() => {
  //   console.log(cards);
  // }, [cards])

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
            <button className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition">
              <GoTrash size={18} />
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
            <DialogDescription>
              <div>
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
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div >
  )
}

export default AddedCards