import { useEffect, useState } from 'react'
import { deleteAllUpload, getUploads } from '../../data/uploads'
import { Link, useSearchParams } from "react-router-dom"
import "../../css/network/uploads.css"
import { currentUserID } from '../../data/users'
import Loading from '../Others/Loading'
import HoverVideoPlayer from 'react-hover-video-player'
import "../../scss/uploads.css"



export default function Uploads() {
    const [uploads,setUploads] = useState([])
    const [isLoading,setisLoading] = useState(false)
    const [params,setParams] = useSearchParams()
    const fileType=params.get("type")

    useEffect(()=>{
        getUploads(setUploads,setisLoading,currentUserID)
    },[])

    
    const filterUploads = fileType !== null ? uploads.filter(upload=>upload[1].type===fileType):uploads


  return (
    <main>
      <section>
        <h2 className='label'>Upload Bucket</h2>
        <button className='remove-all-btn' onClick={deleteAllUpload} disabled={isLoading}>Delete All</button>
      </section>
      <section className='ml-2 my-2 md:ml-5 lg:ml-10'>
        <span className=' upload-keys text-slate-100'><Link to={``}>All</Link></span>
        <span className=' upload-keys text-slate-100'><Link to={`?type=images`}>Images</Link></span>
        <span className=' upload-keys text-slate-100'><Link to={`?type=video`}>Videos</Link></span>
      </section>
      {<section className='mt-4'>
      {isLoading?<Loading/>:uploads.length > 0 ?
         <section className='photo-container'>
           {filterUploads.map((upload)=>{
            return(
                <article>
                    <Link to={`/uploads/${upload[0]}`}>
                   {upload[1].type=== "images"? <img src={upload[1].url.slice(1)} alt={upload[0]}  className='photo-image'/> : 
                   <HoverVideoPlayer videoSrc={upload[1].url.slice(1)} className='photo-image'/>
                   }   
                    </Link>
                    {/* <button></button> */}
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


