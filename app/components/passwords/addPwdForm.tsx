'use client'
import axios from "axios";
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";


interface FormValues {
  site : string;
  username: string;
  password : string
}

const AddPasswordForm = () => {

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const onSubmit = async(data: FormValues) => {
    
    console.log("Form Submitted:", data);
    // finally making API call
    try {
      setLoading(true)
      const res = await axios.post("/api/users/add/password",data);
      toast.success(res.data.message);
      setLoading(false);
    } catch (error) {
      console.error("error submitting form data!, ERROR : ",error);
      toast.error("Error submitting form data!");
      setLoading(false);
    }
  }

  return (
    <div className='shadow shadow-purple-900 h-fit p-2 sm:p-4 w-full md:w-2/5 mb-4 rounded'>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <p>site/app name</p>
          <input
            {...register("site", { required: "site is required", minLength: 3 })}
            placeholder="hdfc.netbanking.com"
            className="border p-2 w-full rounded placeholder:text-sm"
          />
          {errors.site && <p className="text-red-800 text-xs sm:text-sm">{errors.site.message}</p>}
        </div>

        <div>
          <p>username</p>
          <input
            {...register("username", {
              required: "username is required",
            })}
            placeholder="john007"
            className="border p-2 w-full rounded placeholder:text-sm"
          />
          {errors.username && <p className="text-red-800 text-xs sm:text-sm">{errors.username.message}</p>}
        </div>

        <div>
          <p>password</p>
          <input
            {...register("password", {
              required: "password is required",
              minLength: {
                value: 6,
                message: "password should be atleast of 6 characters!",
              },
            })}
            type="password"
            placeholder="* * * * * *"
            className="border p-2 w-full rounded placeholder:text-sm"
          />
          {errors.password && <p className="text-red-800 text-xs sm:text-sm">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full text-white px-4 py-2 rounded bg-purple-800 hover:bg-purple-700"
        >
          {(loading) ? <ClipLoader size={"12px"} color="white"/> : "Add"}
        </button>
      </form>

    </div>
  )
}

export default AddPasswordForm