import React, { Suspense } from 'react'
import ResetPin from '../components/ResetPin'
import { ClipLoader } from 'react-spinners'

const resetPin = () => {
  return (
    <Suspense fallback={<div className='w-full text-center mt-20'><ClipLoader size={18} color='gray'/></div>}>
        <ResetPin/>
    </Suspense>
  )
}

export default resetPin

// Next.js expects that anything using browser-only features like useSearchParams().
// (which doesn't work in SSR) must be loaded on the client.
//  Since pages in the App Router are rendered on the server by default, 
// this extra step (using <Suspense>) ensures it doesn’t try to SSR parts that shouldn’t be.