import { useParams,Link,useNavigate } from "react-router-dom"
import { useEffect,useState } from "react";
import { client, getSingleImage } from "../../data/client";
import Error from "../Others/Error";
import loadingImage from "../../images/loading.png"
import { deleteCollection } from "../../data/collection";
import { downloadImage } from "../../data/download";
import Modal from "react-modal"

export default function CollectionDetailed() {
    let subtitle;
    const {collectionId,label,id} = useParams()
    const [collection,setCollection] = useState([])
    const [isError,setIsError] = useState("")
    const [isDownloaded,setIsDownloaded] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
      getSingleImage(collectionId, setCollection,setIsError)
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


    if (isError) return <Error errorMessage={isError}/>

  return (
    <main className='photo-detailed-container relative'>
       
       <section className='photo-detailed-image-container'>
        <span className='back-btn'>
        <Link to={-1}>Back to home</Link>
        </span>
        <img src={collection.src} alt={collection.id} className="cursor-pointer" onClick={openModal}/>
      </section>

      <section className='photo-detailed-label mt-3'> 
        <h2>
            <span className='detailed-label'>Shot by:</span>
            <span className='detailed-content'>{collection.photographer}</span>
        </h2>
        <h2>
            <span className='detailed-label'>PID:</span>
            <span className='detailed-content'>{id}</span>
        </h2>
        <h2>
            <span className='detailed-label'>Label:</span>
            <span className='detailed-content'>{label}</span>
        </h2>
        <h2>
            <span className='detailed-alt'>{collection.alt}</span>
        </h2>

        <div className="mt-2">
        <button>
          {isDownloaded
          ?
          <img src={loadingImage} className="animate-spin " />
          :
          <button onClick={()=>downloadImage(collection.src,collection.alt,setIsDownloaded)} className='remove-all-btn ml-0 text-white bg-emerald-600'>Download</button>

        }
        </button>
        <button onClick={()=>deleteCollection(label, id,setIsError).then(res=>navigate("/collections"))} className='remove-all-btn ml-2 '>Remove</button>
        </div>
        </section>

        <Modal isOpen={isOpen} onAfterOpen={afterOpenModal} onRequestClose={closeModal} className="w-11/12 md:w-6/12 lg:w-1/3 p-4 absolute top-56 left-[50%] translate-x-[-50%] bg-white shadow-slate-100 border border-green-600 outline-none rounded-mdx shadow-md z-[1000%]">
        <p ref={(_subtitle)=>(subtitle = _subtitle)}></p>
        
        <section>
         <img src={collection?.src} className="w-full h-[250px] object-cover rounded-mdx" onClick={closeModal}/>
         <p className="text-sm text-slate-600 text-center my-1.5">{collection?.alt}</p>
         <button className="p-2 bg-green-600 w-full rounded-mdx text-white mt-2 font-medium hover:brightness-110 "  onClick={()=>downloadImage(collection.src,collection.alt,setIsDownloaded)}>Download</button> 
        </section>
        </Modal>
        
    </main>
  )
}
