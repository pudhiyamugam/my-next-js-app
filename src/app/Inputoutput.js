// components/RealTimePrinter.js
"use client";

import { useState } from 'react';
import styles from './inputoutput.module.css';

const RealTimePrinter = () => {
  const [input, setInput] = useState('');

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Type something..."
        className={styles.input}
      />
      <div className={styles.output}>
        {input}
      </div>
    </div>
  );
};

export default RealTimePrinter;
