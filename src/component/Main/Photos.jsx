import { useEffect, useState } from 'react'
import { client } from '../../data/client'
import "../../css/main/photos.css"
import { Link } from 'react-router-dom'
import Loading from '../Others/Loading'
import Error from '../Others/Error'


export default function Photos() {
  const [photos, setPhotos] = useState([])
  const [appState,setAppState] = useState({
      isLoading:true,
      isError:false,
      errorMessage:"",
    })
  useEffect(()=>{
    client.photos.curated({per_page:56}).then(({photos})=>{
      setPhotos(photos)
      setAppState(prev=>{
        return {...prev, isLoading:false}
      })
    }).catch(err=>{
      setAppState(prev=>{
        return {...prev, isLoading:false,isError:true,errorMessage:err.message}
      })
    })
  },[])



  if(appState.isError) return <Error errorMessage={appState.errorMessage}/>

  return (
    <main className='mt-6 '>
      <h2 className='label'>Free Stock Photos</h2>
      {appState.isLoading
      ?
      <Loading/>
      :
      <section className="photo-container">
        {photos.map((photo)=>{
            const {alt,photographer,photographer_id,photographer_url,src,id } = photo
            return(
              <article >
               <Link to={`/photos/${id}`}>
                <img src={src.large2x} alt={alt} className='photo-image' />
               </Link>
              </article>
            )
          })}
      </section>}
      
    </main>
  )
}
