import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { getPosts } from "../../data/posts"
import "../../scss/posts.css"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import HoverVideoPlayer from "react-hover-video-player"

export default function Posts() {
    const [posts,setPosts] = useState([])
 

    useEffect(()=>{
        getPosts(setPosts)
    },[])

    const settings={

        dots:true,
        infinite:true,
        speed:700,
        slidesToshow:1,
        slidesToscroll:1,
        autoplay:true,
        pauseOnHover:true
    }

   
    return(
        <main>
            {posts.map(post=>{
                const postContent = Object.entries(post[1])
                return <main >
                    {postContent.map(item=>{
                        console.log(item);
                        // console.log(item[1].users);
                        return <section className="posts-container">
                            <Link to={`/profile/${item[1].users.id}`}>
                            <section className="post-profile-cotainer">
                                <div>
                                    <img src={item[1].users.url.slice(1)}/>
                                </div>
                                <section className="ml-3">
                                    <h2 className="text-slate-700 font-bold">{`${item[1].users.name.charAt(0).toUpperCase()}${item[1].users.name.slice(1)}`}</h2>
                                    <p>2 minutes ago</p>
                                </section>
                            </section>
                           </Link>
                           <Link to={`/posts/${post[0]}/${item[0]}`}>
                            <section>
                            <Slider {...settings}> 

                                {item[1].postDetails.map((post)=>{
                                    // console.log(post);
                                    return <main className="posts-content-container w-full">
                                        {post.type==="images"? 
                                            <img src={post.url} className="w-full"/>
                                            :
                                            <HoverVideoPlayer videoSrc={post.url}/>}
                                        </main>
                                })}
                                </Slider>
                            </section>

                             <footer className="post-footer">
                                <h2>Likes {item[1].likes}</h2>
                                <h2>Comments {item[1].comments}</h2>
                            </footer>

                            </Link>
                        </section>
                    })}
                </main>
            })}
        </main>
    )
}
