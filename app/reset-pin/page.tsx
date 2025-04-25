"use client";
import React, { Suspense, useEffect, useState } from 'react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../components/ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import axios from 'axios';
import { BarLoader, ClipLoader } from "react-spinners"
import toast from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

const ResetPin = () => {

    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [pin, setPin] = useState("");
    const [cfmPin, setCfmPin] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function handleSubmit() {

            setError("");
            if (pin.length === 4 && cfmPin.length === 4) {
                if (pin === cfmPin) {
                    try {
                        setLoading(true)
                        const res = await axios.put("/api/users/reset-pin", { token, pin })
                        setLoading(false)
                        if(res.status===200) toast.success(res.data.message);
                        else toast.error(res.data.message);
                    } catch (error) {
                        console.error(error);
                        toast.error("Error resetting pin!")
                    }
                }
                else {
                    setError("Pins didn't match!");
                }
            }
        }
        handleSubmit()
    }, [pin, cfmPin, token])



    return (
        <Suspense fallback={<div className='w-full text-center mt-20'><ClipLoader size={18} color='gray'/></div>}>

            <div className='min-h-screen w-full flex justify-center flex-col items-center'>

                <div className="form h-fit p-4 sm:p-8 rounded-lg text-center shadow-lg shadow-purple-900 relative">
                    {loading && <div className='absolute top-0 left-0 w-full'><BarLoader height={"5px"} width={"100%"} color='#50157F' speedMultiplier={1.5} /></div>}
                    <h2 className='text-2xl font-semibold'>Set a New Pin</h2>
                    <p className='text-muted-foreground'>For secured access.</p>
                    {error && <p className='text-xs text-red-500 mt-4'>{error}</p>}
                    <div className='flex flex-col gap-8 mt-2'>
                        <div>
                            <h2 className='text-start mb-2 text-sm'>New Pin</h2>
                            <InputOTP
                                value={pin}
                                onChange={setPin}
                                maxLength={4}
                                pattern={REGEXP_ONLY_DIGITS}
                            >
                                <InputOTPGroup className='flex gap-3'>
                                    <InputOTPSlot index={0} className='text-lg h-12 w-12 rounded border border-purple-900 ' />
                                    <InputOTPSlot index={1} className='text-lg h-12 w-12 rounded border border-purple-900 ' />
                                    <InputOTPSlot index={2} className='text-lg h-12 w-12 rounded border border-purple-900 ' />
                                    <InputOTPSlot index={3} className='text-lg h-12 w-12 rounded border border-purple-900 ' />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <div>
                            <h2 className='text-start mb-2 text-sm'>Confirm New Pin</h2>
                            <InputOTP
                                value={cfmPin}
                                onChange={setCfmPin}
                                maxLength={4}
                                pattern={REGEXP_ONLY_DIGITS}>
                                <InputOTPGroup className='flex gap-3'>
                                    <InputOTPSlot index={0} className='text-lg h-12 w-12 rounded border border-purple-900 ' />
                                    <InputOTPSlot index={1} className='text-lg h-12 w-12 rounded border border-purple-900 ' />
                                    <InputOTPSlot index={2} className='text-lg h-12 w-12 rounded border border-purple-900 ' />
                                    <InputOTPSlot index={3} className='text-lg h-12 w-12 rounded border border-purple-900 ' />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                    </div>
                </div>
            </div>

        </Suspense>
    )
}

export default ResetPin