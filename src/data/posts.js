import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase-config";
import {onValue, push, ref} from "firebase/database";
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
        comments:0
    }
    console.log(post)
    push(ref(db,`posts/${currentUserID}/`),post)
  })
}


export async function getPosts(postContainer) {
  const postRef=ref(db,`posts/`)
  onValue(postRef,res=>{
    res.val() !==null ? postContainer(Object.entries(res.val())) :postContainer([])
  })
}


export async function getSinglePosts(id,postId,postContainer){
  const postRef = ref(db,`posts/${id}/${postId}`)
  onValue(postRef,result=>{
    result.val() !==null? postContainer(result.val()) : postContainer([])
  })
}