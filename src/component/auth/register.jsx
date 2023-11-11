import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from "../../firebase/firebase-config";
import eyeImage from "../../images/eye.png";
import { push,ref } from 'firebase/database';
import { db } from '../../firebase/firebase-config';
import "../../css/auth/auth.css"
import { Form, Link, redirect, useActionData, useNavigation } from 'react-router-dom';



export async function registerAction({ request }){
  const formData = await request.formData() // more like the FormData Api but using react-router-dom to handle
  const data = Object.fromEntries(formData);
  const formValue = Object.values(data)
  if(formValue.includes("")){
    return "Fill out all fields"
  }
  else{
    try {
      const newUser =  await createUserWithEmailAndPassword(auth,data.email,data.password)
      const updateName = await updateProfile(auth.currentUser,{
       displayName:data.name,
       photoURL: "https://images.pexels.com/photos/19043170/pexels-photo-19043170.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
      })
     
     await push(ref(db, `users/${newUser?.user?.uid}`), {
       name:newUser?.user?.displayName,
       email:newUser?.user?.email,
       password:data.password,
       url:newUser?.user?.photoURL
     })
     window.location = "/login"
   
     } catch (error) {
       return error.message
     }
  }
  
  return null
}

function Register() {
  const [isText, setIsText] = useState(false)
  const state = useActionData()
  const navigation =  useNavigation()

  
  // jsx
  return (
   <Form method='post' className='form-container' replace>
    <header className='form-header'>
      <h2>Create An Account</h2>
    </header>


    <main className='form-input-container'>
      {state && <h2 className='state'>{state}</h2>}
      <section>
        <label htmlFor="name">Username</label><br/>
        <input type="text" name="name" className='input' />
      </section>

      <section>
        <label htmlFor="email">Email</label><br/>
        <input type="email" name="email" className='input' />
      </section>

      <div>
        <label htmlFor="password">Password</label><br/>
       <div className='flex bg-slate-100 border border-slate-600 items-center justify-between mb-3 p-1 rounded-mdx'>{isText ? <input type="text" name="password" className='w-full bg-transparent outline-none'/> : <input type="password" name="password" className='w-full bg-transparent outline-none'/>}
        <span onClick={()=>setIsText(!isText)} className='cursor-pointer'>
        <img src={eyeImage} alt="eye" className='w-5' /></span> </div>
      </div>

      {navigation.state !== "submitting" ? <button className='submit-btn'>Submit</button >: <button className='submit-btn'>Loading...</button>}

      <footer className='form-footer'>
        <h4>Already a member? <span className='text-green-600'><Link to="/login">Login</Link></span></h4>
      </footer>
    </main>

   </Form>
  )
}

export default Register
