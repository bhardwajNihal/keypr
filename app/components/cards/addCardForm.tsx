'use client'
import axios from "axios";
import React from "react"
import { useForm } from "react-hook-form"


interface FormValues {
  name: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string
}

const AddCardForm = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const onSubmit = async(data: FormValues) => {
    // modifying the payload before hitting your backend API to match the expected format
    const payload = {
      name: data.name,
      cardNumber: data.cardNumber,
      expiry: `${data.expiryMonth}${data.expiryYear}`,
      cvv: data.cvv,
    };
    console.log("Form Submitted:", payload);
    // finally making API call
    try {
      const res = await axios.post("/api/users/add/card",payload);
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
            {...register("name", { required: "Name is required", minLength: 3 })}
            placeholder="Cardholder Name"
            className="border p-2 w-full rounded"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <input
            {...register("cardNumber", {
              required: "Card number is required",
              pattern: {
                value: /^\d{12,19}$/,
                message: "Card number must be 12 to 19 digits",
              },
            })}
            placeholder="Card Number"
            className="border p-2 w-full rounded"
          />
          {errors.cardNumber && <p className="text-red-500">{errors.cardNumber.message}</p>}
        </div>

        <div className="flex space-x-2">
          <input
            {...register("expiryMonth", {
              required: "Month is required",
              pattern: {
                value: /^(0[1-9]|1[0-2])$/,
                message: "Month must be between 01 and 12",
              },
            })}
            placeholder="MM"
            className="border p-2 rounded w-16"
          />
          <input
            {...register("expiryYear", {
              required: "Year is required",
              validate: (value) =>
                parseInt(value) >= parseInt(new Date().getFullYear().toString().slice(-2)) ||
                "Year must be this year or later",
            })}
            placeholder="YY"
            className="border p-2 rounded w-16"
          />
        </div>
        {(errors.expiryYear || errors.expiryMonth) && <p className="text-red-500">{errors.expiryYear?.message || errors.expiryMonth?.message}</p>}

        <div>
          <input
            {...register("cvv", {
              required: "CVV is required",
              pattern: {
                value: /^\d{3,4}$/,
                message: "CVV must be 3 or 4 digits",
              },
            })}
            placeholder="CVV"
            className="border p-2 w-full rounded"
          />
          {errors.cvv && <p className="text-red-500">{errors.cvv.message}</p>}
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

export default AddCardForm