'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { GoTrash } from 'react-icons/go'
import { RiLock2Fill } from 'react-icons/ri'
import { ClipLoader } from 'react-spinners';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { CopyIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';
import { useAtom } from 'jotai';
import { phraseAtom } from '@/app/atoms/phraseAtom';
import { useUser } from '@clerk/nextjs';


export interface phrasePreviewType {
  _id: string;
  walletName: string;
  phrase: string;
}

interface phraseDetailType {
  walletName: string;
  phrase: string;
}

const AddedSecrets = () => {

  const { user } = useUser();
  const [pin, setPin] = useState("");
  const [phraseId, setPhraseId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [phrases, setPhrases] = useAtom(phraseAtom);
  const [loading, setLoading] = useState(false)
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [phraseDetails, setPhraseDetails] = useState<phraseDetailType>();
  const [deletingPhraseId, setDeletingPhraseId] = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    async function fetchPhrases() {
      try {
        setLoading(true)
        const res = await axios.get("/api/users/preview/secret-phrases");
        setPhrases(res.data.secretPhrases);
        // console.log(res);
        setLoading(false);
      } catch (error) {
        console.error("error fetching secret phrase!, ERROR : ", error);
        setLoading(false);
      }
    }
    fetchPhrases();
  }, [setPhrases])

  useEffect(() => {
    if (pin.length === 4 && phraseId !== null) {
      async function fetchDetails() {
        try {
          setIsDetailsLoading(true);
          const res = await axios.post(`/api/users/details/secret-phrase/${phraseId}`, { pin }, { validateStatus: () => true })
          if (res.status !== 200) {
            setError(res.data.message)
            setPin("");
            setIsDetailsLoading(false);
            return;
          };
          setPhraseDetails(res.data.phraseDetails)
          setPin("");
          setPhraseId("");
          setIsOpen(false);
          setIsDetailsLoading(false);
        } catch (error) {
          console.error("Error fetching password details", error);
          setPin("");
          setPhraseId("");
          setIsOpen(false);
          setIsDetailsLoading(false);
        }
      }
      fetchDetails();
    }
  }, [pin, phraseId])


  async function handleDelete(phraseId: string) {

    try {
      setDeletingPhraseId(phraseId);
      const res = await axios.delete(`api/users/delete/secret-phrase/${phraseId}`);

      const updatedPhrases = phrases.filter(phrase => phrase._id !== phraseId);
      setPhrases(updatedPhrases);
      toast.success(res.data.message);
      setDeletingPhraseId(null);
    } catch (error) {
      console.error("Error deleting phrase!", error);
      toast.error("Error deleting phrase!")
    }
  }


  async function handleSendEmail() {
    try {
      setIsSendingEmail(true)
      const res = await axios.post("api/users/send-email", { email: user?.primaryEmailAddress?.emailAddress })
      setIsSendingEmail(false)
      toast.success(res.data.message);

    } catch (error) {
      console.error("Error sending Email!", error);
      setIsSendingEmail(false);
      toast.error("Error sending email!");
    }
  }

  return (
    <div className='shadow-sm shadow-purple-900 h-screen w-full md:w-3/5 rounded px-2 sm:px-4 pb-4 flex flex-col gap-3 overflow-hidden overflow-y-auto'>

      <h2 className="font-semibold text-lg sticky top-0 py-3 bg-background/30 z-50 backdrop-blur-xl">Added Secret Phrases</h2>

      {loading && <div className="text-center mt-12"><ClipLoader size={"30px"} color="gray" /></div>}
      {phrases && phrases.length > 0 && !loading
        ? phrases.map((phrase) =>
          <div
            onClick={() => {
              setIsOpen(true)
              setPhraseId(phrase._id)
            }}
            key={phrase._id}
            className="relative shadow-sm shadow-purple-900 hover:shadow-lg w-full rounded-2xl p-4 bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
          >
            {/* Lock Icon */}
            <div className="absolute top-4 left-4 text-muted-foreground group-hover:text-foreground transition-colors">
              <RiLock2Fill size={20} />
            </div>

            {/* Delete Icon */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(phrase._id);
              }}
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition">
              {deletingPhraseId === phrase._id ? <ClipLoader size={16} color='gray' /> : <GoTrash size={18} />}
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
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-center'>Enter Pin to acess details!</DialogTitle>
            <div>
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
                <p className='text-xs md:text-sm text-center'>Forget pin!
                  <button
                    disabled={isSendingEmail}
                    onClick={handleSendEmail}
                    className='text-blue-500 hover:underline cursor-pointer ml-2'>{isSendingEmail ? <ClipLoader  className='ml-2' size={14} color='gray' /> : " reset"}</button>
                </p>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {phraseDetails && <div className='min-h-screen w-full flex items-center justify-center absolute top-0 left-0 z-50'>

        <div className="w-full max-w-md mx-auto mt-6 p-6 rounded-2xl shadow-xl shadow-purple-900 bg-background/70 backdrop-blur-lg shadow-lg text-foreground space-y-3 relative">

          <span className='absolute top-6 left-10 text-muted-foreground hover:text-purple-500 hover:-translate-x-1 duration-300 cursor-pointer' onClick={() => setPhraseDetails(undefined)}><FaArrowLeft /></span>
          <h3 className="text-xl font-bold text-center text-purple-600 dark:text-purple-400">
            🔓Secret Phrase Unmasked
          </h3>

          <div className="flex justify-between border-b border-border pt-4 pb-2 relative">
            <span className="font-medium text-muted-foreground">Wallet Name</span>
            <span className="font-mono mr-8">{phraseDetails.walletName}</span>
          </div>

          <div className="flex justify-between gap-12 h-fit border-b border-border py-4 relative">
            <span className="font-medium text-muted-foreground">Phrase</span>
            <span className="font-mono mr-8">{phraseDetails.phrase}</span>
            <span className='text-muted-foreground/50 hover:bg-purple-900/10 absolute right-0'>
              <CopyIcon
                onClick={() => {
                  navigator.clipboard.writeText(phraseDetails.phrase)
                  toast.success("Copied to clipboard!", { position: "bottom-center" })
                }}
                className='hover:text-purple-400' size={"15px"} />
            </span>
          </div>
        </div>

      </div>}

    </div>
  )
}

export default AddedSecrets