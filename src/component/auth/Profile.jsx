import { currentUserID, getUsers } from "../../data/users"
import  { useState, useEffect} from "react"
import notFoundImg from "../../images/error.gif"
import { Link } from "react-router-dom"
import"../../css/auth/profile.css"
import { LoadProfile } from "../Others/Loading"



export default function Profile() {
  const [loading, setLoading ] = useState(true)
  const [users,setUsers] = useState([])

  useEffect(()=>{
    getUsers(setUsers,currentUserID,setLoading)
  },[])

  if (loading) return <LoadProfile />

  return  <>
  {users.length !== null ? 
  <main className="profile-container">
    {users.map(user=>{
      return <section>
         { <img src={user[1].photoURL} className='profile-photo'/> }
          <article className='text-center mt-6'>
            <h2 className='profile-name'>{user[1].name}</h2>
            <p className='profile-email'>{user[1].id}</p>
            <button className="update-btn">
              <Link to={`/update-profile`}>Edit Profile</Link>
            </button>   

            <article  className='text-center mt-6'>
                <h2 className="profile-gittles"><span>Followers</span><span>{user[1].followers}</span></h2>
            </article>
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
