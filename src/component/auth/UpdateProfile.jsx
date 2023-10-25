import { Link,useNavigate } from "react-router-dom"
import { useState,useEffect } from "react"
import loadingIcon from "../../images/loading.png"
import { updateProfile } from "firebase/auth"
import { auth } from "../../firebase/firebase-config"
import { upload } from "../../data/upload"
import { getUsers } from "../../data/users"
import { currentUserID } from "../../data/users"
import { getDatabase, ref, update } from "firebase/database"

export default function UpdateProfile() {
    const [name,setName] = useState("")
    const [users,setUsers] = useState([])
    const [file,setfile] = useState("")
    const [loading,setloading] = useState(false)
    const [isFetching,setisFetching] = useState(false)
    const [error,seterror] = useState("")
    const navigate = useNavigate()
    

    useEffect(()=>{
      getUsers(setUsers,currentUserID,setisFetching)
    },[])
  

    function updateUserProfile(e){
        e.preventDefault()
        setloading(true)
        // check file format

        if(name.length > 0 && file!==null){
          if(file.type.startsWith("image/")){
            // upload image to firebase bucket
            upload(file,seterror).then(res=>{
              setTimeout(() => {
                setloading(false)
                // update profile
                updateProfile(auth.currentUser,{
                  displayName:name,
                  photoURL:localStorage.getItem("url")
              }).then(res=>{
                users.map(user=>{
                  console.log(user[1].id);
                //  update profile in db
                  if(currentUserID===user[1].id){
                    const newInfo ={
                      name,
                      photoURL:localStorage.getItem("url").slice(1),
                      email:user[1].email,
                      password:user[1].password,
                      id:user[1].id,
                      followers:user[1].followers
                    }
                    
                    const updates ={}
                    updates[`/users/${currentUserID}/${user[0]}/`] = newInfo
                   return update(ref(getDatabase()), updates)
                  }
                })
              }).then(resp=>{
                navigate("/profile")
              })
              }, 9100);
            }).catch(err=>{
              seterror(err.message)
            })
          }
          else{
            seterror("Invalid file type")
            setloading(false)
          }
        }else{
          seterror("Fill out all field")
          setloading(false)

        }
       
        
    }
  return (
    <main  className='upload-container border-t'>
      <section className='upload-header'>
        <h2>Update Profile</h2>
        <span >
          <Link to={-1}>Discard</Link>
        </span>
      </section>

      <form >
        <h2 className="error">{error}</h2>
      <article  className='upload-form-container'>
            <label htmlFor="name">Username</label>
            <input type="text" name="name" onChange={(e)=>setName(e.target.value)} placeholder="Username"/>
        </article>

        <article  className='upload-form-container'>
            <label htmlFor="file">Profile Picture</label>
            <input type="file" name="file" onChange={(e)=>setfile(e.target.files[0])}/>
        </article>

        <article>
        {loading 
        ?
        <div className=' loading-btn'>
            <img src={loadingIcon} className=' animate-spin'/>
        </div>
        :
        <button  onClick={updateUserProfile} className='upload-butn rounded-mdx'>Submit</button>}
        </article>
      </form>
    </main>
  )
}
