import  { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getSinglePosts } from "../../data/posts"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import HoverVideoPlayer from "react-hover-video-player"
import { getDatabase, increment, push, ref, remove, update } from "firebase/database"
import { db } from "../../firebase/firebase-config"
import { currentUser, getUsers } from "../../data/users"

export default function PostDetailed() {
    const { postId,userId } = useParams()
    const [post,setPost] = useState([])
    const [postLikes,setPostLikes] = useState([])
    const [user,setuser] = useState([])
    

    const settings={
      dots:true,
      infinite:true,
      speed:700,
      slidesToshow:1,
      slidesToscroll:1,
  }
  
    useEffect(()=>{
      getSinglePosts(postId,setPost)
      currentUser(setuser)
    },[])
    


    function likePost() {
      
      if(post?.likeBy){
      const likes = Object.entries(post?.likeBy)
        likes.map((like)=>{
          if (like[1].id === user?.uid) {
            remove(ref(db, `posts/${postId}/likeBy/${like[0]}`)).then(res=>{
              const updates = {}
              updates[`posts/${postId}/likes`] = increment(-1)
              update(ref(getDatabase()),updates)
            })
          }
        })
      }else{
        const userDetails = {
          name: user?.displayName,
          email:user?.email,
          url: user?.photoURL,
          id: user?.uid
        }
        push(ref(db, `posts/${postId}/likeBy`),userDetails).then((res)=>{
          const updates = {}
          updates[`posts/${postId}/likes`] = increment(1)
          update(ref(getDatabase()),updates)
        })
      }
    }

   {return post !== null && <main>
      <section>
        <div>
          <img src={post?.users?.url.slice(1)}/>
        </div>
        <div>
          <h2>{post?.users?.name}</h2>
          <h2>2 minutes ago</h2>
        </div>
      </section>
      <section>
        <Slider {...settings}>
            {post?.postDetails?.map((info)=>{
              return <main>
                <h2>{info?.text}</h2>
              {info?.type === "image" ? <img  src={info?.url}/> : <HoverVideoPlayer videoSrc={info?.url} muted={false}/>}
              </main>
            })}
          </Slider>
       </section>

      <footer>
        <section>
          <h2>Likes {post?.likes}</h2>
          <h2>Comments {post?.comments}</h2>
        </section>
        <section>
          <h2 onClick={likePost}>Like</h2>
          <h2>Comment</h2>
          <h2>Share</h2>
        </section>
      </footer>
      
   </main>}
}
