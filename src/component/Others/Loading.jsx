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
  return<h2>Loading...</h2>
}