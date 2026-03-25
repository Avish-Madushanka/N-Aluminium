import React from 'react'
import HomeSliding from '../Components/HomePageComponents/HomeSliding'
import HomeBar from '../Components/HomePageComponents/HomeBar'
import HomeDes from '../Components/HomePageComponents/HomeDes'
import HomeDes2 from '../Components/HomePageComponents/HomeDes2'

const HomePage = () => {
  return (
    <>
      <HomeSliding/>
      <HomeBar />
      <HomeDes2 />
      <HomeDes/>
    </>
  )
}

export default HomePage