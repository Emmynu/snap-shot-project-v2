import { useEffect, useRef, useState } from "react"
import "../../scss/posts.css"
import Modal from "react-modal"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase/firebase-config";
import { getComments, getLikes, getPosts, likePostFunc, postComment, removeComment, removeLike, savePost } from "../../data/posts";
import cameraIcon from "../../images/camera.png"
import testImg from "../../images/test.jpg"
import { currentUser, currentUserID } from "../../data/users";
import Moment from "react-moment";
import { serverTimestamp } from "firebase/database";
import likeIcon from "../../images/unlike.png"
import commentIcon from "../../images/comment.png"
import bookmarkIcon from "../../images/bookmark.png"
import deleteIcon from "../../images/del.png"
import like2Icon from "../../images/like.png"




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
  const [likes,setLikes] = useState([])
  const [hasLiked,setHasLiked] = useState(false)

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
      // console.log(postData);
      savePost(postData)
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


// likes 
async function likePost(id) {
 await getLikes(id,setLikes)
//  console.log("liked");
//  console.log(likes);

  if(likes.length <= 0){
    likePostFunc(id,{
      id:user?.uid,
      name:user?.displayName
    })
    setHasLiked(false)
  }
  else{
    likes.map(like=>{
      if(like[1].id === user?.uid){
        removeLike(id,like[0])
        setHasLiked(true)
       }
       else if(like[1].id !== user?.uid){
        likePostFunc(id,{
          id:user?.uid,
          name:user?.displayName
        })
        setHasLiked(false)
       }
    })
  }
}

  return (
    <>
      <main   className="grid grid-cols-1 md:grid-cols-3 mx-1 md:mx-12 lg:grid-cols-3  mt-8 gap-7  post-container">
        {/* side bar  */}
      {/* <section className="bg-green-600 post-sections hidden md:block"></section> */}
       

      {/* main */}
      <section className="post-main col-span-2 post-sections overflow-scroll">
        <main>
          <header className="post-header">
              <section>
                  <h2>Socials</h2>
              </section>
              <section className="post-header-2">
                  <h2 onClick={openModal}>Add</h2>
                  <h2>Message</h2>
                  <h2>Profile</h2>
              </section>
          </header>

          {/* posts body */}
          <section className="main-post-container">
            {posts.map(post=>{
              return(
                <main className="mt-1.5">
                  <header className="main-post-header mx-1.5 ">
                    <img src={testImg}/>
                    <h2 className="font-bold text-slate-800 text-base -tracking-wide ml-1.5">{post[1]?.user?.name}</h2>
                  </header>
                  <section className="text-sm ml-12 -mt-1.5 text-slate-600">
                    <Moment fromNow>{post[1]?.time % (1000 * 60)}</Moment>
                    </section>

                    <h2 className="m-1.5 text-slate-700 tracking-wide font-medium text-sm md:text-mdx">{seeMore ?`${ post[1]?.caption?.label.slice(0,50)}`: post[1]?.caption?.label} { post[1]?.caption?.label.length > 50 && <span onClick={()=>setSeeMore(!seeMore)} className="text-green-600 italic text-sm cursor-pointer">{seeMore ? "more": "less"}</span>}</h2>
                  
                  <section className="main-post w-[100%] h-[300px] md:h-[400px] object-cover">
                    <img src={post[1].url} className="w-full h-full object-cover "/>
                  </section>

                  <footer className="mt-3 mx-3">
                   <main className="flex items-center justify-between">
                    <section className="flex items-center">
                         <img className="w-[24px] ml-0 cursor-pointer" src={likeIcon} alt="like-icon" onClick={()=>likePost(post[0])}/>
                        <img className="w-[23px] ml-1" src={commentIcon} alt="comment-icon" />
                        
                      </section>
                      <section>
                        <img src={bookmarkIcon} alt="bookmark-icon" />
                      </section>
                   </main>
                   <Likes postId={post[0]}/>
                  <CommentList postId={post[0]}/>

                   <section className="flex mt-3 items-center">
                    <img src={testImg} className="w-[25px] h-[25px] object-cover rounded-[50%]"/>
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
      <section className="bg-purple-600 post-sections">
        <div></div>
        <div></div>
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
      return <section className="flex justify-between items-center ">
          <article className="flex items-center mt-2">
            <img src={testImg} className="rounded-[50%] w-[30px] h-[30px]"/>
          <h2 className="ml-1 font-medium text-mdx ">{comment[1]?.name}</h2>
          <span className="ml-1.5 text-sm tracking-wide text-slate-700">{comment[1]?.comment}</span>
        </article>
        <section>
        {comment[1].id === currentUserID && <img src={deleteIcon} className="w-4 cursor-pointer" onClick={()=>removeComment(postId,comment[0])}/>}
        </section>
      </section>
    })}
  </main>
}

function Likes({postId}){
  const [likes, setLikes] = useState([])

  useEffect(()=>{
    getLikes(postId, setLikes)
  },[])

  return <main>
    <h2 className="text-xs text-slate-600 mt-1 ml-1">{likes.length} {likes.length > 1 ? "Likes" : "Like"}</h2>
  </main>

}