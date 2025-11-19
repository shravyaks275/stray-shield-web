"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'

// export default function ProtectedRoute({ children, userType }) {
//   const router = useRouter()
//   const [isAuthorized, setIsAuthorized] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     const token = localStorage.getItem("token")
//     const storedUserType = localStorage.getItem("userType")

//     if (!token) {
//       router.push("/login")
//       return
//     }

//     if (userType && storedUserType !== userType) {
//       router.push("/")
//       return
//     }

//     setIsAuthorized(true)
//     setIsLoading(false)
//   }, [userType, router])

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-background">
//         <div className="text-center">
//           <div className="inline-block animate-spin">
//             <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
//           </div>
//           <p className="text-muted-foreground mt-4">Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   return isAuthorized ? children : null
// }


export const AUTH_ENABLED = false;

export default function ProtectedRoute({ children, userType }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!AUTH_ENABLED) {
      setIsAuthorized(true);
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    const storedUserType = localStorage.getItem("userType");

    if (!token) {
      router.push("/login");
      return;
    }

    if (userType && storedUserType !== userType) {
      router.push("/");
      return;
    }

    setIsAuthorized(true);
    setIsLoading(false);
  }, [userType, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? children : null;
}