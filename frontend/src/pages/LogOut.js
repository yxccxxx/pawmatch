import { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";

const Logout = () => {
    console.log("logging out...");
    useEffect(() => {
        const auth = getAuth();
        signOut(auth).then(() => {
            // Sign-out successful.
            window.location.href = "/";
        }).catch((error) => {
            // An error happened.
            console.log("Failed to log out");
        });
    }, []);
  return;
};

export default Logout;