import React from 'react';
import { auth } from '../../../firebase.config';
function Logout() {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('User logged out successfully!');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Logout;
