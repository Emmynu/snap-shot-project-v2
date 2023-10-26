import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { getPosts } from "../../data/posts"
import "../../scss/posts.css"

export default function Posts() {
    const [posts,setPosts] = useState([])
    const [sliderImage,setsliderImage] = useState([])
    const [sliderIndex,setSliderIndex] = useState(0)

    useEffect(()=>{
        getPosts(setPosts)
    },[])
    // console.log(sliderImage);

    function sliderIndexFunc(index) {
        if (index>sliderImage.length-1) {
            return 0
        } else if(index<0){
            return sliderImage.length-1
        }
        return index
    }

    function increaseSlider(sliderArray) {
        setsliderImage(sliderArray)
        setSliderIndex(prev=>{
            prev= sliderIndex + 1
            return sliderIndexFunc(prev)
        })
    }
    return(
        <main>
            {posts.map(post=>{
                const postContent = Object.entries(post[1])
                return <main >
                    {postContent.map(item=>{
                        return <section className="posts-container">
                            <section>
                                <h2>{item[1].users.name}</h2>
                                <img src={item[1].users.url}/>
                                  
                            </section>
                           
                            <section>
                                {item[1].postDetails[sliderIndex].type==="images"? <img src={item[1].postDetails[sliderIndex].url}/>
                                :
                                <video><source src={item[1].postDetails[sliderIndex].url}></source></video>}
                                <button onClick={()=>increaseSlider(item[1].postDetails,)}>next</button>
                                </section>

                             <footer className="post-footer">
                                <h2>Likes {item[1].likes}</h2>
                                <h2>Comments {item[1].comments}</h2>
                            </footer>
                        </section>
                    })}
                </main>
            })}
        </main>
    )
}
