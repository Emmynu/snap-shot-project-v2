import { useState,useEffect } from 'react'
import { useParams,Link } from  "react-router-dom"
import { deleteUpload,getSingleUpload } from '../../data/uploads'
import "../../css/network/uploads.css"
import Modal from 'react-modal'
import Moment from 'react-moment'


export default function UploadDetailed() {
    let subtitle;
    const { uid } = useParams()
    const [upload, setUpload] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [err, seterr] = useState("")

    useEffect(()=>{
        getSingleUpload(uid,setUpload)
    },[])
  

    function removeUpload(){
        deleteUpload(uid).then(res=>{
            window.location = "/uploads"
        })
    }

    function openModal(){
        setIsOpen(true)
      }
    
      function closeModal() {
        setIsOpen(false)
      }
    
      function afterOpenModal(){
        subtitle.style.color = "#fff"
        subtitle.style.opacity = "0.5"
      }
    
  
      {return upload !== null
        ?
      <main  className='photo-detailed-container'>
        <section className='photo-detailed-image-container cursor-pointer'>
            <span className='back-btn'>
                <Link to={-1}>Back to home</Link>
            </span>
            {upload.type==="images"?<img src={upload.url} alt={uid} onClick={openModal}/>:
            <video controls className='w-full' onClick={openModal}><source src={upload.url}></source></video>}
        </section>

        <article  className='photo-detailed-label mt-5'>
            <h3>
                <span className='detailed-label'>UID:</span>
                <span className='detailed-content'>{uid}</span>
            </h3>
      
            <h3>
                <span className='detailed-label'>Added:</span>
                <span className='detailed-content'>
                    <Moment fromNow>{upload?.time}</Moment>
                </span>
            </h3>
            <h2 className='detailed-content tracking-widest'>{upload.description||null}</h2>

            <section className='mt-2'>
                {err}
                <button onClick={removeUpload} className='delete-btn  remove-all-btn'>Remove</button>
            </section>
        </article>
        <Modal isOpen={isOpen} onAfterOpen={afterOpenModal} onRequestClose={closeModal} className="w-11/12 md:w-6/12 lg:w-1/3 p-4 absolute top-56 left-[50%] translate-x-[-50%] bg-white shadow-slate-100 border border-green-600 outline-none rounded-mdx shadow-md">

        <p ref={(_subtitle)=>(subtitle = _subtitle)}></p>
        {upload.type==="images" && <img src={upload.url} alt={uid} className="w-full h-[250px] object-cover rounded-mdx"/>}
        </Modal>
      </main>
      :
      null}
}
