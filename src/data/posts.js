import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase-config";
import {onValue, orderByChild, push, query, ref} from "firebase/database";
// import { serverTimestamp } from "firebase/firestore";
import { currentUserID } from "./users";

export async function savePost(data){
  push(ref(db, "posts/"),data)
}


export async function getPosts(postContainer, loading) {
  loading(true)
  const postRef= query(ref(db,`posts/`),orderByChild("createdAt"))
  onValue(postRef,res=>{
    res.val() !==null ? postContainer(Object.entries(res.val())) :postContainer([])
    loading(false)
  })
}

export async function getPostComments(id,commentContainer) {
  const postRef= ref(db,`posts/${id}/commentedBy`)
  onValue(postRef,res=>{
    res.val() !==null ? commentContainer(Object.entries(res.val())) :commentContainer([])
  })
}

export async function getSinglePosts(postId,postContainer,loading){
  loading(true)
  const postRef = ref(db,`posts/${postId}`)
  onValue(postRef,result=>{
    result.val() !==null? postContainer(result.val()) : postContainer([])
    loading(false)
  })
}