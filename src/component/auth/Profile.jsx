import { currentUserID, getUsers } from "../../data/users"
import  { useState, useEffect} from "react"
import notFoundImg from "../../images/error.gif"
import { Link } from "react-router-dom"
import"../../css/auth/profile.css"
import { LoadProfile } from "../Others/Loading"
import cameraIcon from "../../images/camera.png"
import test from "../../images/test.jpg"



export default function Profile() {
  const [loading, setLoading ] = useState(true)
  const [edit, setEdit ] = useState(false)
  const [users,setUsers] = useState([])

  useEffect(()=>{
    getUsers(setUsers,currentUserID,setLoading)
  },[])

  if (loading) return <LoadProfile />
  console.log(users);

  return  <>
  {users.length !== null ? 
  <main className="profile-container">
    {users.map(user=>{
      return <section>
        <section className="flex flex-row justify-center">
          <img src={test} alt={user[1]?.id} className=" w-[160px] h-[150px] md:w-[250px] md:h-[250px] object-cover rounded-[50%]"/>
          <button>
            <img src={cameraIcon} alt="camera-icon" />
          </button>
        </section>

       
        <form className="flex flex-row justify-center">
          <input type="text"  disabled={!edit} value={user[1]?.name} className="disabled:bg-transparent disabled:text-4xl disabled:font-medium disabled:text-center mt-4 text-slate-700"/>
          <button>write</button>
        </form>
        

        <section className="user-actions-container">
          <div>
            <h2>Followers</h2>
            <h2>20</h2>
          </div>

          <div>
            <h2>Following</h2>
            <h2>40</h2>
          </div>



          <div>
            <h2>BookMarks</h2>
            <h2>10</h2>
          </div>
        </section>
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

  {/* <img src={user[1].photoURL} className='profile-photo'/> 
          <article className='text-center mt-6'>
            <h2 className='profile-name'>{user[1].name}</h2>
            <p className='profile-email'>{user[1].id}</p>
            <button className="update-btn">
              <Link to={`/update-profile`}>Edit Profile</Link>
            </button>   

            <article  className='text-center mt-6'>
                <h2 className="profile-gittles"><span>Followers</span><span>{user[1].followers}</span></h2>
            </article>
          </article>                 */}
