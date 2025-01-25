// components/Box.js
import { useState } from 'react';
import styles from './box.module.css';

const Box = () => {
  const [color, setColor] = useState('lightgray');

  const changeColor = () => {
    setColor(color === 'lightgray' ? 'blue' : 'lightgray');
  };

  return (
    <div className={styles.box} style={{ backgroundColor: color }} onClick={changeColor}>
      Click me to change color!
    </div>
  );
};

export default Box;
