
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

// Inicializa o Firebase apenas se ainda não foi inicializado
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

// Métodos de autenticação e verificação
export const sendEmailVerification = async () => {
  const user = auth.currentUser;
  if (user && !user.emailVerified) {
    await user.sendEmailVerification();
    return true;
  }
  return false;
};

export const sendPhoneVerification = async (phoneNumber) => {
  try {
    const confirmationResult = await auth.signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier);
    window.confirmationResult = confirmationResult;
    return true;
  } catch (error) {
    console.error("Erro ao enviar verificação de telefone:", error);
    return false;
  }
};

export const verifyPhoneCode = async (code) => {
  try {
    if (!window.confirmationResult) return false;
    await window.confirmationResult.confirm(code);
    return true;
  } catch (error) {
    console.error("Erro ao verificar código:", error);
    return false;
  }
};

export { auth, firestore, storage };
export default firebase;
