import {  db } from "../firebase/firebase-config";
import {onValue, push, ref, remove} from "firebase/database";

export async function savePost(data){
  try {
      push(ref(db, "posts/"),data)
  } catch (err) {
    alert(err.message)
  }
}

export async function likePostFunc(id,data){
  push(ref(db, `likes/` + id ),data)
}

export async function getLikes(id,likeContainer) {
  onValue(ref(db,`likes/${id}`),res=>{
    res.val() !== null ? likeContainer(Object.entries(res.val())): likeContainer([])
  })
}

export async function removeLike(postId,likeId){
 await  remove(ref(db,`likes/${postId}/${likeId}`))
}

export async function getPosts(postContainer) {
  onValue(ref(db, "posts/"),res=>{
    if(res.val() !== null){
      postContainer(Object.entries(res.val()).reverse())
    }
    else{ postContainer([])}
  })
}


export async function postComment(id,data){
  push(ref(db, `comments/${id}`),data)
}

export async function getComments(comment,id){
  onValue(ref(db, `comments/${id}`), res=>{
   res.val() !== null ? comment( Object.entries(res.val())): comment([])
  })
}

export async function removeComment(postId,commentId){
  remove(ref(db,`comments/${postId}/${commentId}`))
}



export async function getBookMarks(bookmarks,id){
  onValue(ref(db, `bookmarks/${id}`),res=>{
    bookmarks(res.val() !== null ? Object.entries(res.val()) : [])
  })
}
