import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
const ProtectUser = () => {
    const {userInfo, authInitialized} = useSelector(state=>state.auth)
    if(!authInitialized){
        return null
    }
    if(userInfo){
        return <Outlet/>
    }else{
        return <Navigate to='/login' replace={true} />
    }
}

export default ProtectUser
