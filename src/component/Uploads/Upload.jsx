import { useState,useEffect } from 'react'
import { upload } from '../../data/upload';
import { storage } from '../../firebase/firebase-config';
import { Link, useNavigate } from 'react-router-dom';
import {currentUserID } from '../../data/users';
import loadingIcon from "../../images/loading.png"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import "../../css/network/upload.css"
import { serverTimestamp } from 'firebase/database';



export default function Upload() {
  const [files,setFiles] = useState(null)
  const [appState,setAppState] = useState("")
  const [description,setDescription] = useState("")
  const [Loading,setLoading] = useState(false)
  const navigate = useNavigate()


async  function uploadFile(e){
    e.preventDefault()
    if(files!==null){
      setLoading(true)
    if(files.type.startsWith("image/") ||  files.type.startsWith("video/")){
      const storageRef = ref(storage, `uploadBucket/${currentUserID}/${files.name}`)
      await uploadBytes(storageRef, files)
      const url  = await getDownloadURL(storageRef)
      upload({
        url,
        type: files.type.startsWith("image/") ? "images" : "video",
        time: serverTimestamp(),
        description
    })
     setLoading(false)
     navigate("/uploads")

    }
    else{
      setAppState("Invalid File Format. Please ensure selected file is an image or video")
      setLoading(false)
    }
    }
    else{
      setAppState("Please select a file")
    }
  }

  return (
    <main className='upload-container border-t'>

      <section className='upload-header'>
        <h2>Upload Files</h2>
        <span >
          <Link to={-1}>Discard</Link>
        </span>
      </section>

        <article className='error-container mt-2'>
          <h2>{appState}</h2>
        </article>

      <form className='mt-5'>
        <article  className='upload-form-container'>
          <textarea rows="5" cols="40"  value={description} onChange={(e)=>setDescription(e.target.value)} placeholder='Please enter a caption...'> </textarea>
        </article>
        <article  className='upload-form-container'>
          <input type="file" name="file" onChange={(e)=>setFiles(e.target.files[0])}/>
        </article>

        <article>
        {Loading 
        ?
      <div className=' loading-btn'>
          <img src={loadingIcon} className=' animate-spin'/>
      </div>
        :
        <button  className='upload-butn' onClick={uploadFile}>Upload</button>}
        </article>
      </form>
    </main>
  )
}

