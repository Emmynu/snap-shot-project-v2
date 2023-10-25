import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { currentUser, currentUserID, getUsers } from "../../data/users"
import { LoadProfile } from "../Others/Loading"
import"../../css/auth/profile.css"
import notFoundImg from "../../images/error.gif"
import { getDatabase, increment, update,ref,push, remove } from "firebase/database"
import { db } from "../../firebase/firebase-config"



export default function Profiles() {
    const { userId } = useParams()
    const [user,setUsers] = useState(null)
    const [currentuser,setCurrentUser] = useState(null)
    const [isLoading,setIsLoading] = useState(true)

    useEffect(()=>{
        getUsers(setUsers,userId,setIsLoading)
        currentUser(setCurrentUser)
    },[])

    // console.log(user);

    function followUser(id) {
      user.map((person)=>{
        console.log(person);
      
          if (person[1].followedBy) {
           const followers= Object.entries(person[1]?.followedBy)
          followers.map((follower)=>{
            if (follower[1]?.id===currentuser?.uid) {
              remove(ref(db,`users/${userId}/${id}/followedBy/${follower[0]}`)).then(res=>{
                const updates={}
                updates[`users/${userId}/${id}/followers`] = increment(-1)
                update(ref(getDatabase()),updates)
              })
              console.log(`wvtf`);
            }
         })
         } else {
          const followerDetails={
            name:currentuser?.displayName,
            email:currentuser?.email,
            url:currentuser?.photoURL,
            id:currentuser?.uid
          }
          push(ref(db,`users/${userId}/${id}/followedBy`),followerDetails).then(res=>{
            const updates={}
            updates[`users/${userId}/${id}/followers`] = increment(1)
            update(ref(getDatabase()),updates)
           
          })
         }

      })
       
        
    }

    if (isLoading) return <LoadProfile/>

    return  <>
    {user.length !== null ? 
    <main className="profile-container">
      {user.map(person=>{
        // console.log(person[1].photoURL);
        return <section>
           { <img src={person[1].photoURL} className='profile-photo'/> }
            <article className='text-center mt-6'>
              <h2 className='profile-name'>{person[1].name}</h2>
              <p className='profile-email'>{person[1].id}</p>
              <article  className='text-center my-2'>
                  <h2 className="profile-gittles"><span>Followers</span><span>{person[1].followers}</span></h2>
              </article>

              <button className="update-btn" onClick={()=>followUser(person[0])}>Follow</button>   
              <button className="update-btn ml-2 mt-1 bg-white border-2 border-green-600 text-green-600">Message</button>   
            </article>                
       </section>
      })}
    </main>
    :
    <section className="profile-container text-center">
      <article>
        <img src={notFoundImg} />
        <h2 className="user-not-found-label">User Not Found</h2>
      </article>
    </section>
    }
     
    </>
}
