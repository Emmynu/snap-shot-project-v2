import React,{ useEffect, useState } from 'react'
import { deleteAllUpload, getUploads } from '../../data/uploads'
import { Link } from "react-router-dom"
import "../../css/network/uploads.css"
import { currentUserID } from '../../data/users'
import Loading from '../Others/Loading'

export default function Uploads() {
    const [uploads,setUploads] = useState([])
    const [isLoading,setisLoading] = useState(false)

    useEffect(()=>{
        getUploads(setUploads,setisLoading,currentUserID)
    },[])


  // if(isLoading) return <Loading/>
  return (
    <main>
      <section>
        <h2 className='label'>Upload Bucket</h2>
        <button className='remove-all-btn' onClick={deleteAllUpload} disabled={isLoading}>Delete All</button>
      </section>
      {<section>
      {isLoading?<Loading/>:uploads.length > 0 ?
         <section className='photo-container'>
           {uploads.map((upload)=>{
            return(
                <article>
                    <Link to={`/uploads/${upload[0]}`}>
                    <img src={upload[1].url} alt={upload[0]}  className='photo-image'/>    
                    </Link>
                </article>
            )
        })}

         </section>
         :
        <div>
          <h2 className='text-base text-slate-700 text-center font-medium'>Upload  is empty <span className='add-new'><Link to={`/upload`}>Add</Link></span></h2>
        </div>
        }
      </section>}
    </main>
  )
}


