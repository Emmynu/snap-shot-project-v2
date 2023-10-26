import { useEffect, useId, useState } from "react"
import { upload } from "../../data/upload"
import { createNewPost } from "../../data/posts"
import { Link } from "react-router-dom"
import { currentUserID } from "../../data/users"
import { getDownloadURL, uploadBytes, ref } from "firebase/storage"
import { storage } from "../../firebase/firebase-config"

export default function NewPost() {
  const [text,setText] = useState("")
  const [selectedFiles,setselectedFiles] = useState(null)
  const [filesUrl,setfilesUrl] = useState([])
  const [success,setSuccess] = useState(false)

  const handleFileChange = (e)=>{
    const files=e.target.files
    setselectedFiles([...files])
  }

   const createPost = async (e) =>{
    e.preventDefault()
    for (let i = 0; i < selectedFiles.length; i++) {
      const element = selectedFiles[i];
      const storageRef  = ref(storage,`posts/${currentUserID}/${element.name}`)
      const type = element.type.startsWith("image/")?"images":"videos"
      await uploadBytes(storageRef,element)
      const url = await getDownloadURL(storageRef)
      setfilesUrl(prev=>{
        return [...prev,{url,type,text}]
      })
      
     await setSuccess(true)  
    }

  }



  useEffect(()=>{
    if (success && filesUrl.length===selectedFiles.length) {
      createNewPost(filesUrl)
    } 
  },[filesUrl])


  return (

    <main>
      <form>
        <article>
          <textarea name="text" id={`text${useId}`} cols="30" rows="10" value={text} onChange={(e)=>setText(e.target.value)}></textarea>
        </article>

        <article>
          <input type="file" name="file" id={`file${useId}`} multiple onChange={handleFileChange}/>
        </article>

        <button onClick={createPost}>Create Post</button><br/>
       
      </form>
    </main>
  )
}

 