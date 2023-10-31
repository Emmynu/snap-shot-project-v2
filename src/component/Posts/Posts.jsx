import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { getPosts } from "../../data/posts"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import HoverVideoPlayer from "react-hover-video-player"
import { LoadPost } from "../Others/Loading"
import "../../scss/posts.css"
import likeIcon from "../../images/like.png"
import commentIcon from "../../images/comment.png"

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

    {return isLoading ? <LoadPost/> :  <main className="mt-7 mx-2 md:mx-7 lg:mx-12">
        <header className="post-header">
            <h2 className=" text-lg md:text-2xl font-semibold tracking-wider mb-2">Trending Uploads <sub>({posts.length})</sub></h2>
           <span className="remove-all-btn ml-0 bg-green-600 text-white "> <Link to={`/new-post`}>Create New Post</Link></span>
        </header>
        <section>{posts.map(post=>{
            console.log(posts);
            
            return <main className="posts-container mt-6">
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
                <section className="posts-content-container ml-5">
                <Slider {...settings}> 
                    {post[1].postDetails?.map((item)=>{
                        return <main className=" w-full">
                            {item?.type==="image"? 
                                <div >
                                    <img src={item?.url} className="w-full h-full object-center object-cover"/>
                                </div>
                                :
                                <div >
                                    <HoverVideoPlayer videoSrc={item?.url} muted={false} style={{width:"100%",height:"100"}} />
                                </div>}
                            </main>
                    })}
                    </Slider>
                </section>
                <footer className="post-footer">
                    <h2 className="flex items-center">
                        <img src={likeIcon} className="w-4"/>
                        <p className="ml-1">Likes {post[1]?.likes}</p>
                    </h2>
                    <h2 className="flex items-center">
                        <img src={commentIcon} className="w-4"/>
                        <p className="ml-1">Comments {post[1]?.comments}</p>
                    </h2> 
                </footer>
            </Link>
            </main>
        })}
        </section>
    </main>}
}
