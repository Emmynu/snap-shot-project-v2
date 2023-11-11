import { useEffect,useState } from 'react'
import {  NavLink, Outlet,Link } from 'react-router-dom'
import "../../css/main/explore.css"
import AOS from "aos"
import "aos/dist/aos.css"
import { client } from '../../data/client'
import searchIcon from "../../images/search-icon.png"


export default function Explore() {
  const [search,setSearch] = useState({fileType: "Photos", word: ""})
  const [error,setError] = useState("")
  const [Loading,setLoading] = useState(true)
  const [Image,setImage] = useState("")

 const activeLink={
    backgroundColor:"green",
    padding:"12px 20px",
    color: "white",
    borderRadius:"50px",
    fontWeight:600
 }

 const Active={
  color:"white",
  backgroundColor:"#000",
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
    // setError(err.message)
    setLoading(true)
  })
},[])

// useEffect(()=>{},[searchType])
if (Loading)return <div className='explore-state'>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
</div>
if (error)return <h2 className='explore-state  h-[73vh]  translate-y-[40%]'>{error} <span className='text-base font-normal underline text-emerald-600 ml-2 '><Link to={0}>Try again</Link></span></h2>


function handleSearch(e){
  const {value,name} = e.target
  setSearch(prev=>{
    return {...prev, [name]: value}
  })
}

  function searchFunc(){
    if(search.fileType.length >0 && search.word.length>0){
      window.location = `/search/?text=${search.word}&type=${search.fileType}`
    }
  }



  console.log(search)
  return (
    
    <>
    <main >
  

      <header style={{background:`url(${Image})`}} className='w-full py-[150px] px-[20px] md:px-[100px] h-full object-cover flex justify-center'>
        <section>
        <h1 className='home-text' data-aos={`fade-right`} data-aos-duration={"3000"}>Free stock photo of 90s wallpaper, analog, beautiful flowers</h1>
        <section className='flex justify-center items-center mt-5 '>
          <select value={search.fileType} name="fileType" onChange={handleSearch} className='bg-green-600 text-white p-2 outline-none tracking-wider cursor-pointer '>
            <option >Photos</option>
            <option >Videos</option>
          </select>
          <input type="text" name="word" onChange={handleSearch} className="px-2 outline-none text-sm text-slate-600 tracking-wider border border-slate-700  w-1/2 h-[37px]" placeholder='search....'/>
          
          <img src={searchIcon} onClick={searchFunc} className='p-[3px] cursor-pointer bg-white border border-l-0 w-9 border-slate-700 '/>
        </section>
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



