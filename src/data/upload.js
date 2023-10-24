import { ref,getDownloadURL,uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase/firebase-config";
import { currentUserID } from "./users";

export async function upload(name,state) {
  const storageRef = ref(storage,  `images/${currentUserID}/${name.name}`)
  const uploadTask = uploadBytesResumable(storageRef,name)

  uploadTask.on("state_changed",(snapShot)=>{

  },
  
  (err)=>{
    state(err.message)
  },
  ()=>{
    getDownloadURL(uploadTask.snapshot.ref).then(url=>{
        localStorage.setItem("url", JSON.stringify(url))
    })
  })
}


