import { useState,useEffect } from 'react'
import { upload } from '../../data/upload';
import { push,ref } from 'firebase/database';
import { db } from '../../firebase/firebase-config';
import { Link, useNavigate } from 'react-router-dom';
import { currentUser,currentUserID } from '../../data/users';
import loadingIcon from "../../images/loading.png"
import "../../css/network/upload.css"
import { time,day,month} from "../../data/client"


export default function Upload() {
  const [files,setFiles] = useState(null)
  const [appState,setAppState] = useState("")
  const [description,setDescription] = useState("")
  const [Loading,setLoading] = useState(false)
  const [user,setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    currentUser(setUser)
  },[])

  function uploadFile(e){
    e.preventDefault()
   
    if (files !== null) {
      const checkFileType  = files.type === "image/jpeg" || files.type === "image/jpg" || files.type === "image/png"
      if (checkFileType) {
        upload(files,setAppState).then(res=>{
          setLoading(true) 
          setTimeout(() => {
           
            const uploadData = {
              url:JSON.parse(localStorage.getItem("url")),
              description,
              dateAdded: `${month} ${day} ${time}`
            }
            push(ref(db,`uploads/`+ currentUserID),uploadData).then(res=>{
              setLoading(false)
              setFiles(null)
              setDescription("")
              navigate("/uploads")
            }).catch(err=>{
              setAppState(err.message)
            })
          }, 8100);
        })
      }
      else if(!checkFileType){
        setAppState("Invalid File Format!")
      }

     
    }
    else if(files === null || files === "" ){
      setAppState("Invalid input!")
      setLoading(false)
    }
    setTimeout(() => {
      setAppState("")
    }, 3000);
  }

  return (
    <main className='upload-container border-t'>

      <section className='upload-header'>
        <h2>Upload Pictures</h2>
        <span >
          <Link to={-1}>Discard</Link>
        </span>
      </section>

        <article className='error-container'>
          <h2>{appState}</h2>
        </article>

      <form className='mt-5'>
        <article  className='upload-form-container'>
          <textarea rows="4" cols="40"  value={description} onChange={(e)=>setDescription(e.target.value)} placeholder='Description'> </textarea>
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
        <button onClick={uploadFile}  className='upload-butn'>Upload</button>}
        </article>
      </form>
    </main>
  )
}

