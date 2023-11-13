import { onAuthStateChanged } from "firebase/auth";
import { auth,db } from "../firebase/firebase-config";
import { onValue, ref } from "firebase/database";

export const currentUserID = localStorage.getItem("access")


export async function currentUser(state) {
  onAuthStateChanged(auth,user=>{
    state(user)    
  })
}

// get allusers from db
export async function getUsers(userContainer,id,loading){
  const userRef = ref(db,`users/${id}`)
  loading(true)
  onValue(userRef,resp=>{
   userContainer(Object.entries(resp.val()))
    loading(false)
  })
}


export function getFollowers(id,followers) {
  const followersRef = ref(db, `followers/${id}`)
  onValue(followersRef,res=>{
    if (res.exists()) {
      followers(Object.entries(res.val()))
      
    }else{ followers([])}
    
    
  })
}