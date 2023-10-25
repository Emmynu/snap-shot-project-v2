import { useEffect,useState } from 'react'
import {  NavLink, Outlet,Link } from 'react-router-dom'
import "../../css/main/explore.css"
import AOS from "aos"
import "aos/dist/aos.css"
import { client } from '../../data/client'


export default function Explore() {
  const [search,setSearch] = useState("")
  const [error,setError] = useState("")
  const [Loading,setLoading] = useState(true)
  const [Image,setImage] = useState("")
  const searchType =localStorage.getItem("searchType")

 const activeLink={
    backgroundColor:"green",
    padding:"12px 20px",
    color: "white",
    borderRadius:"50px",
    fontWeight:600
 }

 const Active={
  color:"white",
  backgroundColor:"black",
  padding:"5px",
  borderRadius:"4px",

 }


 useEffect(() => {
  AOS.init();
}, [])

useEffect(()=>{
  client.photos.random().then(res=>{
    setImage(res?.src?.large2x)
    setLoading(false)
  }).catch(err=>{
    setError(err.message)
    setLoading(false)
  })
},[])

// useEffect(()=>{},[searchType])
if (Loading)return <h2 className='explore-state'>Loading...</h2>
if (error)return <h2 className='explore-state'>{error} <span className='text-base font-normal underline text-emerald-600 ml-2 '><Link to={0}>Try again</Link></span></h2>

  function searchPictures(){
    if(search.length > 0 && searchType !== null){
      window.location = `/search/?text=${search}&type=${searchType}`
    }
  }


  return (
    
    <>
    <main >
      <header className='home-header relative'>

        <section className='home-label'>
        <img src={Image} className='home-image'/>
          <article className='home-search'>
            <h1 className='home-text' data-aos={`fade-right`} data-aos-duration={"3000"}>The Best place to get curated pictures and videos</h1>

            <div className='mt-5'>
              <section>
              <span className='label ml-0 text-mdx text-white cursor-pointer'  onClick={()=>localStorage.setItem("searchType","Photos")} style={searchType===`Photos`? Active:null}>
                  Photos
                </span>
                <span className='label ml-1.5 text-mdx text-white cursor-pointer' onClick={()=>localStorage.setItem("searchType","Videos")} style={searchType===`Videos`? Active:null}>
                  Videos
                </span>
              </section>

              <input type="text" name=""  className="search-input"  value={search} onChange={(e)=>setSearch(e.target.value)} />

              <span className='remove-all-btn cursor-pointer font-bold -ml-3 bg-slate-700 -mt-1 py-2.5 rounded-s-mdx' onClick={searchPictures} style={{backgroundColor:"#0c2f0c"}}>
               Search
              </span>
            </div>
          </article>
        </section>
      </header> 
      <article className='home-navlinks'>
        <span>
          <NavLink style={({isActive})=>isActive?activeLink:null} to="/">Photos</NavLink>
        </span>

        <span>
          <NavLink style={({isActive})=>isActive?activeLink:null} to="videos">Videos</NavLink>
        </span>

        <span>
          <NavLink style={({isActive})=>isActive?activeLink:null} to="collections">Collections</NavLink>
        </span>
      </article>
      
    </main>
    <Outlet/>
    </>
  )
}
