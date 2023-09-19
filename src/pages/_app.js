import { useEffect, useState } from 'react';
import '../styles/globals.css';
import styles from '../styles/user.module.css'
import SignUp from './components/signup'
import SignIn from './components/signIn'
import { auth } from '../pages/firebaseConfig/firebase';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [showPleaseWait, setShowPleaseWait] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);

      if (user) {
        setShowPleaseWait(true);
        setTimeout(() => {
          setShowPleaseWait(false);
        }, 0);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      {showPleaseWait ? (
        <div className={styles.loadingSpinnerContainer}>
          <div className={styles.stylesloadingSpinner}></div>
          <h1 className={styles.please}>Please wait...</h1>
        </div>
      ) : (
        user ? <Component {...pageProps} /> : <SignUpOrSignIn />
      )}
    </div>
  );
}

function SignUpOrSignIn() {
  return (
    <div className='signinorsignoutcontainer'>
      <SignIn />
      <SignUp />
    </div>
  );
}

export default MyApp;
