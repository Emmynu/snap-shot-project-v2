import { useEffect, useState } from "react"
import { getAllPost } from "../../data/network"
import { Link } from 'react-router-dom'

export default function Posts() {
    const [posts,setPosts] = useState([])

    useEffect(()=>{
        getAllPost(setPosts)
    },[])



  return (
    // <body>
     <main> 
        {posts.map(post=>{
            return <section key={post[0]}>
                <header>
                    <img src={post[1]?.users?.url} alt={post[1]?.users?.id} />
                    <h2>{post[1]?.users?.name}</h2>
                    <h5>{post[1]?.postDetails?.tag}</h5>
                </header>
                <Link  to={`/posts/${post[0]}`}>
                <article>
                    <h1>{post[1]?.postDetails?.text}</h1>
                    <img src={post[1]?.postDetails?.url} alt={post[0]} />
                    <div>
                        <h2>{post[1].likes}</h2>
                        <h2>{post[1].comments}</h2>
                    </div>
                </article>
                </Link>
            </section>
      })}
      </main>
    // </body>
  )
}
