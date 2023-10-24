import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase-config";
import {onValue, push, ref} from "firebase/database";

export async function createNewPost(postDetails) {
  onAuthStateChanged(auth,user=>{
    const post ={
        postDetails,
        users:{
            email:user?.email,
            url:user?.photoURL,
            name:user?.displayName,
            id:user?.uid
        },
        likes:0,
        comments:0
    }
    push(ref(db,"posts/"),post)
  })
}

export async function getAllPost(post){
  const postRef = ref(db,"posts/")
  onValue(postRef,posts=>{
    posts === null ? post([]) : post(Object.entries(posts.val()))
  })
}

export async function getPost(id,post){
  const postRef = ref(db,`posts/${id}`)
  onValue(postRef,posts=>{
    posts === null ? post([]) : post((posts.val()))
  })
}
export async function getPostLikes(id,post){
  const likeRef = ref(db,`posts/${id}/posLikes`)
  onValue(likeRef,posts=>{
    posts === null ? post([]) : post(Object.entries(posts.val()))
  })
}
