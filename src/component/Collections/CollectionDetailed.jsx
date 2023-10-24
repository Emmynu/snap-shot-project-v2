import { useParams,Link,useNavigate } from "react-router-dom"
import { useEffect,useState } from "react";
import { client } from "../../data/client";
import Error from "../Others/Error";
import loadingImage from "../../images/loading.png"
import { deleteCollection } from "../../data/collection";
import { downloadImage } from "../../data/download";

export default function CollectionDetailed() {
    const {collectionId,label,id} = useParams()
    const [collection,setCollection] = useState([])
    const [isError,setIsError] = useState("")
    const [isDownloaded,setIsDownloaded] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
        client.photos.show({id:collectionId}).then(resp=>setCollection({
            id:resp.id,
            alt:resp.alt,
            src:resp.src.large2x,
            photographer:resp.photographer
        })).catch(err=>setIsError(err.message))
    },[])

    if (isError) return <Error errorMessage={isError}/>

  return (
    <main className='photo-detailed-container relative'>
       
       <section className='photo-detailed-image-container'>
        <span className='back-btn'>
        <Link to={-1}>Back to home</Link>
        </span>
        <img src={collection.src} alt={collection.id} />
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

    </main>
  )
}
