import { useEffect,useState } from 'react'
import {  NavLink, Outlet } from 'react-router-dom'
import "../../css/main/explore.css"
import AOS from "aos"
import "aos/dist/aos.css"
import { useFetch } from '../../hooks/useFetch'


export default function Explore() {
  const [search,setSearch] = useState("")
  const searchType = localStorage.getItem("searchType")
  const { data,isLoading,isFetching,isError } = useFetch()

 const activeLink={
    backgroundColor:"green",
    padding:"12px 20px",
    color: "white",
    borderRadius:"50px",
    fontWeight:600
 }

 const Active={
  color:"gray"
 }


 useEffect(() => {
  AOS.init();
}, [])

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
        <img src={isLoading||isFetching||isError ? "https://images.pexels.com/photos/7709020/pexels-photo-7709020.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940":data?.urls?.full} className='home-image'/>
          <article className='home-search'>
            <h1 className='home-text'>The Best place to get curated pictures and videos</h1>

            <div className='mt-5'>
              <section>
              <span className='label text-mdx text-white'  onClick={()=>localStorage.setItem("searchType","Photos")} style={searchType===`Photos`? Active:null}>
                  Photos
                </span>
                <span className='label text-mdx text-white' onClick={()=>localStorage.setItem("searchType","Videos")} style={searchType===`Videos`? Active:null}>
                  Videos
                </span>
              </section>

              <input type="text" name=""  className="search-input"  value={search} onChange={(e)=>setSearch(e.target.value)} />

              <span className='remove-all-btn cursor-pointer font-bold -ml-3 bg-slate-700 -mt-1 py-2.5 rounded-s-mdx' onClick={searchPictures}>
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
