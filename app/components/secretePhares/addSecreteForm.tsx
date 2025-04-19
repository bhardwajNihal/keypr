'use client'
import axios from "axios";
import React from "react"
import { useForm } from "react-hook-form"


interface FormValues {
    walletName : string;
    phrase :string
}

const AddSecretForm = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const onSubmit = async(data: FormValues) => {
    
    console.log("Form Submitted:", data);
    // finally making API call
    try {
      const res = await axios.post("/api/users/add/secret-phrase",data);
      alert(res.data.message);
    } catch (error) {
      console.error("error submitting form data!, ERROR : ",error);
      alert("Error submitting form data!");
    }
  }

  return (
    <div className='border border-gray-800 h-full w-full md:w-2/5 rounded'>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <input
            {...register("walletName", { required: "WalletName is required", minLength: 3 })}
            placeholder="bitcoin wallet"
            className="border p-2 w-full rounded"
          />
          {errors.walletName && <p className="text-red-500">{errors.walletName.message}</p>}
        </div>

        <div>
          <input
            {...register("phrase", {
              required: "Secret phrase is required!",
            })}
            placeholder="adapt bridge cat ..."
            className="border p-2 w-full rounded"
          />
          {errors.phrase && <p className="text-red-500">{errors.phrase.message}</p>}
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Submit
        </button>
      </form>

    </div>
  )
}

export default AddSecretForm