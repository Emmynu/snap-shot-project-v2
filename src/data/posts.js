import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase-config";
import {onValue, orderByChild, push, query, ref} from "firebase/database";
// import { serverTimestamp } from "firebase/firestore";
import { currentUserID } from "./users";

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
        comments:0,
        createdAt: new Date().getTime()
    }
    push(ref(db,`posts/${currentUserID}/`),post)
  })
}


export async function getPosts(postContainer, loading) {
  loading(true)
  const postRef= query(ref(db,`posts/`),orderByChild("createdAt"))
  onValue(postRef,res=>{
    res.val() !==null ? postContainer(Object.entries(res.val())) :postContainer([])
    loading(false)
  })
}


export async function getSinglePosts(postId,postContainer){
  const postRef = ref(db,`posts/${postId}`)
  onValue(postRef,result=>{
    result.val() !==null? postContainer(result.val()) : postContainer([])
  })
}