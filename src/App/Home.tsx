import React from 'react'
import ImageUpload from '../Components/ImageUpload'
import "../Styles/styles.css"





export const Home:React.FC = () => {
  return (
    <>
    <div className="homeContainer">
      <header>Welcome to Fit-Match</header>
      <p className="description">Find your perfect match</p>
      <ImageUpload />
      <div className="text-banner-container"> 
      <div className="text-banner">NEXT FASHION</div> 
      <div className="text-banner">NEXT FASHION</div> 
      <div className="text-banner">NEXT FASHION</div> 
      </div>
    </div>
    </>
  )
}
