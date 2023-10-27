import  { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { currentUserID } from "../../data/users"
import { getSinglePosts } from "../../data/posts"

export default function PostDetailed() {
    const { postId,userId } = useParams()
    const [post,setPost] = useState([])

    useEffect(()=>{
      getSinglePosts(userId,postId,setPost)
    },[])
  
    console.log(post);

    return(
      <main>
        
      </main>
    )
}
