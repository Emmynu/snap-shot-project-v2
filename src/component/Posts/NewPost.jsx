import { useEffect, useId, useState } from "react"
import  LoadingIcon from "../../images/loading.png"
import { onAuthStateChanged } from "firebase/auth";
// import {  } from "../../firebase/firebase-config";
import { Link, useNavigate } from "react-router-dom"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage,auth } from "../../firebase/firebase-config"
import { savePost } from "../../data/posts";

export default function NewPost() {
  const [text,setText] = useState("")
  const [files,setFiles] = useState(null)
  const [uploadState,setUploadState] = useState("")
  const [fileData, setFileData] = useState([])
  const [success, setSuccess] = useState(false)
  const [completed, setCompleted] = useState(false)
  const navigate = useNavigate()


  function handleFiles(e) {
    const files = e.target.files
    setFiles([...files])
  }

  const createPost = async (e) =>{
    e.preventDefault()
    if(files !== null){
     for (let i = 0; i < files.length; i++) {
      setCompleted(true)
      const element = files[i];
      const storageBucketRef = ref(storage, `postBucket/${element.name}`)
      const result = await uploadBytes(storageBucketRef, element)
      const url = await getDownloadURL(storageBucketRef)
      const type  = element.type.startsWith("image/") ? "image" : "video"
      setFileData(prev=>{
        return [...prev, {url, type, text}]
      })
      setSuccess(true)

     }
    }else{
      setUploadState("Fill out all fields")
    }
  }
  useEffect(()=>{

    if (success && files.length === fileData.length) {
      onAuthStateChanged(auth,user=>{
        const post ={
            postDetails:fileData,
            users:{
                email:user?.email,
                url:user?.photoURL,
                name:user?.displayName,
                id:user?.uid
            },
            likes:0,
            comments:0,
            createdAt: new Date().getTime()
        }
      savePost(post).then(res=>{
        setUploadState("New Post Added")
        setCompleted(false)
        navigate("/posts")
      })
      })
      console.log("saved");
    }
  },[fileData.length === files?.length])



  return (
    <main  className='upload-container border-t'>
       <section className='upload-header'>
        <h2 className="">New Post</h2>
        <span >
          <Link to={-1}>Discard</Link>
        </span>
      </section>

      <article className='error-container'>
           <h2>{uploadState}</h2>
      </article>
      
      <form className='mt-5'>
        <article  className='upload-form-container'>
          <textarea name="text" id={`text${useId}`} cols="30" placeholder="Description..." rows="10" value={text} onChange={(e)=>setText(e.target.value)}></textarea>
        </article>

        <article  className='upload-form-container'>
          <input type="file" name="file" id={`file${useId}`} multiple onChange={handleFiles}/>
        </article>

     {completed ? <img src={LoadingIcon} className="w-7 animate-spin"/>: <> <button onClick={createPost}  className='upload-butn'>Create Post</button><br/></>}
        
      </form>
    </main>
  )
}

 