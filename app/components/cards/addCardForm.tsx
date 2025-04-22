'use client'
import axios from "axios";
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";


interface FormValues {
  title: string;
  CardHolderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string
}

const AddCardForm = () => {

  // const yearRef = useRef<HTMLInputElement>(null);
  // const cvvRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setFocus
  } = useForm<FormValues>()

  const onSubmit = async(data: FormValues) => {
    // modifying the payload before hitting your backend API to match the expected format
    const payload = {
      title : data.title,
      CardHolderName: data.CardHolderName,
      cardNumber: data.cardNumber,
      expiry: `${data.expiryMonth}${data.expiryYear}`,
      cvv: data.cvv,
    };
    
    // console.log("Form Submitted:", payload);
    // finally making API call
    try {
      setLoading(true);
      const res = await axios.post("/api/users/add/card",payload);
      reset()
      toast.success(res.data.message);
      setLoading(false);
    } catch (error) {
      console.error("error submitting form data!, ERROR : ",error);
      toast.error("Error submitting form data!");
      setLoading(false);
    }
  }

  return (
    <div className='shadow shadow-purple-900 h-fit w-full md:w-2/5 rounded p-2 sm:p-4 mb-4'>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      <div>
        <p>title</p>
          <input
            {...register("title", { required: "title is required", minLength: 2 })}
            placeholder="Sbi debit card..."
            className="border bg-background p-2 w-full rounded placeholder:text-sm"
          />
          {errors.title && <p className="text-red-800 text-xs sm:text-sm">{errors.title.message}</p>}
        </div>

        <div>
          <p>card holder name</p>
          <input
            {...register("CardHolderName", { required: "Card holder name is required", minLength: 3 })}
            placeholder="Nihal Bhardwaj"
            className="border bg-background p-2 w-full rounded placeholder:text-sm"
          />
          {errors.CardHolderName && <p className="text-red-800 text-xs sm:text-sm">{errors.CardHolderName.message}</p>}
        </div>

        <div>
          <p>card number</p>
          <input
            {...register("cardNumber", {
              required: "Card number is required",
              pattern: {
                value: /^\d{12,19}$/,
                message: "Card number must be 12 to 19 digits",
              },
            })}
            type="number"
            placeholder="1234 3456 5678 1234"
            className="border bg-background p-2 w-full rounded placeholder:text-sm"
          />
          {errors.cardNumber && <p className="text-red-800 text-xs sm:text-sm">{errors.cardNumber.message}</p>}
        </div>

        <p>expiry</p> 
        <div className="flex items-center gap-2">
          <input
            {...register("expiryMonth", {
              required: "Month is required",
              pattern: {
                value: /^(0[1-9]|1[0-2])$/,
                message: "Month must be between 01 and 12",
              },
            })}
            inputMode="numeric"
            type="text"
            placeholder="MM"
            className="border bg-background p-2 rounded w-16 placeholder:text-sm"
            onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
              if(e.target.value.length ===2) setFocus('expiryYear')
            }}
          />
          <span className="text-muted-foreground">/</span>
          <input
            {...register("expiryYear", {
              required: "Year is required",
              validate: (value) =>
                parseInt(value) >= parseInt(new Date().getFullYear().toString().slice(-2)) ||
                "Year must be this year or later",
            })}
            inputMode="numeric"
            type="text"
            placeholder="YY"
            className="border bg-background p-2 rounded w-16 placeholder:text-sm"
            onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
              if(e.target.value.length===2) setFocus('cvv')
            }}
          />
        </div>
        {(errors.expiryYear || errors.expiryMonth) && <p className="text-red-800 text-xs sm:text-sm">{errors.expiryYear?.message || errors.expiryMonth?.message}</p>}

        <div>
          <p>cvv</p>
          <input
            {...register("cvv", {
              required: "CVV is required",
              pattern: {
                value: /^\d{3,4}$/,
                message: "CVV must be 3 or 4 digits",
              },
            })}
            inputMode="numeric"
            type="text"
            placeholder="123"
            className="border bg-background p-2 w-full rounded placeholder:text-sm"
          />
          {errors.cvv && <p className="text-red-800 text-xs sm:text-sm">{errors.cvv.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full text-white px-4 py-2 rounded bg-purple-800 hover:bg-purple-700"
        >
          {(loading) ? <ClipLoader size={"12px"} color="white"/> : "Add Card"}
        </button>
      </form>

    </div>
  )
}

export default AddCardForm