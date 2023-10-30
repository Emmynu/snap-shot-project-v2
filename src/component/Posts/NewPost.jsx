import { useEffect, useId, useState } from "react"
import  LoadingIcon from "../../images/loading.png"
import { createNewPost } from "../../data/posts"
import { Link, useNavigate } from "react-router-dom"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../../firebase/firebase-config"

export default function NewPost() {
  const [text,setText] = useState("")
  const [files,setFiles] = useState(null)
  const [uploadState,setUploadState] = useState("")
  const [fileData, setFileData] = useState([])
  const [success, setSuccess] = useState(false)
  const [completed, setCompleted] = useState(false)
  const navigate = useNavigate()

  const createPost = async (e) =>{
    e.preventDefault()
    setCompleted(true)
    if(files !== null){
      // files.type.startsWith("image/")||files.type.startsWith("video/")
     for (let i = 0; i < files.length; i++) {
      const element = files[i];
      console.log(element);
      const storageBucketRef = ref(storage, `postBucket/${element.name}`)
      const result = await uploadBytes(storageBucketRef, element)
      const url = await getDownloadURL(storageBucketRef)
      const type  = element.type.startsWith("image/") ? "image" : "video"
      setFileData(prev=>{
        return [...prev, {url, type, text}]
      })
     await setSuccess(true)
     }
    }else{
      setUploadState("Fill out all fields")
    }
  }

  useEffect(()=>{
    if (success&& files.length === fileData.length) {
      createNewPost(fileData).then(res=>{
        navigate("/posts")
        setCompleted(false)
      })
    }
  },[])


  return (
    <main  className='upload-container border-t'>
       <section className='upload-header'>
        <h2>New Post</h2>
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
          <input type="file" name="file" id={`file${useId}`} multiple onChange={(e)=>setFiles(e.target.files)}/>
        </article>

      { completed ? <img src={LoadingIcon} className="animate-spin w-7"/> :<> <button onClick={createPost}  className='upload-butn'>Create Post</button><br/></>}
        <span>
          <Link to={`/posts`}>view post</Link>
        </span>
      </form>
    </main>
  )
}

 