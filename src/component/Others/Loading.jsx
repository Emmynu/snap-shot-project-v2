import loadingImage from "../../images/loading.png"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Loading() {
  return (
    <main className="photo-container">
      <div>
        <Skeleton height={370} className='h-full w-full'/>
      </div>

      <div>
        <Skeleton height={370} className='h-full w-full'/>
      </div>

      <div>
        <Skeleton height={370} className='h-full w-full'/>
      </div>

      <div>
        <Skeleton height={370} className='h-full w-full'/>
      </div>
    </main>
  )
}


export function LoadProfile(){
 return<main className='flex justify-center'>
  <section>
    <div > 
      <Skeleton borderRadius={100} height={200} width={200}/>
  </div>
    <div className="mt-3">
    <Skeleton count={3} />
    </div>
  </section>
 </main>
}




export function LoadPost() {
  return <main  className=" bg-white shadow-md shadow-slate-200 p-3  w-full md:w-11/12" style={{margin: "5% auto 0"}}>
    <header className="flex items-center">
      <section>
        <Skeleton borderRadius={100} style={{aspectRatio:"1"}} width={80}/>
      </section>

      <section className="ml-3 w-full">
        <Skeleton count={2}  height={10}  style={{width:"100%"}}/>
      </section>
    </header>

  <main className="w-full mb-2">
    <Skeleton style={{width:"95%"}} height={300}/>
  </main>

  <footer className="border-t border-slate-400 flex justify-between items-center">
    <section className="w-full  mt-2">
       <Skeleton  height={14}  style={{width:"50%"}}/>
    </section>

    <section className="w-full mt-2">
     <Skeleton  height={14}  style={{width:"50%"}}/>
    </section>

    <section className="w-full mt-2">
     <Skeleton  height={14}  style={{width:"50%"}}/>
    </section>
    
  </footer>
  </main>
}