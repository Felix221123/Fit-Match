import React from 'react'
import ImageUpload from '../Components/ImageUpload'




export const Home:React.FC = () => {
  return (
    <>
    <div className="homeContainer">
      <header>Welcome to Fit-Match</header>
      <p className="description">Find your perfect match</p>
      <ImageUpload />
    </div>
    </>
  )
}
