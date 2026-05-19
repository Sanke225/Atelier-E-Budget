import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UseUserStore } from '../Stores'
import LoadingPage from './LoadingPage'

function AuthProvider({ pageAutorise }: {pageAutorise: React.JSX.Element}) {

    const user = UseUserStore(state => state.user)
    const navigate = useNavigate()
    const [load, setLoad] = useState(true)

    useEffect(() => {
        if(!user || !user.uid) {
        navigate("/")
        return;
    }
    setLoad(false)
    }, [user])

    

  return (
    <>
    {load ? (
        <LoadingPage />
    ) :(
        <>
            { pageAutorise }
        </>
    )}
    </>
  )
}

export default AuthProvider
