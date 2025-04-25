'use client'
import { RiLock2Fill } from "react-icons/ri";
import React, { useEffect, useState } from 'react'
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { GoTrash } from "react-icons/go";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { CopyIcon } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAtom } from "jotai";
import { passwordAtom } from "@/app/atoms/passwordAtom";
import { useUser } from "@clerk/nextjs";
// import toast from "react-hot-toast";

export interface passwordPreviewType {
  _id: string,
  site: string,
  username: string,
  password: string
}

interface passwordDetailType {
  site: string;
  username: string;
  password: string
}

const AddedPasswords = () => {

  const {user} = useUser();
  const [pin, setPin] = useState("");
  const [passwordId, setPasswordId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [passwords, setPasswords] = useAtom(passwordAtom);
  const [loading, setLoading] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordDetails, setPasswordDetails] = useState<passwordDetailType>()
  const [deletingPasswordId, setDeletingPasswordId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPasswords() {
      try {
        setLoading(true)
        const res = await axios.get("/api/users/preview/passwords");
        setPasswords(res.data.passwords);
        setLoading(false);
      } catch (error) {
        console.error("error fetching passwords!, ERROR : ", error);
        setLoading(false);
      }
    }
    fetchPasswords();
  }, [setPasswords])

  useEffect(() => {
    if (pin.length === 4 && passwordId !== null) {
      async function fetchDetails() {
        try {
          setIsDetailsLoading(true);
          const res = await axios.post(`/api/users/details/password/${passwordId}`, { pin }, { validateStatus: () => true })
          if (res.status !== 200) {
            setError(res.data.message)
            setPin("");
            setIsDetailsLoading(false);
            return;
          };
          // console.log(res);
          setPasswordDetails(res.data.PasswordDetails)
          setPin("");
          setPasswordId("");
          setIsOpen(false);
          setIsDetailsLoading(false);
        } catch (error) {
          console.error("Error fetching password details", error);
          setPin("");
          setPasswordId("");
          setIsOpen(false);
          setIsDetailsLoading(false);
        }
      }
      fetchDetails();
    }
  }, [pin, passwordId])


  async function handleDelete(passwordId : string){

    try {
      setDeletingPasswordId(passwordId);
      const res = await axios.delete(`/api/users/delete/password/${passwordId}`);
      const updatedPasswords = passwords.filter(pwd => pwd._id !== passwordId);
      setPasswords(updatedPasswords);
      toast.success(res.data.message);
      setDeletingPasswordId(null);
    } catch (error) {
      console.error("Error deleting Password!",error);
      toast.error("Error deleting password!")
    }
  }

  async function handleSendEmail(){
    try {
      const res = await axios.post("api/users/send-email",{email:user?.primaryEmailAddress?.emailAddress})
      toast.success(res.data.message);
      
    } catch (error) {
      console.error("Error sending Email!",error);
      toast.error("Error sending email!");
    }
  }

  // useEffect(() => {
  //   console.log(passwords);
  // }, [passwords])

  return (
    <div className='shadow-sm shadow-purple-900 h-screen w-full md:w-3/5 rounded px-2 sm:px-4 pb-4 flex flex-col gap-3 overflow-hidden overflow-y-auto'>

      <h2 className="font-semibold text-lg sticky top-0 py-3 bg-background/30 z-50 backdrop-blur-xl">Added Passwords</h2>

      {loading && <div className="text-center mt-12"><ClipLoader size={"30px"} color="gray" /></div>}
      {passwords && passwords.length > 0 && !loading
        ? passwords.map((password) =>
          <div
            onClick={() => {
              setIsOpen(true)
              setPasswordId(password._id)
            }}
            key={password._id}
            className="relative shadow-sm shadow-purple-900 hover:shadow-lg w-full rounded-2xl p-2 sm:p-4 bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
          >
            {/* Lock Icon */}
            <div className="absolute top-4 left-4 text-muted-foreground group-hover:text-foreground transition-colors">
              <RiLock2Fill size={20} />
            </div>

            {/* Delete Icon */}
            <button 
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(password._id);
            }}
            className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition">
              {deletingPasswordId===password._id ? <ClipLoader size={16} color="gray"/> : <GoTrash size={18} />}
            </button>

            {/* Content */}
            <div className="pl-8 pr-3 pt-2">
              <h2 className="text-lg font-semibold text-foreground">{password.site}</h2>

              <div className="mt-2 sm:flex justify-between items-center text-sm text-muted-foreground">
                <div className=""><span className="text-xs text-muted-foreground/50">username : </span>{password.username}</div>
                <div className="font-mono"><span className="text-xs text-muted-foreground/50">pwd : </span>{password.password}</div>
              </div>
            </div>
          </div>)
        : !loading && <div className="text-center mt-8 text-muted-foreground/60">No Credentials added yet!</div>
      }

      {/* enter pin popup */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="mx-4">
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
                  <InputOTPGroup className='flex gap-3 justify-center w-full my-6 mt-8'>
                    <InputOTPSlot index={0} className='text-lg h-12 w-12 rounded border border-purple-900 ' />
                    <InputOTPSlot index={1} className='text-lg h-12 w-12 rounded border border-purple-900 ' />
                    <InputOTPSlot index={2} className='text-lg h-12 w-12 rounded border border-purple-900 ' />
                    <InputOTPSlot index={3} className='text-lg h-12 w-12 rounded border border-purple-900 ' />
                  </InputOTPGroup>
                </InputOTP>
                {isDetailsLoading && <div className='text-center w-full'><ClipLoader size={"16px"} color='gray' /></div>}
                {error && !isDetailsLoading && <p className='text-center text-sm text-red-700'>{error}</p>}
                <p className='text-xs md:text-sm text-center'>Forget pin! 
                  <span 
                  onClick={handleSendEmail}
                  className='text-blue-600 hover:underline cursor-pointer'>reset</span>
                </p>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {passwordDetails && <div className='min-h-screen w-full flex items-center justify-center absolute top-0 left-0 z-50'>

        <div className="w-full max-w-md mx-auto mt-6 p-6 rounded-2xl shadow-xl shadow-purple-900 bg-background/70 backdrop-blur-lg shadow-lg text-foreground space-y-3 relative">

          <span className='absolute top-8 left-12 text-muted-foreground hover:text-purple-500 hover:-translate-x-1 duration-300 cursor-pointer' onClick={() => setPasswordDetails(undefined)}><FaArrowLeft /></span>
          <h3 className="text-xl font-bold text-center text-purple-600 dark:text-purple-400">
            🔑Password Details
          </h3>

          <div className="flex justify-between border-b border-border pb-2 relative">
            <span className="font-medium text-muted-foreground">site/app </span>
            <span className="font-mono mr-8">{passwordDetails.site}</span>
          </div>

          <div className="flex justify-between border-b border-border pb-2 relative">
            <span className="font-medium text-muted-foreground">username</span>
            <span className="font-mono mr-8">{passwordDetails.username}</span>
            <span className='text-muted-foreground/50 hover:bg-purple-900/10 absolute right-0'>
              <CopyIcon
                onClick={() => {
                  navigator.clipboard.writeText(passwordDetails.username)
                  toast.success("Copied to clipboard!", {position:"bottom-center"})
                }}
                className='hover:text-purple-400' size={"15px"} />
            </span>
          </div>

          <div className="flex justify-between border-b border-border pb-2 relative">
            <span className="font-medium text-muted-foreground">password</span>
            <span className="font-mono mr-8">{passwordDetails.password}</span>
            <span className='text-muted-foreground/50 hover:bg-purple-900/10 absolute right-0'>
              <CopyIcon
                onClick={() => {
                  navigator.clipboard.writeText(passwordDetails.password)
                  toast.success("Copied to clipboard!", {position:"bottom-center"})
                }}
                className='hover:text-purple-400' size={"15px"} />
            </span>
          </div>

        </div>

      </div>}

    </div>
  )
}

export default AddedPasswords