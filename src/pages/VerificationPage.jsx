
import React from 'react';
import VerificationSystem from '../components/VerificationSystem';

const VerificationPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Verificação de Conta</h1>
      <p className="text-center mb-8 max-w-lg mx-auto">
        A verificação de identidade é importante para garantir a segurança de todos os usuários da plataforma.
        Complete todos os passos abaixo para obter uma conta totalmente verificada.
      </p>
      <VerificationSystem />
    </div>
  );
};

export default VerificationPage;
