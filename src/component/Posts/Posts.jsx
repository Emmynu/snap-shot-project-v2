import { useEffect, useRef, useState } from "react"
import "../../scss/posts.css"
import Modal from "react-modal"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase/firebase-config";
import { getPosts, savePost } from "../../data/posts";
import cameraIcon from "../../images/camera.png"
import testImg from "../../images/test.jpg"
import { currentUser } from "../../data/users";
import Moment from "react-moment";
import { serverTimestamp } from "firebase/database";


export default function Posts() {
  let subtitle;
  const [open,setIsOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [file, setFile] = useState(null)
  const imageRef = useRef(null)
  const [user, setUser] = useState(null)
  const [error, setError] = useState("")
  const [posts,setPosts] = useState([].reverse())


  useEffect(()=>{
    currentUser(setUser)
  },[])

  
  useEffect(()=>{
    getPosts(setPosts)
  },[])


  // console.log(posts.reverse());

  function openModal(){
    setIsOpen(true)
    // setSelectedFiles(null)
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
      await uploadBytes()
    } catch (error) {
     setError(error.message);
    }
  }


  return (
    <>
      <main   className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mx-3 mt-8 gap-7 post-container">
        {/* side bar  */}
      <section className="bg-green-600 post-sections hidden md:block"></section>
       

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
            {posts.reverse().map(post=>{
              return(
                <main className="mt-3">
                  <header className="main-post-header mx-1.5 ">
                    <img src={testImg}/>
                    <h2 className="font-bold text-slate-800 text-base -tracking-wide ml-1.5">{post[1]?.user?.name}</h2>
                  </header>
                  <section className="text-sm ml-12 -mt-1.5 text-slate-600">
                    <Moment fromNow>{post[1]?.time/10000}</Moment>
                    </section>

                    <h2 className="m-1.5 text-slate-700 tracking-wide font-medium text-sm md:text-mdx">{post[1]?.caption?.label}</h2>
                  
                  <section className="main-post w-[100%] h-[300px] md:h-[400px] object-cover">
                    <img src={post[1].url} className="w-full h-full object-cover "/>
                  </section>

                </main>
              )
            })}
          </section>
      </main>
      </section>

      {/* side bar */}
      {/* <section className="bg-purple-600 post-sections">
        <div></div>
        <div></div>
      </section> */}
      
    </main>
    
    {/* modal */}
    <Modal isOpen={open} onAfterOpen={afterOpenModal} onRequestClose={closeModal} className="w-11/12 md:w-6/12 lg:w-1/3 p-4 absolute top-40 left-[50%] translate-x-[-50%] bg-white shadow-slate-100 border border-green-600 outline-none rounded-mdx shadow-md">

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
                  <button className="p-2 bg-green-600 w-full rounded-mdx text-white font-medium hover:brightness-110 disabled:bg-slate-700" >Post</button> 
                </form>
          </article>
        </main>
      </section>
    </Modal>
    </>
  )
}

