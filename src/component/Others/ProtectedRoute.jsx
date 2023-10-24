import { Outlet } from 'react-router-dom'
import { currentUserID } from '../../data/users'
export default function ProtectedRoute() {
    return currentUserID === null || currentUserID === undefined ? 
    window.location="/login"
    : 
    <Outlet/>
        
}
   