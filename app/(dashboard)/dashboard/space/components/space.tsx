import React, { useEffect, useState } from 'react'
import FeedbackForm from './feedback-form'
import LandingPage from './landing-page'

interface Props{
    mode:"edit"|"new",
    data?:Record<string,string>
}

export default function Space({mode,data}:Props) {
    // // using it for mapping data to the component
    // useEffect(()=>{
    //     console.log("hello")
    // },[])
  return (
    <section className='flex'>
        {/* <FeedbackForm/> */}
        <LandingPage/>
    </section>
  )
}
