// components/Box.js
"use client";

import styles from './page.module.css';
import iostyles from './inputoutput.module.css';
// import image from './next';


const Box = ({ width, height }) => {
  return (
    <div>
      <div
      className={styles.box}
      style={{width: 1600, height: 100 }}
    ><div className={styles.text}>
        TrackPWD
      </div>
    </div>
    <div className={styles.imageContainer}><img src="./example.png" alt="Example Image" width={1000} height={500} className={styles.image} />
    <input 
  type="text" 
  className={styles.input} 
  placeholder="Enter text" 
/>

    <button className={styles.buttonside}></button>
    <button className={styles.zoom}><img src='./zoom_in.png'></img></button>
    <button className={styles.zoom_out}><img src='./zoom_out.png'></img></button>
    <button className={styles.zoom_oth}><img src='./zoom_in.png'></img></button>

    </div>
    <div className={iostyles.imageContainer}><inputoutput /></div>
    </div>
  );
};

export default Box;
