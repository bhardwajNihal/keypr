'use client'
import axios from "axios";
import React from "react"
import { useForm } from "react-hook-form"


interface FormValues {
  site : string;
  username: string;
  password : string
}

const AddPasswordForm = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const onSubmit = async(data: FormValues) => {
    
    console.log("Form Submitted:", data);
    // finally making API call
    try {
      const res = await axios.post("/api/users/add/password",data);
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
            {...register("site", { required: "site is required", minLength: 3 })}
            placeholder="google.com"
            className="border p-2 w-full rounded"
          />
          {errors.site && <p className="text-red-500">{errors.site.message}</p>}
        </div>

        <div>
          <input
            {...register("username", {
              required: "username is required",
            })}
            placeholder="john@gmail.com"
            className="border p-2 w-full rounded"
          />
          {errors.username && <p className="text-red-500">{errors.username.message}</p>}
        </div>

        <div>
          <input
            {...register("password", {
              required: "password is required",
              minLength: {
                value: 6,
                message: "password should be atleast of 6 characters!",
              },
            })}
            type="password"
            placeholder="password"
            className="border p-2 w-full rounded"
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
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

export default AddPasswordForm