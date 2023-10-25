import { useState,useEffect } from 'react'
import { useParams,Link } from  "react-router-dom"
import { deleteUpload,getSingleUpload } from '../../data/uploads'
import "../../css/network/uploads.css"
import loadingImage from "../../images/loading.png"
import { createNewPost } from '../../data/network'


export default function UploadDetailed() {
    const { uid } = useParams()
    const [upload, setUpload] = useState(null)
    const [loading, setLoading] = useState(false)
    const [err, seterr] = useState("")

    useEffect(()=>{
        getSingleUpload(uid,setUpload)
    },[])
  

    function removeUpload(){
        deleteUpload(uid).then(res=>{
            window.location = "/uploads"
        })
    }

    function createPost(){
        const postInfo={
            text:upload?.description,
            url:upload?.url,
            tag:"tag"
        }
        createNewPost(postInfo).then(res=>{
            seterr("Upload Sucessful");
            setLoading(false)
        }).catch(err=>seterr(err.message))

       setTimeout(() => {
         seterr(null)
       }, 2000);
    }
    
  
      {return upload !== null
        ?
      <main  className='photo-detailed-container'>
        <section className='photo-detailed-image-container'>
            <span className='back-btn'>
                <Link to={-1}>Back to home</Link>
            </span>
            {upload.type==="images"?<img src={upload.url.slice(1)} alt={uid}/>:
            <video controls className='w-full'><source src={upload.url.slice(1)}></source></video>}
        </section>

        <article  className='photo-detailed-label mt-5'>
            <h3>
                <span className='detailed-label'>UID:</span>
                <span className='detailed-content'>{uid}</span>
            </h3>
      
            <h3>
                <span className='detailed-label'>DateAdded:</span>
                <span className='detailed-content'>{upload.dateAdded}</span>
            </h3>
            <h2 className='detailed-content tracking-widest'>{upload.description||null}</h2>

            <section className='mt-2'>
                {err}
                <button onClick={removeUpload} className='delete-btn remove-all-btn'>Remove</button>
                <span>
                {                
                loading ? 
                <span className='remove-all-btn ml-0'>
                    <img src={loadingImage}  className=' animate-spin'/>
                </span>
                :
                <button className='publish-btn remove-all-btn' onClick={createPost}>Publish</button>}
                </span>
            </section>
        </article>
      </main>
      :
      null}
}
