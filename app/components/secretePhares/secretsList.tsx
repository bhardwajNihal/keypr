import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { GoTrash } from 'react-icons/go'
import { RiLock2Fill } from 'react-icons/ri'
import { ClipLoader } from 'react-spinners';

interface phrasePreviewType{
  _id: string;
  walletName : string;
  phrase : string;
}

const AddedSecrets = () => {

  const [phrases, setPhrases] = useState<phrasePreviewType[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchPhrases() {
      try {
        setLoading(true)
        const res = await axios.get("/api/users/preview/secret-phrases");
        setPhrases(res.data.secretPhrases);
        // console.log(res);
        setLoading(false);
      } catch (error) {
        console.error("error fetching secret pharese!, ERROR : ", error);
        setLoading(false);
      }
    }
    fetchPhrases();
  }, [])

  return (
    <div className='shadow-sm shadow-purple-900 h-full w-full md:w-3/5 rounded px-2 sm:px-4 pb-4 flex flex-col gap-3 overflow-hidden overflow-y-auto relative'>

      <h2 className="font-semibold text-lg sticky top-0 py-3 bg-background/30 z-50 backdrop-blur-xl">Added Secret Phrases</h2>

      {loading && <div className="text-center mt-12"><ClipLoader size={"30px"} color="gray" /></div>}
      {phrases && phrases.length > 0 && !loading
        ? phrases.map((phrase) =>
          <div
            key={phrase._id}
            className="relative shadow-sm shadow-purple-900 hover:shadow-lg w-full rounded-2xl p-4 bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
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
              <h2 className="text-lg font-semibold text-foreground">{phrase.walletName}</h2>

              <div className="mt-2 flex justify-between items-center text-sm sm:text-base text-muted-foreground">
                <span className="font-mono">{phrase.phrase}</span>
              </div>
            </div>
          </div>)
        : !loading && <div className="text-center mt-8 text-muted-foreground/60">No Credentials added yet!</div>
      }
    </div>
  )
}

export default AddedSecrets