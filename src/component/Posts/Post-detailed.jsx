import  { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getPostComments, getSinglePosts } from "../../data/posts"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import HoverVideoPlayer from "react-hover-video-player"
import { getDatabase, increment, push, ref, remove, update } from "firebase/database"
import { db } from "../../firebase/firebase-config"
import { currentUser } from "../../data/users"
import "../../scss/posts.css"


export default function PostDetailed() {
    const { postId,userId } = useParams()
    const [post,setPost] = useState([])
    const [comment,setComment] = useState("")
    const [user,setuser] = useState([])
    const [comments,setComments] = useState([])
    const [showCommentOptions, setShowCommentOptions] = useState(false)

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
      getPostComments(postId,setComments)
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

    function addComment(e){
      e.preventDefault()
      const commentDetails = [
       { 
        commentedBy:{
          name:user?.displayName,
          email:user?.email,
          url:user?.photoURL.slice(1),
          id:user?.uid
        },
        text:comment}
      ]
      push(ref(db, `posts/${postId}/commentedBy`),commentDetails).then(res=>{
        const updates = {}
        updates[`posts/${postId}/comments`] = increment(1)
        update(ref(getDatabase()),updates)
      })
    }

    function likeComment(id){
      const likeCommentData={
        name: user?.displayName,
        id: user?.uid
      }
      push(ref(db, `post/${postId}/commentedBy/${id}`),likeCommentData).then(res=>{
        const updates = {}
        updates[`posts/${postId}/comments/${id}/commentLike`] = increment(1)
        update(ref(getDatabase()),updates)
      })
    }

    console.log(post);

   {return post !== null && <div className="post-detailed-container w-11/12"><main className="w-full">
      <Link to={`/profile/${post?.users?.id}`}>
      <section className="profile-detailed-container">
        <div className="profile-img-container">
          <img src={post?.users?.url.slice(1)}/>
        </div>
        <div className="profile-content-container">
          <h2 className="text-slate-700">{post?.users?.name}</h2>
          <p>2 minutes ago</p>
        </div>
      </section>
       </Link>
      <section className="post-content">
        <Slider {...settings}>
            {post?.postDetails?.map((info)=>{
              return <main>
                <h2>{info?.text}</h2>
              {info?.type === "image" ? <span><img  src={info?.url}/></span> : <span><HoverVideoPlayer videoSrc={info?.url} muted={false}/></span>}
              </main>
            })}
          </Slider>
       </section>

      <footer className="">
        <section className="post-detailed-footer-container">
          <h2>Likes {post?.likes}</h2>
          <h2>Comments {post?.comments}</h2>
        </section>
        <section className="post-detailed-footer-container child-2">
          <h2 onClick={likePost}>Like</h2>
          <h2>Comment</h2>
          <h2>Share</h2>
        </section>
      </footer>

      {/* comment section */}

      <main>
        <section >
         <span>All Comments</span>
          {comments.map((item)=>{
            console.log(item);
            return <main className="bg-slate-100 px-3 ">
              {item[1].map((cmt)=>{
              return<> <section className="flex justify-between ">
                 <Link to={`/profile/${cmt?.commentedBy?.id}`}>
              <div className="post-comment-container p-1">
               
                <div className="post-comment-url-container">
                  <img src={cmt?.commentedBy?.url}/>
                </div>

                <div className="post-comment-content-container">
                  <h2 >{cmt?.commentedBy?.name}</h2>
                  
                  <p>{cmt.text}</p> 
                </div>
              </div>
              </Link>

              <div className="text-2xl font-bold text-green-600">...</div>
              </section>

              <footer className="flex justify-between items-center px-2 md:px-6 py-1.5">
               <section className="flex ">
                <h2 onClick={()=>likeComment(item[0])}>Like</h2>
                <h2 className="ml-3">Reply</h2>
               </section>

                <section>
                  0
                </section>
              
              </footer>
              </>
            })}
            </main>
          })}
        </section>
        <form>
          <input type="text" value={comment} onChange={(e)=>setComment(e.target.value)}/>
          <button onClick={addComment}>Send</button>
        </form>
      </main>
      
   </main></div>}
}
