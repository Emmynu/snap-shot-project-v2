import  { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getPostComments, getSinglePosts } from "../../data/posts"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import HoverVideoPlayer from "react-hover-video-player"
import { getDatabase, increment, push, ref, remove, update } from "firebase/database"
import { db } from "../../firebase/firebase-config"
import { currentUser, currentUserID } from "../../data/users"
import "../../scss/posts.css"
import likeIcon from "../../images/like.png"
import commentIcon from "../../images/comment.png"
import unlikeIcon from "../../images/unlike.png"
import { LoadPost } from "../Others/Loading"

export default function PostDetailed() {
    const { postId,userId } = useParams()
    const [post,setPost] = useState([])
    const [comment,setComment] = useState("")
    const [user,setuser] = useState([])
    const [comments,setComments] = useState([])
    const [commentLikes,setCommentLikes] = useState(0)
    const [showCommentOptions, setShowCommentOptions] = useState(false)
    const [Id, setId] = useState(false)
    const [edit, setEdit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const settings={
      dots:true,
      infinite:true,
      speed:700,
      slidesToshow:1,
      slidesToscroll:1,
  }
  
    useEffect(()=>{
      getSinglePosts(postId,setPost,setIsLoading)
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
      comments.map((item)=>{
        if (id === item[0]) {
          item[1].map((i)=>{
            if(i?.commentLikes){
              const Likes = Object.entries(i?.commentLikes)
              Likes.map((like)=>{
                console.log(like[1].id);
                if(like[1].id === currentUserID){
                  remove(ref(db, `posts/${postId}/commentedBy/0/${like[0]}`)).then(res=>{
                    const updates = {}
                    updates[`posts/${postId}/commentedBy/${id}/0/commentLikeCount`] = increment(1)
                    update(ref(getDatabase()),updates)
                  })
                }
               
              })
            }
            else{
              const likeCommentData={
                name: user?.displayName,
                id: user?.uid
              }
              push(ref(db, `posts/${postId}/commentedBy/${id}/0/commentLikes`),likeCommentData).then(res=>{
                const updates = {}
                updates[`posts/${postId}/commentedBy/${id}/0/commentLikeCount`] = increment(1)
                update(ref(getDatabase()),updates)
              })
            }
          })
        }
       
      })
    }

   function commentFunc(id) {
    setShowCommentOptions(!showCommentOptions)
    setId(id)
   }
   function cancelCommentOptions() {
    setEdit(false)
    setId("")
    setShowCommentOptions(false)
   }

   function deleteComment() {
    remove(ref(db,`posts/${postId}/commentedBy/${Id}`)).catch(err=>{
      console.log(err.message);
    })
   }

   function editComment(){
    // setEdit(true)
    const updates = {}
    updates[`posts/${postId}/commentedBy/${Id}/0/text`] = comment
    update(ref(getDatabase()),updates).then(setEdit(false))
   }



   if (isLoading) return <LoadPost/>


   {return post !== null && <div className="post-detailed-container w-full md:w-11/12"><main className="w-full">
      <Link to={`/profile/${post?.users?.id}`  }>
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

      <footer className="mb-5">
        <section className="post-detailed-footer-container">
          <h2>
            <p className="ml-1">Likes {post?.likes}</p>
          </h2>
          <h2>Comments {comments?.length}</h2>
        </section>

        <section className="post-detailed-footer-container justify-between md:justify-evenly">
          <h2 onClick={likePost} className="flex items-center">
            <img src={unlikeIcon} className="w-5"/>
            <p className="ml-1">Like</p>
          </h2>
          <h2 className="flex items-center">
            <img src={commentIcon} className="w-5"/>
            <p className="ml-1">Comments</p>
          </h2>
          <h2>Share</h2>
        </section>
      </footer>

      {/* comment section */}

      <main className="relative">
        <section >
         <span className="text-slate-700 tracking-wide font-medium text-mdx ml-2  mb-1">All Comments</span>
          {comments.map((item)=>{
        
            return <main className="bg-slate-100 px-3 mb-3 ">
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

             {cmt?.commentedBy?.id === user?.uid && <div className="text-2xl font-bold text-green-600" onClick={()=>commentFunc(item[0])}>...</div>}
              </section>

              <footer className="flex justify-between items-center px-2 md:px-6 py-1.5 text-sm text-slate-700 tracking-wider">
               <section className="flex ">
                <h2>Like</h2>
                <h2 className="ml-2">Reply</h2>
               </section>

                <section className="flex items-center">
                  <img src={likeIcon} className="w-4"/>
                  <p className="ml-1">{commentLikes}</p>
                </section>
              
              </footer>
              </>
            })}
            </main>
          })}
        </section>
        <form className="mt-4 flex items-center justify-center">
          <input type="text" value={comment} onChange={(e)=>setComment(e.target.value)} className="border border-slate-800 rounded-mdx px-3 py-1 text-sm "/>
        {!edit ?  <button onClick={addComment}>Send</button> : <button onClick={editComment}>Edit Comment</button>}
        </form>
      </main>
      
      <section className="flex justify-center">
        {showCommentOptions && <article className="comment-options-container w-11/12 md:w-7/12">
            <h2 onClick={()=>setEdit(true)} className="bg-green-600 text-white">Edit</h2>
            <h2 onClick={deleteComment} className="border-2 border-green-600 text-green-600">Delete</h2>

            <button onClick={cancelCommentOptions}>Cancel</button>
          </article>}
      </section>
   </main></div>}
}
