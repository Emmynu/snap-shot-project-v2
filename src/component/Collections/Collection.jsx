import { useEffect, useState } from 'react'
import { deleteCollection, deleteCollectionGroup, getCollection, removeAll } from '../../data/collection'
import { downloadImage } from '../../data/download'
import loadingImage from "../../images/loading.png"
import Loading from "../Others/Loading"
import { Link, useSearchParams } from "react-router-dom"
import { currentUserID } from '../../data/users'
import "../../scss/collection.css"


export default function Collection() {
    const [collections, setCollections] = useState([])
    const [filterParams, useFilterParams] = useSearchParams()
    const params = filterParams.get("label")
    const [isDownloaded, setisDownloaded] = useState(false)
    const [isLoading, setisLoading] = useState(false)
    const [isError, setisError] = useState(false)


    useEffect(()=>{
        getCollection(setCollections,setisLoading,currentUserID).catch(err=>{
          setisError(true)
        })
    },[])
    
    
    const filterCollection = params ? collections.filter(collection=>collection[0] === params) : collections
  
  return (
    <main>
      <h2 className='label'>Your Collections</h2>
      {/* values */}
        <section className='mb-7'>
            { isLoading?<Loading/>:collections.length > 0 ?
               <>
              <button className='remove-all-btn' onClick={()=>removeAll(setisError)}>Delete All</button>
                {/* keys */}
                  <section >
                 <div className='collection-keys-container select-none overflow-x-scroll scrollbar-thin scrollbar-thumb-slate-200'>
                  <span className=' collection-keys text-slate-100'><Link to="">All</Link></span>
                    <div className='collection-keys-container'>
                      {collections.map((col)=>{
                    const colKeys = (col[0])
                    return(
                      <h2 className='collection-keys text-slate-100'>
                        <span onClick={()=>deleteCollectionGroup(colKeys)} className='remove-key mr-1'>X</span>
                        <Link className="" to={`/collections/?label=${colKeys}`} >{colKeys}</Link>
                        </h2>
                    )
                  })}
                  </div>
                 </div>
                  </section>
               <section className='photo-container' >
                {
                    filterCollection.map((collection)=>{
                      const colImage = Object.entries(collection[1])
                            return(
                            <>
                              {colImage.map(col=>{
                                return(
                                  <section>
                                    <Link to={`/collections/${col[1].id}/${collection[0]}/${col[0]}`}>
                                    <img src={col[1].url} alt={col[1].id} className='photo-image '/>
                                    </Link>
                                  <p className="text-slate-600 col-label">{collection[0]}</p>
                                  { isDownloaded?
                                    <img src={loadingImage} className='animate-spin' />
                                    :
                                    <button onClick={()=>downloadImage(col[1].url,col[1].id,setisDownloaded)} className='remove-all-btn bg-emerald-600 ml-0 mt-2 text-white mr-3'>
                                      Download
                                      </button>}
                                      <button onClick={()=>deleteCollection(collection[0], col[0],setisError)} className='remove-all-btn ml-0 -mt-1'>Remove</button>
                                </section>
                                )
                              })}
                            </>
                            )
                         })
                }
                </section>
               </>
            
            :
            <div>
            <h2 className="error-message text-base ">Your Collection is empty <span className='add-new'><Link to="/">Add</Link></span></h2>
        </div>}
        </section>
    </main>
  )
}

