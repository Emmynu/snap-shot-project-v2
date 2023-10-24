import { useEffect, useState } from 'react'
import { useParams,Link } from 'react-router-dom'
import { client } from '../../data/client';
import { downloadImage } from '../../data/download';
import loadingImage from "../../images/loading.png"
import Error from '../Others/Error';



export default function PhotoDetailed() {
    const { vid } = useParams()
    const [videos, setVideos] = useState(null)
    const [err,seterr] = useState("")
    const [isDownloaded,setisDownloaded] = useState(false)


    useEffect(()=>{
        client.videos.show({id:vid}).then(resp=>{
            setVideos({
                id:resp.id,
                url:resp.video_files,
                duration:resp.duration
            })

        }).catch(err=>{
            seterr(err.message)
        })
    },[])

    if (err)return <Error errorMessage={err}/>
    
  {return videos !== null &&  (
    <main className='photo-detailed-container'>
      
    <section className='photo-detailed-image-container'>
       <span className='back-btn'>
          <Link to={-1}>Back to home</Link>
        </span>
      <video className="w-full"  controls>
        <source src={videos.url[0].link}></source>
      </video>
    </section>
      <section className='photo-detailed-label'>
        <h2>
            <span  className='detailed-label'>PID:</span>
            <span  className='detailed-content'>{videos.id}</span>
        </h2> <h2>
            <span  className='detailed-label'>Duration:</span>
            <span  className='detailed-content'>{videos.duration} seconds</span>
        </h2>
        {isDownloaded
            ?
            <img src={loadingImage} alt="loading..." className='animate-spin remove-all-btn ml-0 mt-4'/>
            :
          <button onClick={()=>downloadImage(videos.url[0].link,videos.id,setisDownloaded)} className='remove-all-btn ml-0 mt-4 text-white bg-emerald-600'>Download</button>}
      </section>
    </main>
  )
}
  
}
 