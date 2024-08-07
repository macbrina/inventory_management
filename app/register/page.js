"use client";

import SignUp from "@/app/_components/Auth/Signup";
import ClientOnly from "../_components/ClientOnly";

function Register() {
  return (
    <ClientOnly>
      <SignUp />;
    </ClientOnly>
  );
}

export default Register;
