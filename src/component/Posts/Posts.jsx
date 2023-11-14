import { useEffect, useRef, useState } from "react"
import "../../scss/posts.css"
import Modal from "react-modal"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase/firebase-config";
import { getBookMarks, getComments, getLikes, getPosts, likePostFunc, postComment, removeComment, removeLike, savePost } from "../../data/posts";
import cameraIcon from "../../images/camera.png"
import { currentUser, currentUserID, getFollowers } from "../../data/users";
import Moment from "react-moment";
import { push, serverTimestamp,ref as dbRef, onValue, remove } from "firebase/database";
import likeIcon from "../../images/unlike.png"
import like2Icon from "../../images/like.png"
import commentIcon from "../../images/message.png"
import bookmarkIcon from "../../images/bookmark.png"
import bookmark2Icon from "../../images/bookmark2.png"
import deleteIcon from "../../images/del.png"
import addIcon from "../../images/add.png"
import messageIcon from "../../images/comment.png"
import { Link } from "react-router-dom";
import { signOutUser } from "../nav/header";





export default function Posts() {
  let subtitle;
  const [open,setIsOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [file, setFile] = useState(null)
  const imageRef = useRef(null)
  const [user, setUser] = useState(null)
  const [error, setError] = useState("")
  const [comment, setComment] = useState("")
  const [posts,setPosts] = useState([].reverse())
  const [seeMore, setSeeMore] = useState(true)

  useEffect(()=>{
    currentUser(setUser)
  },[])

  
  useEffect(()=>{
    getPosts(setPosts)
  },[])


  function openModal(){
    setIsOpen(true)
    setSelectedFiles(null)
  }

  function closeModal() {
    setIsOpen(false)
    setSelectedFiles(null)
  }

  function afterOpenModal(){
    subtitle.style.color = "#fff"
    subtitle.style.opacity = "0.5"
  }

  function handleFileUpload(e){
    const reader = new FileReader()
  
    if(e.target.files[0]){
      if(e.target.files[0].type.startsWith("image/") ){
        setFile(e.target.files[0])
       reader.readAsDataURL(e.target.files[0])
      }
      else{
       setError("Invalid File Format");
      }
    }

    reader.onload=(res)=>{
      setSelectedFiles(res.target.result)
    }
  }


  async function createPost(e) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    try {
      const storageRef = ref(storage, `PostBucket/${file?.name}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      const postData ={
        caption:Object.fromEntries(data),
        url,
        time: serverTimestamp(),
        user: {
          id:user?.uid,
          name:user?.displayName,
          url:user?.photoURL
        }
      }
      savePost(postData).then
      (window.location = "/posts")

    } catch (error) {
     setError(error.message);
    }
  }

// comments
async function createComment(id) {
 if (comment.length > 0){
  try {
    postComment(id, {
      id:user?.uid,
      name:user?.displayName,
      url:user?.photoURL,
      comment,
    })
      setComment("")
    } catch (error) {
      console.log(error);
    }
  }
}


  return (
    <>
      <main   className="grid grid-cols-1 md:grid-cols-3 md:max-w-7xl gap-5 mx-auto mt-3 md:mt-8  post-container">
       
      {/* main */}
      <section className="post-main md:col-span-2 ">
        <main>
          <header className="post-header m-7">
              <section>
                  <h2 className="text-[21px] md:text-[23px] text-slate-800 -tracking-wider font-medium">Trending Feeds</h2>
              </section>
              <section className="post-header-2">
                  <h2 onClick={openModal} className="mr-1 cursor-pointer">
                    <img src={addIcon} className="w-6 transition-transform hover:scale-105"  />
                  </h2>
                  <h2>
                    <img src={messageIcon} className="w-6 mx-1 transition-transform hover:scale-105 cursor-pointer"/>
                  </h2>
                  <h2>
                    <img src={user?.photoURL} className="w-[30px] h-[30px] border border-slate-700 object-cover rounded-[50%] ml-1" onClick={signOutUser}/>
                  </h2>
              </section>
          </header>

          {/* posts body */}
          <section className="main-post-container">
            {posts.map(post=>{
              return(
                <main className="mt-1.5">
                  <Link to={`/profile/${post[1].user?.id}`}>
                  <header className="main-post-header mx-1.5 ">
                   <article>
                     <img src={post[1]?.user?.url}/>
                   </article>
                   <article className="ml-1.5">
                   <h2 className="font-bold text-slate-800 text-base -tracking-wide mt-2">{post[1]?.user?.name}</h2>
                   <span className="-mt-12">
                   <Moment fromNow className="text-sm text-slate-600">{post[1]?.time}</Moment>
                   </span>
                   </article>
                  </header>
                  </Link>
                    <h2 className="m-1.5 text-slate-700 tracking-wide font-medium text-sm md:text-mdx">{seeMore ?`${ post[1]?.caption?.label.slice(0,50)}`: post[1]?.caption?.label} { post[1]?.caption?.label.length > 50 && <span onClick={()=>setSeeMore(!seeMore)} className="text-green-600 italic text-sm cursor-pointer">{seeMore ? "more": "less"}</span>}</h2>
                  
                  <section className="main-post w-[100%] h-[300px] md:h-[400px] object-cover">
                    <img src={post[1].url} className="w-full h-full object-cover "/>
                  </section>

                  <footer className="mt-3 mx-3">
                   <main>
                    <section className="flex items-center justify-between">
                      <div><Likes postId={post[0]} userId={user?.uid} name={user?.displayName}/></div>
                      
                      <div><BookMarks postId={post[0]} userId={user?.uid} post={post[1]}/></div>
                      </section>
                      <section>
                       <div><CommentList postId={post[0]}/></div>
                      </section>
                   </main>
               

                   <section className="flex mt-3 items-center">
                    <img src={user?.photoURL} className="w-[25px] h-[25px] object-cover rounded-[50%]"/>
                    <input type="text" name="comment" onChange={(e)=>setComment(e.target.value)} placeholder="Write a comment..." className=" w-[90%] text-sm text-slate-700 ml-2 outline-none p-2" maxLength={100}/>
                    <button onClick={()=>createComment(post[0])} className="text-green-600 font-medium text-base">Post</button>
                    
                   </section>
                  </footer>
                  <hr className="mt-5"/>
                </main>
              )
            })}
          </section>
      </main>
      </section>

      {/* side bar */}
      <section className="bg-white shadow-lg shadow-slate-200 post-sections hidden md:inline-grid md:col-span-1">
       <SideBar />
      </section>
      
    </main>
    
    {/* modal */}
    <Modal isOpen={open} onAfterOpen={afterOpenModal} onRequestClose={closeModal} className="w-11/12 md:w-6/12 lg:w-1/3 p-4 absolute top-56 left-[50%] translate-x-[-50%] bg-white shadow-slate-100 border border-green-600 outline-none rounded-mdx shadow-md">

      <section className="flex flex-col justify-center">
        <main >
          {/* modal confif */}
          <p ref={(_subtitle)=>(subtitle = _subtitle)}></p>
          {/* modal content */}
            <article>
              {selectedFiles ?
              
              <div className="new-post-container">
                  <img src={selectedFiles} className="w-full h-[250px] object-cover rounded-mdx"onClick={closeModal}/>
              </div>
              : 
                <div className="text-center">
                  <h2 onClick={()=>imageRef.current.click()} className="flex justify-center cursor-pointer">
                    <img src={cameraIcon} alt="camera-icon" className="w-[30px]"/>
                  </h2>
                  <h2 className="text-center text-sm font-medium text-red-600 tracking-wider mb-2">{error}</h2>
                    <input type="file" name="" id="" hidden ref={imageRef} accept="image/" multiple={false} onChange={handleFileUpload}/>
                  </div>
                }
                <form onSubmit={createPost}  className="flex flex-col justify-center mt-4">
                  <input type="text" name="label"maxLength={100} placeholder="Please enter your caption..." className="outline-none border-none text-center text-mdx text-slate-700 tracking-wider w-full focus:ring-0"/><br/>
                  <button className="p-2 bg-green-600 w-full rounded-mdx text-white font-medium hover:brightness-110 disabled:bg-slate-300" disabled={!selectedFiles}>Post</button> 
                </form>
          </article>
        </main>
      </section>
    </Modal>
    </>
  )
}


function CommentList({postId}) {
  const [comments, setComments] = useState([])
  const [seeMore, setSeeMore] = useState(true)

  useEffect(()=>{
    getComments(setComments,postId)
  },[])

  return <main className="mt-3">
    {comments.map(comment=>{
      return <section className="flex justify-between items-center">
        <Link to={`/profile/${comment[1]?.id}`}>
          <>
          <article className="flex items-center mt-2">
              <img src={comment[1]?.url} className="rounded-[50%] w-[30px] h-[30px]"/>
            <h2 className="ml-1 font-medium text-mdx ">{comment[1]?.name}</h2>
            <span className="ml-1.5 text-sm tracking-wide text-slate-700">{comment[1]?.comment}</span>
          </article>
          </>
        </Link>
          
        <section>
        {comment[1].id === currentUserID && <img src={deleteIcon} className="w-4 cursor-pointer" onClick={()=>removeComment(postId,comment[0])}/>}
        </section>
      </section>
    })}
  </main>
}

function Likes({postId,userId,name}){
  const [likes, setLikes] = useState([])
  const [hasLiked,setHasLiked] = useState(false)

  useEffect(()=>{
    getLikes(postId, setLikes)
  },[])

  function likePost() {
  if(likes.find(like => like[1].id === userId)){
    setHasLiked(false)
    likes.map(like=>{
     like[1].id === userId && removeLike(postId,like[0])
    })
   
  }
  else{
    setHasLiked(true)
    likePostFunc(postId,{
      id:userId,
      name
    })
  }
  }

  return <main>
     <section className="flex items-center mt-1">
       <img className="w-[24px] ml-0 cursor-pointer transition-transform hover:scale-105" src={!hasLiked ? likeIcon : like2Icon} alt="like-icon" onClick={()=>likePost(postId)}/>
      <img className="w-[22px] ml-1.5 cursor-pointer transition-transform hover:scale-105" src={commentIcon} alt="comment-icon" />
     </section>
    <h2 className="text-xs text-slate-600 mt-1 ml-1">{likes.length} {likes.length > 1 ? "Likes" : "Like"}</h2>
  </main>

}

function BookMarks({postId, userId, post}){
  const [bookmark, setBookmark] = useState([])
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(()=>{
   getBookMarks(setBookmark,userId)
  },[])

  
  function bookMarkPost() {
    if(bookmark.find(item=>item[1]?.postId === postId)){
      setIsBookmarked(false)
      bookmark.map(item=>{
        item[1].postId === postId && remove(dbRef(db, `bookmarks/${userId}/${item[0]}`))
      })
    }
    else{
      push(dbRef(db, `bookmarks/${userId}`),{
        postId,
        post,
      })
      setIsBookmarked(true)
    }
  }
  return <section>
    <img src={isBookmarked ? bookmark2Icon : bookmarkIcon} alt="bookmark-icon"  className="transition-transform cursor-pointer hover:scale-105" onClick={bookMarkPost}/>
  </section>
}


function SideBar(){
  const [followers, setFollowers] = useState([])

  useEffect(()=>{
    getFollowers(currentUserID,setFollowers)
  },[])

  return <main>
    <h2>Followers</h2>
    {followers.length <= 0 ? followers.map(person=>{
      <section>
        <h2>{person[1].name}</h2>
        <button>follow</button>
      </section>
    }): 
    null
    }
     
  </main>
}