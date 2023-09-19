import React, { useState } from "react";
import { auth } from "../firebaseConfig/firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import styles from '../../styles/Home.module.css'

function SignInOrSignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [resetSuccessMessage, setResetSuccessMessage] = useState(""); // Add reset success message state

  const signIn = (e) => {
    e.preventDefault();
    setErrorMessage("");
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        setErrorMessage("Invalid email or password");
        console.log(error);
      });
  };

  const resetPassword = () => {
    setErrorMessage("");
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setResetSuccessMessage("Password reset email sent. Check your inbox.");
      })
      .catch((error) => {
        setErrorMessage("Error sending password reset email.");
        console.log(error);
      });
  };

  return (
    <div>
      <div className={styles.signInHeader}>
        <h1>Already have an account? Sign In</h1>
      </div>
      <div className={styles.signInForm}>
        <form onSubmit={signIn}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        <button onClick={resetPassword} className={styles.resetBtn}>Reset Password</button>
        {errorMessage && <p className={styles.error}>{`Type your email in the sign in form or the mail provided is not in our database`}</p>}
        {resetSuccessMessage && (
          <p className={styles.success}>{resetSuccessMessage}</p>
        )}
      </div>
    </div>
  );
}

export default SignInOrSignUp;
