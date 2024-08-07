"use client";

import SignIn from "@/app/_components/Auth/SignIn";
import ClientOnly from "../_components/ClientOnly";

function Login() {
  return (
    <ClientOnly>
      <SignIn />
    </ClientOnly>
  );
}

export default Login;
