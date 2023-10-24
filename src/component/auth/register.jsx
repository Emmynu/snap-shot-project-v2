import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from "../../firebase/firebase-config";
import loadingImage from "../../images/loading.png";
import { push,ref } from 'firebase/database';
import { db } from '../../firebase/firebase-config';
import "../../css/auth/auth.css"
import { NavLink,useNavigate } from 'react-router-dom';



const active={
  textDecoration:"underline"
}

function Register() {
  const [handleInput, setHandleInput] = useState({
    name:"",
    email:"",
    password:"",
  })
  const [authState, setAuthState] = useState({
    isLoading: false,
    errMessage:null
  })
  const navigate = useNavigate()

  function handleUserInput(e){
    const {name,value} = e.target
    setHandleInput(prev=>{
      return {...prev, [name]:value}
    })
  }


  function handleSubmitWihForm(e){
    e.preventDefault()
    const {name,email,password} = handleInput
    setAuthState({isLoading:true,errMessage:null})

    email.length > 0 && password.length > 0 && name.length > 0
    ?
    
    createUserWithEmailAndPassword(auth, email, password).then(({user})=>{
      // update name and photo  
        updateProfile(auth.currentUser,{
          displayName: name,
          photoURL: "https://source.unsplash.com/random/200x200?sig=1"
        }).then(res=>{
          // save user to db
          const userInfo={
            id:user.uid,
            name:user.displayName,
            photoURL:user.photoURL,
            email:user.email,
            password,
            followers:0,
          }
          push(ref(db,`users/${user?.uid}`),userInfo)
        })
        setAuthState({isLoading:false,errMessage:null}) 
        navigate("/login")
      }).catch(err=>{
        setAuthState({isLoading:false,errMessage:err.message})
      }) 
    :
    setAuthState({isLoading:false,errMessage:"Fill out all input field"})

    // close label
    setTimeout(() => {
      setAuthState({})
    }, 3000);
  }



  // jsx
  return (
    <form className='form-container'>
      <section>
          <img src="https://source.unsplash.com/random/200x200?sig=1" alt="" className='w-full object-cover rounded-mdx object-center' style={{height:"300px"}}/>
      </section>

      
     <article>
     <div className='text-center font-medium text-mdx'>
            <span className="">
                <NavLink style={({isActive})=>isActive?active:null} to="/register" >Register</NavLink>
            </span>
            <span className="ml-1">
                <NavLink style={({isActive})=>isActive?active:null} to="/login">Login</NavLink>
            </span>
        </div>
        <header>
            <h2 className='form-header'>Create an account</h2>
            <h4 className='error'>{authState.errMessage}</h4>
        </header>

        <section className='input-container'>
            <input type="text" name="name" value={handleInput.name} onChange={handleUserInput} placeholder='Username'/>
        </section>

        <section  className='input-container'>
            <input type="email" name="email" value={handleInput.email} onChange={handleUserInput} placeholder='user@gmail.com'/>
        </section>

        <section  className='input-container'>
            <input type="password" name="password" value={handleInput.password} onChange={handleUserInput} placeholder='user123'/>
        </section>

        <div className={!authState.isLoading? "not-loading" : "loading"}>
        {
        !authState.isLoading ? 
          <button onClick={handleSubmitWihForm} className='register-btn'>Register</button>
         :
          <img src={loadingImage} alt='loading-image' className='animate-spin'/>
       }
      </div>
      </article>

    
    </form>
  )
}

export default Register
