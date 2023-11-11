import './App.css'
import { RouterProvider,createBrowserRouter,createRoutesFromElements,Route } from 'react-router-dom'
import Header from './component/nav/header'
import Explore from './component/Main/Explore'
import Register, { registerAction } from './component/auth/register'
import Profile from './component/auth/Profile'
import Photos from './component/Main/Photos'
import Videos from './component/Main/Videos'
import Collection from './component/Collections/Collection'
import PhotoDetailed from './component/detailed/Photo-detailed'
import VideoDetailed from './component/detailed/Video-detailed'
import CollectionDetailed from './component/Collections/CollectionDetailed'
import Login, { loginAction } from './component/auth/Login'
import ProtectedRoute from './component/Others/ProtectedRoute'
import Upload from './component/Uploads/Upload'
import Uploads from './component/Uploads/Uploads'
import UploadDetailed from './component/Uploads/Upload-detailed'
import PageNotFound from './component/404-Page/PageNotFound'
import Search from './component/Main/Search'
import UpdateProfile from './component/auth/UpdateProfile'
import Profiles from './component/auth/Profiles'
import Posts from './component/Posts/Posts'


function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <>
    <Route path='/' element={<Header />}>

      <Route path='/' element={<Explore/>}>
        <Route index element={<Photos />}/>
        <Route path='photos/:id' element={<PhotoDetailed />}/>
        <Route path='videos' element={<Videos/>}/>
        <Route path='videos/:vid' element={<VideoDetailed/>}/>
        <Route path='search' element={<Search/>}/>
       

        <Route  element={<ProtectedRoute />}>
          <Route path='collections' element={<Collection/>}/>
          <Route path='collections/:collectionId/:label/:id' element={<CollectionDetailed/>}/>
          <Route path='uploads' element={<Uploads/>}/>
          <Route path='uploads/:uid' element={<UploadDetailed />}/>
        </Route>
      </Route>

     
     <Route  element={<ProtectedRoute />}>
      <Route path='profile' element={<Profile />}/>
      <Route path='profile/:userId' element={<Profiles />}/>
      <Route path='update-profile' element={<UpdateProfile />}/>
      <Route path='upload' element={<Upload/>}/>
      <Route  path='posts' element={<Posts/>} />
     
     </Route>

     <Route path='*' element={<PageNotFound />}/>
    </Route>
    <Route path='register' element={<Register />} action={registerAction}/>
    <Route path='login' element={<Login />} action={loginAction}/>

    </>
  ))

  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App


