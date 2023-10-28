import { onAuthStateChanged } from "firebase/auth";
import { auth, db, firestore } from "../firebase/firebase-config";
import {onValue, orderByChild, push, ref,query, limitToLast} from "firebase/database";
import { currentUserID } from "./users";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

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
       createdAt: serverTimestamp()
    }
   addDoc(collection(firestore, `posts/`),post).catch(err=>{
    console.log(err.message);
   })

  })
}




export async function getSinglePosts(id,postId,postContainer){
  const postRef = ref(db,`posts/${id}/${postId}`)
  onValue(postRef,result=>{
    result.val() !==null? postContainer(result.val()) : postContainer([])
  })
}