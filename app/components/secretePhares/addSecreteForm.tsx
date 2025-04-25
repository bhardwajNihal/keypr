'use client'
import axios from "axios";
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useSetAtom } from "jotai";
import { phraseAtom } from "@/app/atoms/phraseAtom";

interface FormValues {
    walletName : string;
    phrase :string
}

const AddSecretForm = () => {

  const [loading, setLoading] = useState(false);
  const setPhrases = useSetAtom(phraseAtom);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormValues>()

  const onSubmit = async(data: FormValues) => {
    
    console.log("Form Submitted:", data);
    // finally making API call
    try {
      setLoading(true)
      const res = await axios.post("/api/users/add/secret-phrase",data);

      const updatedPhrases = await axios.get("api/users/preview/secret-phrases");
      setPhrases(updatedPhrases.data.secretPhrases)

      toast.success(res.data.message);
      setLoading(false)
      reset()
    } catch (error) {
      console.error("error submitting form data!, ERROR : ",error);
      toast.error("Error submitting form data!");
      setLoading(false)
    }
  }

  return (
    <div className='shadow shadow-purple-900 h-fit w-full md:w-2/5 rounded p-2 sm:p-4 mb-4'>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <p>wallet name</p>
          <input
            {...register("walletName", { required: "WalletName is required", minLength: 3 })}
            placeholder="bitcoin wallet"
            className="border p-2 w-full rounded"
          />
          {errors.walletName && <p className="text-red-800 text:xs sm:text-sm">{errors.walletName.message}</p>}
        </div>

        <div>
          <p>secret phrase</p>
          <textarea
            {...register("phrase", {
              required: "Secret phrase is required!",
              validate: (value) => {
                const wordCount = value.trim().split(/\s+/).length;
                return wordCount === 12 || wordCount === 24 || "Phrase must be exactly 12 or 24 words";
              }        
            })}
            placeholder="adapt bridge cat .... .... ...."
            className="border p-2 w-full rounded"
          />
          {errors.phrase && <p className="text-red-800 text:xs sm:text-sm">{errors.phrase.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full text-white px-4 py-2 rounded bg-purple-800 hover:bg-purple-700"
        >
          {(loading) ? <ClipLoader size={"12px"} color="white"/> : "Add Secret"}
        </button>
      </form>

    </div>
  )
}

export default AddSecretForm