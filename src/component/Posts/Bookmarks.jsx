import { useEffect, useState } from "react"
import { getBookMarks } from "../../data/posts"
import { currentUserID } from "../../data/users"
import { Link } from "react-router-dom"
import { ref, remove } from "firebase/database"
import { db } from "../../firebase/firebase-config"
import deleteIcon from "../../images/del.png"


export default function Bookmarks() {
    const [bookmarks, setBookmarks] = useState([])

    useEffect(()=>{
        getBookMarks(setBookmarks,currentUserID)
    },[])


    function removeBookmark(id) {
        remove(ref(db, `bookmarks/${currentUserID}/${id}`))
    }
  return (
   <main className=" grid grid-cols-1 md:grid-cols-2 md:max-w-5xl gap-5 mx-auto mt-3 md:mt-8  shadow-slate-200">
     <section className="col-span-2 bg-white shadow-lg">
     <h1 className="text-[21px] md:text-[23px] mx-4 text-slate-800 -tracking-wider font-medium">Your Bookmarks</h1>
     {bookmarks.map(item=>{
        return <main className="py-2">
            
            <header  className="main-post-header mx-1.5 flex justify-between items-center">
            <Link to={`/profile/${item[1]?.post?.user?.id}`}>
                <section className="flex items-center">
                    
                        <section>
                            <img src={item[1]?.post?.user?.url} />
                        </section>
                        <section>
                            <h2 className="font-bold text-slate-800 text-base -tracking-wide ml-2">{item[1]?.post?.user?.name}</h2>
                        </section>
                      
                </section>
                </Link>
                <section>
                   <button onClick={()=>removeBookmark(item[0])}   className=" cursor-pointer">
                   <img src={deleteIcon} className="w-6"/>
                   </button>
                </section>
            </header>
           
            <Link to={`/posts`}>
            <section> 
                <h2 className="m-1.5 text-slate-700 tracking-wide font-medium text-sm md:text-mdx">{item[1]?.post?.caption?.label}</h2>
            </section>
            <section className="main-post w-[100%] h-[300px] md:h-[500px] object-cover">
                <img src={item[1]?.post?.url} className="w-full h-full object-cover "/>
            </section>
            </Link>
           
        </main>
     })}
    </section>
   </main>
  )
}
