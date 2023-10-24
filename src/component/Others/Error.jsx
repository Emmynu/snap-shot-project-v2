import { Link } from "react-router-dom"

export default function Error({errorMessage}) {
  return (
    <div className='error-message'>
      {errorMessage}  
      <span className='text-base font-normal underline text-emerald-600 ml-2 '> <Link to={0}>Refresh Page</Link></span>
    </div>
  )
}
