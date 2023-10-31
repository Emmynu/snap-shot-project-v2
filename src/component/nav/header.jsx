import  {useState } from 'react'
import { Outlet,NavLink } from 'react-router-dom'
import { signOut } from "firebase/auth"
import { auth } from '../../firebase/firebase-config'
import "../../css/nav/nav.css"
import logo from "../../images/logo.png"


const Header = () => {
    const [navState, setNavState] = useState({
        isNavFixed:false,
        showNav:false,
        showAdditionalNav:false
    })

    const active ={
        tranform: "translateX(0%)",
        transition: "all .8s linear",
    }
    const inActive ={
        transition: "all .8s linear",
        transform: "translate(-200%)"
    }
 
    window.addEventListener("scroll",function(){
        let scrollHeight = this.pageYOffset
        scrollHeight >= 70 ? 
        setNavState(prev=>{
            return{...prev,isNavFixed:true}
        }) 
        : 
        setNavState(prev=>{
            return{...prev,isNavFixed:false}
        }) 
    })

    function toggleNav(){
        setNavState(prev=>{
            return {...prev, showNav:!navState.showNav}
        })
    }

    function toggleAdditionalNav(){
        setNavState(prev=>{
            return {...prev, showAdditionalNav:!navState.showAdditionalNav}
        })
    }

    function signOutUser(){
        signOut(auth).then(res=>{
            localStorage.removeItem("access")
            window.location = "/login"
        }).catch(err=>{
            alert("An error occured")
        })
    }


  return (
    <section >
        {/* header goes here */}
      <nav className={!navState.isNavFixed ? "nav-container" : "fixed-nav"}>
       <header className='logo-container'>
        <h2 className='logo'>
            <NavLink to="/">
                {/* <img src={logo}  className='w-9/12'/> */}
                <h2 className="logo">LOGO</h2>
            </NavLink>
        </h2>
       </header>

       <section className='page-container'>
        <span><NavLink to="/">Explore</NavLink></span>
        <span ><NavLink to="/collections">Collecions</NavLink></span>
        <span className='cursor-pointer' onClick={toggleAdditionalNav}>...</span>
        <span className='upload-btn'><NavLink className="text-white" to="upload">Upload</NavLink></span>
       </section>

       { navState.showAdditionalNav && <section className='addiitional-nav' onClick={toggleAdditionalNav}>
            <span>
                <NavLink to="/profile">Profile</NavLink>
            </span>
            <span>
                <NavLink to="/uploads">Uploads</NavLink>
            </span>
            <span>
                <NavLink to="/posts">Trending Uploads</NavLink>
            </span>
            <span>{ localStorage.getItem("access") !== null || localStorage.getItem("access") !== undefined?
              <button onClick={signOutUser}>Sign Out</button>
              :<span><NavLink to="register">Register</NavLink></span>}
              </span>
        </section>}


       {/* navbar */}
       <nav className="bar-container"  onClick={toggleNav}>
        <div className="bar bar-1"></div>
        <div className="bar bar-2"></div>
        <div className="bar bar-3"></div>
       </nav>
      </nav>



        {/* small screen nav */}
        <nav className='small-screen-nav' style={navState.showNav ? active : inActive} >

        <header className='sm-logo-container' >
        <h2 className='logo'>
            <NavLink to="/">
                {/* <img src={logo} className='w-9/12'/> */}
                <h2 className="logo">LOGO</h2>
            </NavLink>
        </h2>
        <nav className="" onClick={toggleNav}>
            <div className="sm-bar sm-bar-1"></div>
            <div className="sm-bar sm-bar-2"></div>
       </nav>
       </header>

       <section className='link-container' onClick={toggleNav}>
        <span>
            <NavLink to="/">Explore</NavLink>
        </span>
        <span>
            <NavLink to="/profile">Profile</NavLink>
        </span>

    <section >
         <span>
            <NavLink to="/uploads">Uploads</NavLink>
        </span>  
       
        <span>
            <NavLink to="/posts">Trending Uploads</NavLink>
        </span>
    </section>

        <hr className='hr'/>
        <article className='auth-container'>
            <div>
              { localStorage.getItem("access") !== null || localStorage.getItem("access") !== undefined ?
              <button onClick={signOutUser}>Sign Out</button>
              :<NavLink to="register">Register</NavLink>}
            </div>
            <div className='ml-3'>
                <NavLink to="upload">Upload</NavLink>
            </div>
        </article>
       </section>
    </nav>


      <Outlet/>

      {/* footer goes here */}
      <footer className='footer mt-3'>
         <h2>{new Date().getFullYear()} &copy; All Rights Reserved</h2> 
      </footer>
    </section>
  )
}

export default Header
