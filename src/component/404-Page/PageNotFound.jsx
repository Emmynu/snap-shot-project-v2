import React from 'react'
import { Link } from 'react-router-dom'
import errorImage from '../../images/error.gif'

export default function PageNotFound() {
  return (
    <main className='mb-4'>
    <div className='flex justify-center w-full'><img src={errorImage}/></div>
  
  <section className="flex justify-center text-lg text-slate-700 font-medium ml-12 -mt-10"  >
    <section className='pr-4 border-r-2 border-slate-800 '>
      <h2>404</h2>
    </section>
    
    <section className='pl-4'>
      <h2>Page Not Found <span className='text-sm text-green-600 underline'><Link to="/">Back</Link></span></h2> 
    </section>
  </section>

  </main>
  )
}
