import { onValue, ref, remove } from "firebase/database";
import { db } from "../firebase/firebase-config";
import { currentUserID } from "./users"

// get uploads
export async function getUploads(uploadStateContainer,state,id){
    state(true)
    const uploadRef = ref(db,"uploads/" + id)
    onValue(uploadRef,resp=>{
        resp.val() === null ? uploadStateContainer([]) :  uploadStateContainer(Object.entries(resp.val()))
        state(false)
    })
}

// delete uploads
export async function deleteUpload(id){
    const uploadRef = ref(db,`uploads/${currentUserID}/${id}`)
    remove(uploadRef).catch(err=>{
        console.log(err.statuscode);
    })
}

// get single upload
export async function getSingleUpload(id,uploadStateContainer){
    const uploadRef = ref(db,`uploads/${currentUserID}/${id}`)
    onValue(uploadRef,resp=>{
        uploadStateContainer((resp.val()))
    })
}

// delete all uploads
export function deleteAllUpload(){
    const uploadRef = ref(db,`uploads/${currentUserID}`)
    remove(uploadRef).catch(err=>{
        console.log(err.message);
    })
}