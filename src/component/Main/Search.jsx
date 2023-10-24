import  { useEffect, useState } from 'react'
import { useSearchParams,Link } from 'react-router-dom'
import { client } from '../../data/client'
import Loading from '../Others/Loading'
import HoverVideoPlayer from 'react-hover-video-player'
import Error from '../Others/Error'

export default function Search() {
    const [search,setSearch] = useState([])
    const [searchState,setSearchState] = useState({isLoading:true,isError:false,errMessage:""})
    const [params,setParams] = useSearchParams()
    const paramsValue = params.get("text")
    const dataType = params.get("type")


    useEffect(()=>{
        
        if(dataType==="Photos"){
          client.photos.search({ query:paramsValue, per_page:72 }).then(({photos})=>{
            setSearchState({isLoading:false,isError:false,errMessage:""})
                setSearch(photos)
            }).catch(err=>{
                setSearchState({isLoading:false,isError:true,errMessage:err.message})
            })
        }
        else if(dataType==="Videos"){
          client.videos.search({query:paramsValue,per_page:72}).then((videos)=>{
            setSearchState({isLoading:false,isError:false,errMessage:""})
            setSearch(videos.videos)
          }).catch(err=>{
            setSearchState({isLoading:false,isError:true,errMessage:err.message})
        })
        }
    
    },[paramsValue])

  if(searchState.isLoading) return <Loading/>

  if(searchState.isError) return <Error errorMessage={searchState.errMessage}/>


  return (
    <main>
        <header>
            <h2 className='label'>Free {`${paramsValue.charAt(0).toUpperCase()}${paramsValue.slice(1)}`} {dataType}</h2>
        </header>
        {search.length > 0  ? 
         dataType==="Photos" ? <section className='photo-container'>
            { search.map((image)=>{
              const {alt,src,id } = image
              
              return(
                <article>
                  <Link to={`/photos/${id}`}>
                    <img src={src.large2x} alt={alt} className='bg-slate-400 text-slate-600 photo-image'/>
                    </Link>
                </article>
              )
          })}
      </section>:
      dataType==="Videos"&&<section className='photo-container'>
        {search.map((video)=>{
            const {image,url, video_files,id } = video
          return <article>
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
        })}
      </section>:
        
        <section>
        <h2  className="error-message text-base ">No Matching Result</h2>
      </section> }
    </main>
  )
}
