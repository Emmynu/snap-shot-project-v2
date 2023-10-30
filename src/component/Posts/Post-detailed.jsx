import  { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { currentUserID } from "../../data/users"
import { getSinglePosts } from "../../data/posts"

export default function PostDetailed() {
    const { postId } = useParams()
    const [post,setPost] = useState([])
    const [postLikes,setPostLikes] = useState([])

    useEffect(()=>{
        getPost(postId,setPost)
        getPostLikes(postId,setPostLikes)
    },[])
  
    console.log(post);

    return(
      <main>
        
      </main>
    )
}
