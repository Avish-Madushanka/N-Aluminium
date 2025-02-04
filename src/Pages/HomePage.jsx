import React from 'react'
import HomeSliding from '../Components/HomePageComponents/HomeSliding'
import Homemain from '../Components/HomePageComponents/Homemain'
import HomeBar from '../Components/HomePageComponents/HomeBar'
import HomeDes from '../Components/HomePageComponents/HomeDes'

const HomePage = () => {
  return (
    <>
      <Homemain/>
      <HomeSliding/>
      <HomeBar/>
      <HomeDes/>
    </>
  )
}

export default HomePage