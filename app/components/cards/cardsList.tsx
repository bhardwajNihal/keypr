import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { GoTrash } from 'react-icons/go'
import { RiLock2Fill } from 'react-icons/ri'
import { ClipLoader } from 'react-spinners';

interface cardPreviewType {
  _id: string;
  title: string;
  cardNumber: string;
  expiry: string;
  cvv: string
}
const AddedCards = () => {

  const [cards, setCards] = useState<cardPreviewType[]>([])
  const [loading, setLoading] = useState(false);

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

  // useEffect(() => {
  //   console.log(cards);
  // }, [cards])

  return (
    <div className='shadow shadow-purple-900 h-full w-full md:w-3/5 rounded flex flex-col gap-3 px-2 sm:px-4 pb-6 overflow-hidden overflow-y-auto relative '>

      <h2 className="font-semibold text-lg sticky top-0 py-3 bg-background/30 z-50 backdrop-blur-xl">Added Cards</h2>

      {loading && <div className='text-center mt-12'><ClipLoader color='gray' /></div>}
      {(cards && cards.length > 0 && !loading)
        ? cards.map(card =>
          <div
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

              <div className="mt-2 flex justify-between items-end text-sm text-muted-foreground">
                <div className="font-mono tracking-wide">
                  {card.cardNumber}
                </div>
                <div className="flex gap-6 font-mono text-xs sm:text-sm text-muted-foreground/70">
                  <span>{card.expiry}</span>
                  <span>{card.cvv}</span>
                </div>
              </div>
            </div>
          </div>)
        : !loading && <div className="text-center mt-8 text-muted-foreground/60">No Credentials added yet!</div>
      }

    </div >
  )
}

export default AddedCards