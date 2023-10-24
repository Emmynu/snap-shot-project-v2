import  { useParams } from "react-router-dom"
import { getPost, getPostLikes } from "../../data/network"
import { useEffect, useState } from "react"
import { currentUserID } from "../../data/users"

export default function PostDetailed() {
    const { postId } = useParams()
    const [post,setPost] = useState([])
    const [postLikes,setPostLikes] = useState([])

    useEffect(()=>{
        getPost(postId,setPost)
        getPostLikes(postId,setPostLikes)
    },[])

   function likePost() {
    postLikes.map(like=>{
        if (like[1].likedBy.id===currentUserID) {
            console.log(`liked`);
        } else {
            console.log(`not liked`);
        }
    })
   }

  return (
    <main>
      <section>
        <h2>{post?.postDetails?.text}</h2>
        <h6>{post?.postDetails?.tag}</h6>
        <img src={post?.postDetails?.url}/>
      </section>
      <footer>
        <h2>{post?.likes}</h2>
        <h2>{post?.comments}</h2>

        <section onClick={likePost}>Like</section>
      </footer>
    </main>
  )
}
