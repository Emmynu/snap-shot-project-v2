import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { getPosts } from "../../data/posts"
import "../../scss/posts.css"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import HoverVideoPlayer from "react-hover-video-player"
import { LoadPost } from "../Others/Loading"

export default function Posts() {
    const [posts,setPosts] = useState([])
    const [isLoading,setisLoading] = useState(false)
 

    useEffect(()=>{
        getPosts(setPosts, setisLoading)
    },[])

    const settings={
        dots:true,
        infinite:true,
        speed:700,
        slidesToshow:1,
        slidesToscroll:1,
    }


    {return isLoading ? <LoadPost/> :  <main>
        {posts.map(post=>{
            console.log(post);
            
            return <main className="posts-container">
                 <Link to={`/profile/${post[1].users?.id}`}>
                    <section className="post-profile-cotainer">
                        <div>
                            <img src={post[1].users?.url.slice(1)}/>
                        </div>
                        <section className="ml-3">
                            <h2 className="text-slate-700 font-bold">{`${post[1].users?.name.charAt(0).toUpperCase()}${post[1].users?.name?.slice(1)}`}</h2>
                            <p>2 minutes ago</p>
                        </section>
                    </section>
                </Link>
                <Link to={`/posts/${post[0]}`}>
                <section>
                <Slider {...settings}> 
                    {post[1].postDetails?.map((item)=>{
                        return <main className="posts-content-container w-full">
                            {item?.type==="image"? 
                                <img src={item?.url} className="w-full"/>
                                :
                                <HoverVideoPlayer videoSrc={item?.url} muted={false}      />}
                            </main>
                    })}
                    </Slider>
                </section>
                <footer className="post-footer">
                    <h2>Likes {post[1]?.likes}</h2>
                    <h2>Comments {post[1]?.comments}</h2> 
                </footer>
            </Link>
            </main>
        })}
    </main>}
}
