import { onValue, push, ref, remove } from "firebase/database"
import { db } from "../firebase/firebase-config"
import { currentUserID } from "./users"


export async function createCollection(id,url,name) {
  if(currentUserID=== null ||currentUserID ===undefined){
    window.location = "/login"
  }
  else{
    const collectionInfo={
        id,
        uid:currentUserID,
        url,
    }

  push(ref(db, `collections/${currentUserID}/${name}`),collectionInfo).catch(err=>alert(err.message))
  }
}


export async function getCollection(collectionContainer,loadingState,id){
    const collectionRef=ref(db, `collections/${id}`)
    loadingState(true)
    onValue(collectionRef,resp=>{
        resp.val() === null ? collectionContainer([]) :   collectionContainer(Object.entries(resp.val()))
        loadingState(false)
    })
}

export async function deleteCollection(name,id,errorState){
    const collectionRef=ref(db,`collections/${currentUserID}/${name}/${id}/`)
    remove(collectionRef).catch(err=>{
        errorState(true)
    })
}

export function removeAll(errorState){
    const collectionRef=ref(db,`collections/`+ currentUserID)
    remove(collectionRef).catch(err=>{
        errorState(true)
    })
}

export async function deleteCollectionGroup(name){
  const collectionRef=ref(db,`collections/${currentUserID}/${name}`)
  remove(collectionRef)
}