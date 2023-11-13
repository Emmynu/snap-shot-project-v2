import { LoadProfile } from "../Others/Loading"
import"../../css/auth/profile.css"
import notFoundImg from "../../images/error.gif"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { currentUser, getFollowers, getUsers } from "../../data/users"
import { push, ref, remove } from "firebase/database"
import { db } from "../../firebase/firebase-config"
import followImage from "../../images/add-user.png"
import emailImage from "../../images/email.png"




export default function Profiles() {
 const { userId }  = useParams()
 const [isLoading, setIsLoading] = useState(false)
 const [isFollowing, setIsFollowing] = useState(false)
 const [user, setUser] = useState([])
 const [loggedUser, setLoggedUser] = useState([])
 const [followers, setFollowers] = useState([])

  useEffect(()=>{
    getUsers(setUser,userId,setIsLoading)
    currentUser(setLoggedUser)
  },[])


  useEffect(()=>{
    getFollowers(userId,setFollowers)
  },[])

  
    if (isLoading) return <LoadProfile/>
    
   async function followUser() {
      if (followers.find(user=>user[1]?.id === loggedUser?.uid)) {
        console.log("unfollowed");
        setIsFollowing(false)
       try {
        followers.map(user=>{
        user[1].id === loggedUser?.uid &&  remove(ref(db, `followers/${userId}/${user[0]}`))
        })
       } catch (error) {
        console.log(error.message);
       }
      }
      else{
        setIsFollowing(true)
        console.log("following");
        push(ref(db, `followers/${userId}`),{
          id:loggedUser?.uid,
          name:loggedUser?.displayName
        }).catch(err=>console.log(err.message))
      }
    } 

    return  <>
    {user !== null ? 
    <main className="profile-container">
      {user.map(person=>{
        return (
          <section>
              <div className="flex justify-center items-center"><img src={person[1]?.url} alt={person[1]?.id} className="profile-img"/></div>
              <h2 className="profile-name">{person[1]?.name}</h2>
              <h5 className="profile-id">{person[1]?.id || userId}</h5>
              <footer className="profile-footer">   
                <button className={ !isFollowing ? "bg-green-600" : "bg-slate-400"} onClick={followUser} ><img src={followImage} alt="" /></button>
                <button className="ml-1.5"><img src={emailImage}  /></button>
              </footer>

              <footer className="flex items-center text-center my-4 justify-evenly profile-actions">
                <section>
                  <h2>Followers</h2>
                  <p>{followers.length}</p>
                </section>

                <section>
                  <h2>Following</h2>
                  <p>{followers.length}</p>
                </section>

                <section>
                  <h2>Likes</h2>
                  <p>{followers.length}</p>
                </section>

              </footer>
            </section>
        )
      })}
    </main>
    :
    <section className=" text-center">
      <article>
        <img src={notFoundImg} />
        <h2 className="user-not-found-label">User Not Found</h2>
      </article>
    </section>
    }
     
    </>
}
