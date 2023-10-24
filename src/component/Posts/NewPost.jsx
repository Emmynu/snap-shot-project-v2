import { useId, useState } from "react"
import { upload } from "../../data/upload"
import { createNewPost } from "../../data/network"
import { Link } from "react-router-dom"

export default function NewPost() {
  const [text,setText] = useState("")
  const [file,setFile] = useState(null)
  const [uploadState,setUploadState] = useState("")

  const createPost = (e) =>{
    e.preventDefault()
    if(file !== null){
      if (file.type === "image/jpeg"||file.type==="image/jpg"||file.type==="image/png") {
        upload(file,setUploadState).then(res=>{
         setTimeout(() => {
           const postInfo ={
             text,
             url:JSON.parse(localStorage.getItem("url")),
             tag:"tag"
           }
          createNewPost(postInfo).then(res=>{
            setUploadState("Post Added")
          }).catch(err=>setUploadState(err.message))
         }, 8100);
        })
      }else{
        setUploadState("Invalid File Format")
      }
    }else{
      setUploadState("Fill out all fields")
    }
  }

  return (
    <main>
      <h2>{uploadState}</h2>
      <form>
        <article>
          <textarea name="text" id={`text${useId}`} cols="30" rows="10" value={text} onChange={(e)=>setText(e.target.value)}></textarea>
        </article>

        <article>
          <input type="file" name="file" id={`file${useId}`} onChange={(e)=>setFile(e.target.files[0])}/>
        </article>

        <button onClick={createPost}>Create Post</button><br/>
        <span>
          <Link to={`/posts`}>view post</Link>
        </span>
      </form>
    </main>
  )
}

 