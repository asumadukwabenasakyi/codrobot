import React from 'react';
import { useState } from 'react';
import { auth } from '../../../firebase.config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import styles from '../../styles/Home.module.css';

function SignUp() {

   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')

   const sigUp = (e) => {
      e.preventDefault();
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) =>{
         console.log(userCredential)
      }).catch((error) => {
         console.log(error)
      })
   }
  return (
   <div>
      <div className={styles.signInHeader}>
        <h1>Do not have account, Sign Up</h1>
      </div>
      <div className={styles.signInForm}>
        <form onSubmit={sigUp}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password must be at least 8..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  )
}

export default SignUp
