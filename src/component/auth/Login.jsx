import { signInWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { Link, Form, useActionData, useNavigation, redirect } from 'react-router-dom';
import { auth } from '../../firebase/firebase-config'
import eyeImage from "../../images/eye.png";
import "../../css/auth/auth.css"


export async function loginAction({ request }) {
 const formdata = await request.formData()
 const data = Object.fromEntries(formdata)
 const values = Object.values(data)
 if(values.includes("")){
  return "Fill out all fields"
 }
 else{
  try {
    const user = await signInWithEmailAndPassword(auth,data.email,data.password)
    console.log(user);
    window.location = "/"
    localStorage.setItem("access", user?.user?.uid)
  } catch (error) {
    return error.message
  }
 }
 return null
}

export default function Login() {

  const [isText, setIsText] = useState(false)
  const state = useActionData()
  const navigation = useNavigation()
    // jsx
    return (
      <Form method='post' className='form-container' replace>
       <header className='form-header'>
         <h2>Welcome Back!</h2>
       </header>
   
   
       <main className='form-input-container'>
         {state && <h2 className='state'>{state}</h2>}
         
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
           <h4>Not a member? <span className='text-green-600'><Link to="/register">Register</Link></span></h4>
         </footer>
       </main>
   
      </Form>
     )
}
