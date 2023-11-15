import { currentUser, currentUserID, getFollowers, getUsers, getfollowing } from "../../data/users"
import  { useState, useEffect, useRef} from "react"
import notFoundImg from "../../images/error.gif"
import { Link } from "react-router-dom"
import"../../css/auth/profile.css"
import { LoadProfile } from "../Others/Loading"
import profile from "../../images/add-user.png"
import camera from "../../images/camera.png"
import test from "../../images/test.jpg"
import Modal from "react-modal"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { auth, storage } from "../../firebase/firebase-config"
import { updateProfile } from "firebase/auth"
import { getDatabase, update,ref as dbRef } from "firebase/database"
import { getBookMarks } from "../../data/posts"



export default function Profile() {
  let subtitle;
  const [loading, setLoading ] = useState(true)
  const [updating, setUpdating ] = useState(true)
  const [edit, setEdit ] = useState(false)
  const [selected, setSelected ] = useState(false)
  const [image, setImage] = useState(null)
  const [name, setName] = useState("")
  const [users,setUsers] = useState([])
  const [followers,setfollowers] = useState([])
  const [bookmarks,setbookmarks] = useState([])
  const [following,setfollowing] = useState([])
  const profileRef = useRef()

  useEffect(()=>{
    getUsers(setUsers,currentUserID, setLoading)
  },[])

  useEffect(()=>{
    getFollowers(currentUserID, setfollowers)
    getfollowing(currentUserID, setfollowing)
    getBookMarks(setbookmarks,currentUserID)
  },[])



  if (loading) return <LoadProfile />
  
  function openModal(){
    setEdit(true)
    setSelected(null)
  }

  function closeModal(){
    setEdit(false)
  }

  function afterModalOpen(){
    subtitle.style.color = "#fff"
  }

  function handleUpload(e){
    const file = new FileReader()
    if (e.target.files[0]) {
     if(e.target.files[0].type.startsWith("image/")){
      setImage(e.target.files[0])
      file.readAsDataURL(e.target.files[0])
     }
    }

    file.onload =(res=>{
      setSelected(res.target.result)
    })
  }

 async function updateUserProfile(id,user) {
  
  try{
      const storageRef = ref(storage, `uploadBucket/${currentUserID}/${image?.name}`)
      setUpdating(true)
      await uploadBytes(storageRef, image)
      const url = await getDownloadURL(storageRef)
    
      console.log(user);
     updateProfile(auth.currentUser,{
        displayName:  name.length <=0 ? user.name : name,
        photoURL:url
      })
      const updates = {}
      updates[`/users/${currentUserID}/${id}`] = {
        name: name.length <=0 ? user.name : name,
        url,
        email:user.email,
        password:user.password,
        id:currentUserID
      }
      await update(dbRef(getDatabase()), updates)
      setEdit(false)
      setSelected(null)
      setUpdating(false)
    } catch (error) {
      
    }
  
  }

return <>

{users !== null ?<main className="profile-container">
    <section>
        {users.map((user=>{
            return <section>
                <section className="relative">
                <div className="flex flex-col justify-center items-center relative">
                    <img src={user[1]?.url}alt={user[1]?.id} className="profile-img"/>
                </div>
                </section>
                <section className="my-2 text-center">
                    <h3 className="profile-name">{user[1].name}
                    </h3> 
            </section>
            <div onClick={openModal} className="flex bg-green-600 cursor-pointer rounded-mdx justify-center text-white px-3 py-1">
              <img src={profile} className="w-5 " />
              <p className="ml-1 tracking-wide">Edit Profile</p>
              </div>
    
              <section className="profile-actions flex items-center text-center my-4 justify-between md:justify-evenly">
    
                <section>
                    <h2>Followers</h2>
                    <p>{followers.length}</p>
                </section>
    
                <section>
                    <h2>Following</h2>
                    <p>{following.length}</p>
                </section>
    
    
                <Link to={`/bookmarks`}>
                <section>
                    <h2>BookMarks</h2>
                    <p>{bookmarks.length}</p>
                </section>
                </Link>
                </section>

                <Modal isOpen={edit} onAfterOpen={afterModalOpen} onRequestClose={closeModal} className="w-11/12 md:w-6/12 lg:w-1/3 p-4 absolute top-40 left-[50%] translate-x-[-50%] bg-white shadow-slate-100 border border-green-600 outline-none rounded-mdx shadow-md">
                    <p ref={(_subtitle)=>(subtitle = _subtitle)}></p>
                    <section className="flex flex-col justify-center">
                    <div className="flex justify-center">{selected  ? <img src={selected} alt="selected-file" className="w-full h-[250px] object-cover"/> : <img src={camera} onClick={()=>profileRef.current.click()} className="w-[30px] "/>}</div>
                        <input type="file" hidden multiple={false} ref={profileRef} onChange={handleUpload}/>
                        <input type="text" onChange={(e)=>setName(e.target.value)} className="outline-none border-none text-center my-2 text-mdx text-slate-700 tracking-wider w-full focus:ring-0" placeholder="Please enter a name..."/>
                
                        <button className="w-full px-3 py-2 font-medium text-white bg-green-600 " 
                        onClick={()=>updateUserProfile(user[0],user[1])}>{updating ? "Loading": "Update"}</button>
                    </section>
                </Modal>
            </section>
            
        }))}
    </section>

</main>
: 
<section className="profile-container text-center">
    <article>
      <img src={notFoundImg} />
      <h2 className="user-not-found-label">User Not Found</h2>
    </article>
  </section>}
</>
}