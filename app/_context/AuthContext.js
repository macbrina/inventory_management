"use client";

import { onAuthStateChanged } from "@/app/_lib/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/app/_firebase/config";
import { getUserByUID } from "../_lib/data-service";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const loggedUser = await getUserByUID(authUser.uid);
        if (loggedUser?.data) {
          setUser(loggedUser.data);
        } else {
          setUser(null);
          Cookies.remove("auth_token", { path: "/" });
          if (pathname.startsWith("/account")) {
            router.push("/login");
          }
        }
      } else {
        setUser(null);
        Cookies.remove("auth_token", { path: "/" });
        if (pathname.startsWith("/account")) {
          router.push("/login");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
