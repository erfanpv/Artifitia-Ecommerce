import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts";

export default function LoginProtect({ element }) {
  const { isLoggedIn } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      toast.error("You must be logged in to access this page");
    }
  }, [isLoggedIn]);

  if (isAuthorized === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid border-opacity-50"></div>
        <p className="mt-4 text-blue-500 font-semibold">Loading...</p>
      </div>
    );
  }

  if (isAuthorized) {
    return element;
  }

  return <Navigate to="/" />;
}
