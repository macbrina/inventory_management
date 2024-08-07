import { auth, firestore } from "@/app/_firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useInventory } from "../_context/InventoryContext";
import { storage } from "@/app/_firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";

export async function checkUserExistsByEmail(email) {
  const usersRef = collection(firestore, "users");
  const q = query(usersRef, where("email", "==", email));

  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty;
}

export async function addSocialAuthUser(userData) {
  const usersRef = collection(firestore, "users");
  try {
    await addDoc(usersRef, userData);
  } catch (error) {
    throw error;
  }
}

export async function addUser({ uid, fullname, email, imageUrl }) {
  try {
    const docRef = await addDoc(collection(firestore, "users"), {
      uid: uid,
      fullname: fullname,
      email: email,
      image_url: imageUrl,
    });
  } catch (error) {
    throw error;
  }
}

export async function getUserByUID(uid) {
  const usersRef = collection(firestore, "users");
  const q = query(usersRef, where("uid", "==", uid));

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, data: userDoc.data() };
  } else {
    return null;
  }
}

export const fetchUserItems = async (user, updateProductList) => {
  try {
    const q = query(
      collection(firestore, "products"),
      where("userId", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    updateProductList(items);
    return items;
  } catch (error) {
    throw error;
  }
};

export const uploadImage = async (image) => {
  if (!image) return null;

  try {
    const storageRef = ref(storage, `images/${image.name}`);
    await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(storageRef);

    return imageUrl;
  } catch (error) {
    throw error;
  }
};

export const uploadBase64Image = async (base64String, imageName) => {
  try {
    const [prefix, base64Data] = base64String.split(",");
    const mime = prefix.match(/:(.*?);/)[1];
    const binary = atob(base64Data);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    const blob = new Blob([new Uint8Array(array)], { type: mime });

    const imageRef = ref(storage, `images/${imageName}`);

    const snapshot = await uploadBytes(imageRef, blob);

    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    throw error;
  }
};

export const addOrUpdateItemInFirestore = async (
  item,
  user,
  updateProductList,
  updateCategoryList
) => {
  try {
    const itemDocRef = doc(firestore, "products", item.id);
    const docSnap = await getDoc(itemDocRef);
    if (docSnap.exists()) {
      await setDoc(itemDocRef, item, { merge: true });
    } else {
      await setDoc(itemDocRef, item);
    }
    await fetchUserCategories(user, updateCategoryList);
    await fetchUserItems(user, updateProductList);
  } catch (error) {
    throw error;
  }
};

export const removeProduct = async (item, user, updateProductList) => {
  if (!item) return;

  try {
    const docRef = doc(collection(firestore, "products"), item.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef);
    } else {
      throw new Error("Product does not exist");
    }

    await fetchUserItems(user, updateProductList);
  } catch (error) {
    throw error;
  }
};

export const fetchUserCategories = async (user, updateCategoryList) => {
  try {
    const categoriesQuery = query(
      collection(firestore, "categories"),
      where("userId", "==", user.uid)
    );
    const categoriesSnapshot = await getDocs(categoriesQuery);
    const categories = categoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const categoriesWithProductCounts = await Promise.all(
      categories.map(async (category) => {
        const productsQuery = query(
          collection(firestore, "products"),
          where("categoryId", "==", category.id)
        );
        const productsSnapshot = await getDocs(productsQuery);
        const productCount = productsSnapshot.size;

        return {
          ...category,
          productCount,
        };
      })
    );

    updateCategoryList(categoriesWithProductCounts);
  } catch (error) {
    throw error;
  }
};

export const addOrUpdateCategoryInFirestore = async (
  item,
  user,
  updateCategoryList
) => {
  try {
    const itemDocRef = doc(firestore, "categories", item.id);
    const docSnap = await getDoc(itemDocRef);

    if (docSnap.exists()) {
      await setDoc(itemDocRef, item, { merge: true });
    } else {
      await setDoc(itemDocRef, item);
    }

    await fetchUserCategories(user, updateCategoryList);
  } catch (error) {
    throw error;
  }
};

export const removeCategory = async (item, user, updateCategoryList) => {
  if (!item) return;

  try {
    const docRef = doc(collection(firestore, "categories"), item.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef);
    } else {
      throw new Error("Product does not exist");
    }

    await fetchUserCategories(user, updateCategoryList);
  } catch (error) {
    throw error;
  }
};

export const fetchProductsByCategoryId = async (categoryId) => {
  try {
    const q = query(
      collection(firestore, "products"),
      where("categoryId", "==", categoryId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw error;
  }
};

export const fetchUserRecipes = async (user, updateRecipeList) => {
  try {
    const q = query(
      collection(firestore, "recipes"),
      where("userId", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    updateRecipeList(items);
  } catch (error) {
    throw error;
  }
};

export const addRecipeInFirestore = async (user, recipe, updateRecipeList) => {
  try {
    await addDoc(collection(firestore, "recipes"), recipe);
    await fetchUserRecipes(user, updateRecipeList);
  } catch (error) {
    throw error;
  }
};

export const removeRecipe = async (item, user, updateRecipeList) => {
  if (!item) return;

  try {
    const docRef = doc(collection(firestore, "recipes"), item.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef);
    } else {
      throw new Error("Recipe does not exist");
    }

    await fetchUserRecipes(user, updateRecipeList);
  } catch (error) {
    throw error;
  }
};
