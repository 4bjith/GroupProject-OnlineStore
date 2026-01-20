import React from 'react'
import { useNavigate } from 'react-router-dom'

function ErrorPage() {
    const navigate = useNavigate();
  return (
    <div className="w-screen h-screen flex justify-center items-center">
        <h2 className="text-2xl text-slate-300">Error</h2>
        <p className="">Authorization failed, Log in to continue</p>
        <button onClick={()=>navigate(-1)}>Back</button>
    </div>
  )
}

export default ErrorPage