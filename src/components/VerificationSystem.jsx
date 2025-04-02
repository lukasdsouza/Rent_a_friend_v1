
import React, { useState, useEffect } from 'react';
import { auth, sendEmailVerification, sendPhoneVerification, verifyPhoneCode } from '../services/firebase';

const VerificationSystem = () => {
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    email: false,
    phone: false,
    identity: false
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setVerificationStatus(prev => ({
          ...prev,
          email: currentUser.emailVerified
        }));

        // Verificar se o telefone já foi validado (em um sistema real, isso viria do perfil do usuário)
        checkPhoneVerification(currentUser.uid);
      } else {
        setUser(null);
      }
    });

    // Setup reCAPTCHA verifier
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible'
      });
    }

    return () => unsubscribe();
  }, []);

  const checkPhoneVerification = async (userId) => {
    try {
      const userDoc = await firestore.collection('users').doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        setVerificationStatus(prev => ({
          ...prev,
          phone: userData.phoneVerified || false,
          identity: userData.identityVerified || false
        }));
      }
    } catch (error) {
      console.error("Erro ao verificar status do telefone:", error);
    }
  };

  const handleSendEmailVerification = async () => {
    try {
      const result = await sendEmailVerification();
      if (result) {
        setMessage('Email de verificação enviado! Verifique sua caixa de entrada.');
      } else {
        setMessage('Não foi possível enviar o email de verificação.');
      }
    } catch (error) {
      setMessage(`Erro: ${error.message}`);
    }
  };

  const handleSendPhoneVerification = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setMessage('Por favor, insira um número de telefone válido.');
      return;
    }

    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      const result = await sendPhoneVerification(formattedPhone);
      if (result) {
        setCodeSent(true);
        setMessage('Código de verificação enviado por SMS!');
      } else {
        setMessage('Não foi possível enviar o código. Tente novamente.');
      }
    } catch (error) {
      setMessage(`Erro: ${error.message}`);
    }
  };

  const handleVerifyPhoneCode = async () => {
    if (!verificationCode) {
      setMessage('Por favor, insira o código de verificação.');
      return;
    }

    try {
      const result = await verifyPhoneCode(verificationCode);
      if (result) {
        setVerificationStatus(prev => ({ ...prev, phone: true }));
        
        // Atualizar o status de verificação no banco de dados
        if (user) {
          await firestore.collection('users').doc(user.uid).update({
            phoneVerified: true,
            phoneNumber: phoneNumber
          });
        }
        
        setMessage('Telefone verificado com sucesso!');
      } else {
        setMessage('Código inválido. Tente novamente.');
      }
    } catch (error) {
      setMessage(`Erro: ${error.message}`);
    }
  };

  const handleUploadIdentity = async (event) => {
    if (!event.target.files || !event.target.files[0]) return;

    const file = event.target.files[0];
    setMessage('Enviando documento...');

    try {
      // Upload do arquivo para o Storage do Firebase
      const storageRef = storage.ref(`identityDocs/${user.uid}/${file.name}`);
      await storageRef.put(file);
      
      // Obter URL do arquivo
      const downloadURL = await storageRef.getDownloadURL();
      
      // Registrar o envio no banco de dados
      await firestore.collection('users').doc(user.uid).update({
        identityDocumentURL: downloadURL,
        identityVerificationStatus: 'pending',
        identitySubmittedAt: new Date()
      });
      
      setMessage('Documento enviado com sucesso! Aguarde a verificação.');
    } catch (error) {
      setMessage(`Erro ao enviar documento: ${error.message}`);
    }
  };

  if (!user) {
    return <div className="p-4 text-center">Faça login para verificar sua conta</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Verificação de Conta</h2>
      
      {message && (
        <div className={`p-3 mb-4 rounded ${message.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      
      <div className="space-y-6">
        {/* Email Verification */}
        <div className="border-b pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Verificação de Email</h3>
            {verificationStatus.email ? (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Verificado</span>
            ) : (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pendente</span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Verifique seu endereço de email para maior segurança</p>
          
          {!verificationStatus.email && (
            <button 
              onClick={handleSendEmailVerification}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Enviar Email de Verificação
            </button>
          )}
        </div>
        
        {/* Phone Verification */}
        <div className="border-b pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Verificação de Telefone</h3>
            {verificationStatus.phone ? (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Verificado</span>
            ) : (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pendente</span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Adicione e verifique seu número de telefone</p>
          
          {!verificationStatus.phone && !codeSent && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="+5511999999999"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border rounded p-2 w-full mb-2"
              />
              <button 
                onClick={handleSendPhoneVerification}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Enviar Código SMS
              </button>
            </div>
          )}
          
          {!verificationStatus.phone && codeSent && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Código de verificação"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="border rounded p-2 w-full mb-2"
              />
              <button 
                onClick={handleVerifyPhoneCode}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Verificar Código
              </button>
            </div>
          )}
        </div>
        
        {/* Identity Verification */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Verificação de Identidade</h3>
            {verificationStatus.identity ? (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Verificado</span>
            ) : (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pendente</span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Envie um documento de identificação (RG, CNH)</p>
          
          {!verificationStatus.identity && (
            <div className="mt-2">
              <label className="block mb-2">
                <span className="sr-only">Escolha um arquivo</span>
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={handleUploadIdentity}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </label>
              <p className="text-xs text-gray-500">
                Formatos aceitos: JPG, PNG, PDF. Tamanho máximo: 5MB.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default VerificationSystem;
