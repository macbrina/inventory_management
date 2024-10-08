import { auth } from "@/app/_firebase/config";
import {
  onAuthStateChanged as _onAuthStateChanged,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { toast } from "react-toastify";
import {
  addSocialAuthUser,
  checkUserExistsByEmail,
  addUser,
} from "@/app/_lib/data-service";
import Cookies from "js-cookie";

export function onAuthStateChanged(cb) {
  return _onAuthStateChanged(auth, cb);
}

async function signInWithProvider(provider) {
  try {
    provider.setCustomParameters({
      prompt: "select_account",
    });

    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const token = await user.getIdToken();

    await updateUser(user);
    Cookies.set("auth_token", token, {
      path: "/",
    });

    window.location.href = "/account/dashboard";
  } catch (err) {
    toast.error(err.message);
  }
}

export async function googleAuth() {
  const provider = new GoogleAuthProvider();
  await signInWithProvider(provider);
}

export async function githubAuth() {
  const provider = new GithubAuthProvider();
  await signInWithProvider(provider);
}

async function updateUser(user) {
  const userExist = await checkUserExistsByEmail(user.email);

  if (!userExist) {
    const userData = {
      uid: user.uid,
      email: user.email,
      fullname: user.displayName,
      image_url: user.photoURL || "/images/default_user.png",
    };

    await addSocialAuthUser(userData);
  }
}

export async function signInSystem({ email, password, rememberMe }) {
  try {
    await setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence
    );
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const token = await user.getIdToken();

    Cookies.set("auth_token", token, {
      expires: rememberMe ? 2 : undefined,
      path: "/",
    });
  } catch (error) {
    throw error;
  }
}

export async function signUpSystem({ fullName, email, password }) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const token = await user.getIdToken();

    await addUser({
      uid: user.uid,
      fullname: fullName,
      email: email,
      image_url: "/images/default_user.png",
    });

    Cookies.set("auth_token", token, {
      path: "/",
    });
  } catch (error) {
    throw error;
  }
}

export async function logOut() {
  try {
    await auth.signOut();

    Cookies.remove("auth_token", { path: "/" });

    window.location.href = "/";
  } catch (error) {
    toast.error(error.message);
  }
}
