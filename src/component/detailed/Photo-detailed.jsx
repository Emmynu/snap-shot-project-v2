import { useEffect, useState } from 'react'
import { useParams,Link, useNavigate } from 'react-router-dom'
import { client, getSingleImage } from '../../data/client';
import "../../css/detailed/detailed.css"
import { downloadImage } from '../../data/download';
import loadingImage from "../../images/loading.png"
import Error from '../Others/Error';
import { createCollection, getCollection } from '../../data/collection';
import { currentUserID } from '../../data/users';
import Modal from "react-modal"

export default function PhotoDetailed() {
    const { id } = useParams()
    let subtitle;
    const [photos, setPhotos] = useState(null)
    const [loading,setLoading] = useState(false)
    const [isOpen,setIsOpen] = useState(false)
    const [err,setErr] = useState("")
    const [collectionState,setCollectionState] = useState({url:"", showCollectionOptions:false,openNewCollection:false,id:null,openExisitingCollection:false})
    const [collectionTitle,setCollectionTitle] = useState("")
    const [collections,setCollections] = useState([])
    const [isAdded,setIsAdded] = useState(false)
    const navigate = useNavigate()
    const closeBtn={
      width:"20px",
      height:"3px"
    }

    useEffect(()=>{
      getSingleImage(id,setPhotos,setErr)
    },[])

    useEffect(()=>{
      getCollection(setCollections,setLoading,currentUserID)
    },[])


    function openModal() {
      setIsOpen(true)
    }


    function closeModal() {
      setIsOpen(false)
    }

    
  function afterOpenModal(){
    subtitle.style.color = "#fff"
    subtitle.style.opacity = "0.5"
  }

    
    if (err) return <Error errorMessage={err}/>

    function addCollection(url,id) {
      setCollectionState((prev)=>{
        return {...prev,url,showCollectionOptions:true,id}
      })
    }

    function createNewCollection(id,url,title) {
      if(collectionTitle.length>0){
        createCollection(id,url,title).then(setIsAdded(true)).then(res=>navigate("/collections"))
      }

      setTimeout(() => {
        setIsAdded(false)
      }, 3000);
    }

  {return photos!==null &&  (
    <main className='photo-detailed-container relative'>
      
      <section className='photo-detailed-image-container'>
        <span className='back-btn'>
        <Link to={-1}>Back to home</Link>
        </span>
        <img src={photos.src} alt={photos.id} className='cursor-pointer' onClick={openModal}/>
      </section>

      <section className='photo-detailed-label mt-3'> 
        <h2>
            <span className='detailed-label'>Shot by:</span>
            <span className='detailed-content'>{photos.photographer}</span>
        </h2>
        <h2>
            <span className='detailed-label'>PID:</span>
            <span className='detailed-content'>{photos.id}</span>
        </h2>
        <h2>
            <span className='detailed-alt'>{photos.alt}</span>
        </h2>
        <article className='mt-2'>

        <button>
          {loading
          ?
          <img src={loadingImage} className="animate-spin " />
          :
          <button onClick={()=>downloadImage(photos.src,photos.alt,setLoading)} className='remove-all-btn ml-0 text-white bg-emerald-600'>Download</button>

        }
        </button>

        <button className='remove-all-btn ml-3'>
          { localStorage.getItem("access") !== null ||  localStorage.getItem("access") !== undefined 
            ?
            <>
            <span onClick={()=>addCollection(photos.src,photos.id)}>Add To Collection</span>
            </>
            :
            <span><Link to="/login">Add To Collection</Link></span>
        }
        </button>
        </article>
      </section>
     

     { collectionState.showCollectionOptions && <section className="collections-option">
        <div onClick={()=>setCollectionState((pre)=>{return{...pre,showCollectionOptions:false}})} style={closeBtn}>
            <div className="sm-bar sm-bar-1"></div>
            <div className="sm-bar sm-bar-2"></div>
        </div>
        <h2 className='collection-label'>Add Image To</h2>
        <article>
          <h2 onClick={()=>setCollectionState((pre)=>{return{...pre,openExisitingCollection:true}})}>To existing Collections</h2>
          <h2 onClick={()=>setCollectionState((pre)=>{return{...pre,openNewCollection:true}})}>New Collection</h2>
        </article>
      </section>
      }

      { collectionState.openNewCollection&&
        <section className="collections-option">
           <div style={closeBtn} onClick={()=>setCollectionState((pre)=>{return{...pre,openNewCollection:false,openExisitingCollection:false}})}>
            <div className="sm-bar sm-bar-1"></div>
            <div className="sm-bar sm-bar-2"></div>
        </div>
          <h2 className='collection-label mb-2'> New Collection</h2>
          <h2 className="collection-label text-sm  text-emerald-600">{isAdded&&<span>Added to collection</span>}</h2>
          <article className='flex justify-center items-center mt-3 mb-1.5'>
            <label className='collection-label text-sm mr-2'>Label Name:</label>
            <input type="text" name="collection-title"value={collectionTitle} onChange={(e)=>setCollectionTitle(e.target.value)} className='border-2 border-black rounded-md px-1 tracking-wider text-sm text-slate-600'/>
          </article>
          <button onClick={()=>createNewCollection(collectionState.id,collectionState.url,collectionTitle)}className='mt-7'>Create Collection</button>
        </section>
  }
     {collectionState.openExisitingCollection && <section className="collections-option h-fit pb-10">
     <div style={closeBtn} onClick={()=>setCollectionState((pre)=>{return{...pre,openExisitingCollection:false,openNewCollection:false}})}>
            <div className="sm-bar sm-bar-1"></div>
            <div className="sm-bar sm-bar-2"></div>
        </div>
        <h2 className='collection-label mb-2'>Select Collection</h2>
         {/* collection state */}
         <h2 className="collection-label text-sm  text-emerald-600">{isAdded&&<span>Added to collection</span>}</h2>
        <section className='grid grid-cols-4 collection-label text-sm mt-3'>{collections.map(col=>{
          return <div >
            <h2 onClick={()=>createCollection(collectionState.id,collectionState.url,col[0]).then(res=>setIsAdded(true)).then(res=>navigate("/collections"))} className='cursor-pointer hover:text-emerald-600'>{col[0]}</h2>
          </div>
        })}
        </section>
       </section>
      
      }

      <Modal isOpen={isOpen} onAfterOpen={afterOpenModal} onRequestClose={closeModal} className="w-11/12 md:w-6/12 lg:w-1/3 p-4 absolute top-56 left-[50%] translate-x-[-50%] bg-white shadow-slate-100 border border-green-600 outline-none rounded-mdx shadow-md z-[1000%]">
        <p ref={(_subtitle)=>(subtitle = _subtitle)}></p>
        
        <section>
        <img src={photos.src} className="w-full h-[250px] object-cover rounded-mdx" onClick={closeModal}/>
        <p className="text-sm text-slate-600 text-center my-1.5">{photos.alt}</p>
        <button className="p-2 bg-green-600 w-full rounded-mdx text-white mt-2 font-medium hover:brightness-110 "  onClick={()=>downloadImage(photos.src,photos.alt,setLoading)}>Download</button> 
        </section>
      </Modal>

    </main>
  )
  
}
  
}
 