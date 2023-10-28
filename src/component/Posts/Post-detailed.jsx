import  { useParams,Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { currentUserID } from "../../data/users"
import { getSinglePosts } from "../../data/posts"
import HoverVideoPlayer from "react-hover-video-player"
import Slider from "react-slick/lib/slider"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

export default function PostDetailed() {
    const { postId,userId } = useParams()
    const [post,setPost] = useState([])

    useEffect(()=>{
      getSinglePosts(userId,postId,setPost)
    },[])
  
    console.log(post);
    const settings={
      dots:true,
      infinite:true,
      speed:700,
      slidesToshow:1,
      slidesToscroll:1,
  }

  console.log(post);
}
