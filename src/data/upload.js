import { push,ref } from "firebase/database";
import { db } from "../firebase/firebase-config";
import { currentUserID } from "./users";


export async function upload(data) {
  try {
    push(ref(db, `uploads/${currentUserID}`),data)
  } catch (error) {
    alert(error.message)
  }
}


