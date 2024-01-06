import {useState, useEffect} from 'react';
import "./typingAnimation.css"

const TypingAnimation = () => {

  return (
    <div style={{display: "flex",  width:"100px", height: "55px", alignItems: "center"}}>
        <div div id="wave">
            <p class="dot"></p>
            <p class="dot"></p>
            <p class="dot"></p>   
        </div>
        <p>typing</p>
    </div>
  );
}

export default TypingAnimation
// , paddingLeft: "30px", paddingTop:"20px", paddingBottom: "16px", borderTop: "1px solid #ddd"}