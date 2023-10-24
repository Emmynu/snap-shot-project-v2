import React from 'react'
import { Link } from 'react-router-dom'
import errorImage from '../../images/error.gif'

export default function PageNotFound() {
  return (
    <main className="text-center">
       <div className='flex justify-center'>
            <img src={errorImage}  />
       </div>
       <div className='mt-0'>
        <h2 className='text-base md:text-lg tracking-wider text-slate-700'>Looks like you're lost😭 
        <span className='ml-1 underline tracking-normal'><Link to="/">Go back home</Link></span>
        </h2>
       </div>
    </main>
  )
}
