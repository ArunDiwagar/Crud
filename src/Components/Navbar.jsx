import React from 'react'
import { useSelector } from 'react-redux'

const Navbar = () => {

const{taskList,error}=  useSelector((state)=>state.task)
  return (
    <>
   <h1 className="text-center my-4 text-primary">Project Management</h1>
   <p className="text-center lead">{`Currently ${taskList.length} Task(s) pending`}</p>

   {
    (error !== '')?<h5  className="text-center text-danger">{error}</h5>:null
   }
   </>
  )
}

export default Navbar