import { signInWithEmailAndPassword } from 'firebase/auth'
import React,{ useState } from 'react'
import { NavLink,useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebase-config'
import loadingImage from "../../images/loading.png";
import "../../css/auth/auth.css"
import { useFetch } from '../../hooks/useFetch';


export default function Login() {
    const [handleInput, setHandleInput] = useState({
        email:"",
        password:"",
      })
    const [authState, setAuthState] = useState({
        isLoading: false,
        errMessage:null
      })
     const navigate = useNavigate()

      const active={
        textDecoration:"underline"
      }

    // control inputs 
    function handleUserInput(e){
    const {name,value} = e.target
    setHandleInput(prev=>{
        return {...prev, [name]:value}
    })
    }
    // fetch image
    const { data } = useFetch()

    function handleLogin(e){
        e.preventDefault()
        setAuthState({isLoading:true,errMessage:null})
        const { email, password } = handleInput

        email.length > 0 ?
        signInWithEmailAndPassword(auth,email,password).then(({user})=>{
            setAuthState({isLoading:false,errMessage:null}) 
            // save id as token
            localStorage.setItem("access",user.uid)
            // go to home 
            setTimeout(() => {
            navigate("/")
            }, 1000);

        }).catch(err=>{
            setAuthState({isLoading:false,errMessage:err.message})
          }) 
          :
         setAuthState({isLoading:false,errMessage:"Fill out all input field"})

        //  close label
         setTimeout(() => {
          setAuthState({})
        }, 3000);
    }

    // jsx
  return (
    <main className='form-container mb-9'>
        <section>
          <img src={data?.urls?.full} className='w-full object-cover rounded-mdx object-center' style={{height:"290px"}}/>
      </section>

      <form>
        <div className='text-center font-medium text-mdx'>
            <span className="">
                <NavLink style={({isActive})=>isActive?active:null} to="/register" >Register</NavLink>
            </span>
            <span className="ml-1">
                <NavLink style={({isActive})=>isActive?active:null} to="/login">Login</NavLink>
            </span>
        </div>
      <section>
        <h2 className='form-header'>Log in to account </h2>
        <h4 className='error'>{authState.errMessage}</h4>
      </section>

      <section className='input-container'>
            <input type="email" name="email" value={handleInput.email} onChange={handleUserInput} placeholder='user@gmail.com'/>
        </section>

        <section className='input-container'>
            <input type="password" name="password" value={handleInput.password} onChange={handleUserInput} placeholder='user123'/>
        </section>

        <div className={!authState.isLoading? "not-loading" : "loading"}>
        {
        !authState.isLoading ? 
        <button onClick={handleLogin} className='register-btn'>Login</button>
         :
          <img src={loadingImage} alt='loading-image' className='animate-spin'/>
       }
      </div>
      </form>
      
    </main>
  )
}
