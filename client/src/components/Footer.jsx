import React from 'react'
import ghLogo from '../assets/github-mark-white.svg'
import linkedInLogo from '../assets/linkedin.svg'

function Footer() {
  return (
    <div className='footer'>
        <div id='credit'>© Xavier Yribarren</div>
        <div id='links'><a href='https://github.com/XavierYribarren'>
           <img src={ghLogo} alt="github"/> 
          </a>
          <a href='https://www.linkedin.com/in/xavier-yribarren/'>
           <img src={linkedInLogo} alt="github"/> 
          </a>
           </div>
    </div>
  )
}

export default Footer