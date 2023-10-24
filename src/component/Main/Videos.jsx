import { useState, useEffect} from 'react'
import { client } from '../../data/client'
import { Link } from 'react-router-dom'
import Loading from '../Others/Loading'
import Error from '../Others/Error'
import HoverVideoPlayer from 'react-hover-video-player'

export default function Videos() {
 const [videos, setVideos] = useState([])
  const [appState,setAppState] = useState({
    isLoading:true,
    isError:false,
    errorMessage:""
  })

useEffect(()=>{
  client.videos.popular({per_page:56}).then(({videos})=>{
    setVideos(videos)
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
    <main className='mt-6'>
      <h2 className='label'>Free Stock Videos</h2>
      {appState.isLoading ?<Loading/>:<section className="photo-container">
        {videos.map((video)=>{
            const {image,url, video_files,id } = video
            return(
               
              <article className='mt-5'>
                 <Link to={`/videos/${id}`}>
                <HoverVideoPlayer
                    videoSrc={video_files[0].link}
                    pausedOverlay={
                      <img
                        src={image}
                        alt={id}
                        style={{
                          // Make the image expand to cover the video's dimensions
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        className='photo-image'
                      />
                    }
                    loadingOverlay={
                      <div className="loading-overlay">
                        <div className="loading-spinner" />
                      </div>
                    }
                  />          
                </Link>
              </article>
            )
          })}
      </section>
      }
    </main>
  )
}

