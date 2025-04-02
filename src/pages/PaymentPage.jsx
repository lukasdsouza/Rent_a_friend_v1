
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../services/firebase';
import { createCheckoutSession, createPixPayment } from '../services/paymentService';

const PaymentPage = () => {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [pixData, setPixData] = useState(null);
  
  // Simular o ID do usuário logado
  const currentUserId = localStorage.getItem('userId') || 'user123';

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const activityDoc = await firestore.collection('activities').doc(activityId).get();
        
        if (!activityDoc.exists) {
          throw new Error('Atividade não encontrada');
        }
        
        setActivity({
          id: activityDoc.id,
          ...activityDoc.data()
        });
      } catch (err) {
        console.error('Erro ao buscar atividade:', err);
        setError('Não foi possível carregar os detalhes desta atividade.');
      } finally {
        setLoading(false);
      }
    };
    
    if (activityId) {
      fetchActivity();
    }
  }, [activityId]);

  const handleCardPayment = async () => {
    try {
      setProcessingPayment(true);
      setError(null);
      
      // Criar sessão de checkout no Stripe
      const session = await createCheckoutSession(activityId, currentUserId);
      
      // Redirecionar para o checkout do Stripe
      window.location.href = session.url;
    } catch (err) {
      console.error('Erro ao processar pagamento:', err);
      setError(err.message || 'Não foi possível processar o pagamento. Tente novamente.');
      setProcessingPayment(false);
    }
  };

  const handlePixPayment = async () => {
    try {
      setProcessingPayment(true);
      setError(null);
      
      // Criar pagamento Pix
      const pixPayment = await createPixPayment(activityId, currentUserId);
      setPixData(pixPayment);
      
      // Em um cenário real, o código Pix seria exibido ou um QR code
    } catch (err) {
      console.error('Erro ao gerar Pix:', err);
      setError(err.message || 'Não foi possível gerar o código Pix. Tente novamente.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setPixData(null);
  };

  if (loading) {
    return <div className="p-8 text-center">Carregando detalhes da atividade...</div>;
  }

  if (error && !activity) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page p-4">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Pagamento</h1>
          
          {activity && (
            <div className="mb-6 pb-6 border-b">
              <h2 className="text-xl font-semibold mb-2">{activity.title}</h2>
              <p className="mb-2">{activity.description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">
                    <strong>Data:</strong> {activity.date?.toDate().toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    <strong>Local:</strong> {activity.location}
                  </p>
                </div>
                <div className="text-xl font-bold">
                  R$ {activity.price?.toFixed(2)}
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Método de Pagamento</h3>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <button
                onClick={() => handlePaymentMethodChange('card')}
                className={`p-4 border rounded-lg flex flex-col items-center ${
                  paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : ''
                }`}
              >
                <div className="w-10 h-10 mb-2 flex items-center justify-center">💳</div>
                <span className="text-sm">Cartão</span>
              </button>
              
              <button
                onClick={() => handlePaymentMethodChange('pix')}
                className={`p-4 border rounded-lg flex flex-col items-center ${
                  paymentMethod === 'pix' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : ''
                }`}
              >
                <div className="w-10 h-10 mb-2 flex items-center justify-center">📱</div>
                <span className="text-sm">Pix</span>
              </button>
              
              <button
                onClick={() => handlePaymentMethodChange('paypal')}
                className={`p-4 border rounded-lg flex flex-col items-center ${
                  paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : ''
                }`}
              >
                <div className="w-10 h-10 mb-2 flex items-center justify-center">🅿️</div>
                <span className="text-sm">PayPal</span>
              </button>
              
              <button
                onClick={() => handlePaymentMethodChange('applepay')}
                className={`p-4 border rounded-lg flex flex-col items-center ${
                  paymentMethod === 'applepay' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : ''
                }`}
              >
                <div className="w-10 h-10 mb-2 flex items-center justify-center">🍎</div>
                <span className="text-sm">Apple Pay</span>
              </button>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            {pixData ? (
              <div className="bg-green-50 dark:bg-green-900 border border-green-200 p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-2">Código Pix Gerado</h4>
                <div className="bg-white p-4 rounded border mb-4 text-center">
                  <p className="font-mono text-lg break-all">{pixData.pixCode}</p>
                </div>
                <p className="text-sm mb-2">
                  <strong>Expira em:</strong> {new Date(pixData.expiresAt).toLocaleTimeString()}
                </p>
                <p className="text-sm">
                  Escaneie o código acima usando seu aplicativo de banco ou copie e cole no aplicativo.
                </p>
              </div>
            ) : (
              <>
                {paymentMethod === 'card' && (
                  <button
                    onClick={handleCardPayment}
                    disabled={processingPayment}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                  >
                    {processingPayment ? 'Processando...' : 'Pagar com Cartão'}
                  </button>
                )}
                
                {paymentMethod === 'pix' && (
                  <button
                    onClick={handlePixPayment}
                    disabled={processingPayment}
                    className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
                  >
                    {processingPayment ? 'Gerando Pix...' : 'Gerar Código Pix'}
                  </button>
                )}
                
                {(paymentMethod === 'paypal' || paymentMethod === 'applepay') && (
                  <div className="text-center py-4">
                    <p className="text-gray-500">
                      Este método de pagamento estará disponível em breve.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            <p className="mb-2">
              Seu pagamento é processado de forma segura. Você só será cobrado quando o anfitrião aceitar sua solicitação.
            </p>
            <p>
              Ao confirmar, você concorda com os <a href="#" className="text-blue-500">Termos de Serviço</a> e <a href="#" className="text-blue-500">Política de Privacidade</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
