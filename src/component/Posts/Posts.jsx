import {  useState } from "react"
import { Link } from 'react-router-dom'
import "../../scss/posts.css"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import HoverVideoPlayer from "react-hover-video-player"
import { LoadPost } from "../Others/Loading"
import { onSnapshot, query, collection, orderBy } from "firebase/firestore"
import { firestore } from "../../firebase/firebase-config"

export default function Posts() {
    const [posts,setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(false)



const postRef = query(collection(firestore, "posts/"),orderBy("createdAt"))
onSnapshot(postRef,(snapshot)=>{
    const post = []
    snapshot.forEach((data)=>{
       post.push({
        ...data.data(),id:data.id
       })
        setPosts(post)
    })
})


    console.log(posts);
const settings={
    dots:true,
    infinite:true,
    speed:700,
    slidesToshow:1,
    slidesToscroll:1,
}

    return(
        <main>
            {isLoading ? <LoadPost/> : 
            posts.map(post=>{
                return <section className="posts-container">
                      <Link to={`/profile/${post.users.id}`}>
                        <section className="post-profile-cotainer">
                            <div>
                                <img src={post.users.url.slice(1)}/>
                            </div>
                            <section className="ml-3">
                                <h2 className="text-slate-700 font-bold">{`${post.users.name.charAt(0).toUpperCase()}${post.users.name.slice(1)}`}</h2>
                                
                            </section>
                        </section>
                    </Link>
                    <Link>
                    <section className="posts-content-container">
                        <Slider {...settings}>
                        {post.postDetails.map((data)=>{
                            return <main className="posts-content-container w-full">
                                <h2>{data.text}</h2>
                                {data.type==="images"? 
                                    <img src={data.url} className="w-full"/>
                                    :
                                    <HoverVideoPlayer videoSrc={data.url} className="w-full"/>}
                                </main>
                                })}
                        </Slider>
                    </section>

                    <footer className="post-footer">
                        <h2>Likes 0</h2>
                        <h2>Comments 0</h2>
                    </footer>
                    </Link>
                </section>
            })}
        </main>
    )
}
