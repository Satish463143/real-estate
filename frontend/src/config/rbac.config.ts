'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const CheckPermission = ({ allowedBy, children }: { allowedBy: string, children: React.ReactNode }) => {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  
  //called loggedin user
  const loggedInUser = useSelector((root: any)=>{
    return root.user.loggedInUser
  })

  // check permission
  useEffect(() => {
    const checkPermission = async () => {
      // If user is not logged in
      if (!loggedInUser) {
        Swal.fire({
          icon: "error",
          title: "Please login first",
          showConfirmButton: false,
          timer: 1000
        });
        setTimeout(() => {
            router.push("/admin");
        }, 1000); // Give time for toast to show
        return;
      }
      
      // If user doesn't have the required role
      if (loggedInUser.role !== allowedBy) {
        Swal.fire({
          icon: "warning",
          title: "You don't have permission to access this panel!",
          showConfirmButton: false,
          timer: 1000
        });
        setTimeout(() => {
          router.push('/');
        }, 1000); // Give time for toast to show
        return;
      }
      
      // User has permission
      setIsChecking(false);
    };
    
    checkPermission();
  }, [loggedInUser, allowedBy, router]); // Reacts to changes in `loggedInUser`

  // If user has permission, render children
  if (loggedInUser && loggedInUser.role === allowedBy && !isChecking) {
    return children;
  }

  // Return null to prevent rendering unauthorized content
  return null;
};

export default CheckPermission;
