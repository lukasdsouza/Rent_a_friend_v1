
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../services/firebase';
import { createSubscription, checkSubscriptionStatus } from '../services/subscriptionService';

const SubscriptionPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const subscriptionPlans = [
    {
      id: 'basic',
      name: 'Plano Básico',
      price: 29.90,
      features: [
        'Até 5 atividades por mês',
        'Perfil verificado',
        'Suporte por email'
      ]
    },
    {
      id: 'pro',
      name: 'Plano Profissional',
      price: 59.90,
      features: [
        'Atividades ilimitadas',
        'Destaque nos resultados de busca',
        'Perfil verificado',
        'Suporte prioritário',
        'Análise de desempenho'
      ],
      recommended: true
    },
    {
      id: 'premium',
      name: 'Plano Premium',
      price: 99.90,
      features: [
        'Todos os benefícios do Plano Profissional',
        'Comissão reduzida (10%)',
        'Acesso antecipado a novos recursos',
        'Suporte VIP 24/7',
        'Sem anúncios'
      ]
    }
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const status = await checkSubscriptionStatus(currentUser.uid);
          setSubscriptionStatus(status);
        } catch (error) {
          console.error("Erro ao verificar assinatura:", error);
        }
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setMessage('');
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPlan) {
      setMessage('Por favor, selecione um plano de assinatura.');
      return;
    }
    
    if (paymentMethod === 'card' && 
        (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvc)) {
      setMessage('Por favor, preencha todos os dados do cartão.');
      return;
    }

    setLoading(true);
    
    try {
      // Simulação de processamento de pagamento e criação de assinatura
      // Em um sistema real, você usaria um gateway de pagamento como Stripe
      
      // Simular método de pagamento token
      const paymentMethodId = 'pm_' + Math.random().toString(36).substr(2, 9);
      
      // Criar assinatura
      await createSubscription(user.uid, selectedPlan.id, paymentMethodId);
      
      // Atualizar status da assinatura
      const status = await checkSubscriptionStatus(user.uid);
      setSubscriptionStatus(status);
      
      setMessage('Assinatura ativada com sucesso!');
      
      // Redirecionamento após processamento
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error("Erro ao processar assinatura:", error);
      setMessage(`Erro ao processar assinatura: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  if (!user) {
    return (
      <div className="p-8">
        <div className="max-w-md mx-auto text-center">
          <p className="mb-4">Você precisa estar logado para acessar esta página.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  // Se o usuário já tem uma assinatura ativa
  if (subscriptionStatus?.active) {
    const { subscription } = subscriptionStatus;
    return (
      <div className="p-8">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Sua Assinatura</h2>
          
          <div className="bg-green-50 dark:bg-green-900 border border-green-200 p-4 rounded-lg mb-6">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs mb-2">
              Ativa
            </span>
            <h3 className="font-semibold text-lg">
              {
                subscription?.planId === 'basic' ? 'Plano Básico' :
                subscription?.planId === 'pro' ? 'Plano Profissional' :
                subscription?.planId === 'premium' ? 'Plano Premium' : 'Assinatura'
              }
            </h3>
            <p className="text-sm mt-1">
              Próxima cobrança: {subscription?.nextBillingDate?.toDate().toLocaleDateString() || 'Não disponível'}
            </p>
          </div>
          
          <div className="flex justify-between">
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Voltar
            </button>
            <button 
              onClick={() => setMessage('Funcionalidade de cancelamento em desenvolvimento.')}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancelar Assinatura
            </button>
          </div>
          
          {message && (
            <div className="mt-4 p-3 bg-blue-100 text-blue-700 rounded">
              {message}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Planos para Amigos</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Escolha o plano que melhor se adapta às suas necessidades e comece a oferecer suas atividades!
        </p>
        
        {message && (
          <div className={`p-3 mb-4 rounded ${message.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
            {message}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {subscriptionPlans.map(plan => (
            <div 
              key={plan.id}
              onClick={() => handleSelectPlan(plan)}
              className={`
                relative border rounded-lg p-6 cursor-pointer transition-all
                ${plan.recommended ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:shadow-md'}
                ${selectedPlan?.id === plan.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'}
              `}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl rounded-tr">
                  Recomendado
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">R$ {plan.price.toFixed(2)}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">/mês</span>
              </div>
              
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-2 rounded ${
                  plan.recommended 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                {selectedPlan?.id === plan.id ? 'Selecionado' : 'Selecionar Plano'}
              </button>
            </div>
          ))}
        </div>
        
        {selectedPlan && (
          <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold mb-4">Informações de Pagamento</h2>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <button
                onClick={() => handlePaymentMethodChange('card')}
                className={`p-4 border rounded-lg flex flex-col items-center ${
                  paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="w-10 h-10 mb-2 flex items-center justify-center">💳</div>
                <span className="text-sm">Cartão</span>
              </button>
              
              <button
                onClick={() => handlePaymentMethodChange('pix')}
                className={`p-4 border rounded-lg flex flex-col items-center ${
                  paymentMethod === 'pix' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="w-10 h-10 mb-2 flex items-center justify-center">📱</div>
                <span className="text-sm">Pix</span>
              </button>
              
              <button
                disabled
                className="p-4 border rounded-lg flex flex-col items-center opacity-50 cursor-not-allowed"
              >
                <div className="w-10 h-10 mb-2 flex items-center justify-center">🅿️</div>
                <span className="text-sm">PayPal</span>
                <span className="text-xs mt-1">Em breve</span>
              </button>
              
              <button
                disabled
                className="p-4 border rounded-lg flex flex-col items-center opacity-50 cursor-not-allowed"
              >
                <div className="w-10 h-10 mb-2 flex items-center justify-center">🍎</div>
                <span className="text-sm">Apple Pay</span>
                <span className="text-xs mt-1">Em breve</span>
              </button>
            </div>
            
            {paymentMethod === 'card' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Número do Cartão</label>
                  <input
                    type="text"
                    name="number"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={handleCardChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nome no Cartão</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nome Completo"
                    value={cardDetails.name}
                    onChange={handleCardChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Data de Expiração</label>
                    <input
                      type="text"
                      name="expiry"
                      placeholder="MM/AA"
                      value={cardDetails.expiry}
                      onChange={handleCardChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CVC</label>
                    <input
                      type="text"
                      name="cvc"
                      placeholder="123"
                      value={cardDetails.cvc}
                      onChange={handleCardChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? 'Processando...' : `Assinar por R$ ${selectedPlan.price.toFixed(2)}/mês`}
                </button>
              </form>
            )}
            
            {paymentMethod === 'pix' && (
              <div className="text-center">
                <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg mb-6">
                  <p className="mb-4">QR Code Pix será gerado após confirmação</p>
                  <div className="w-48 h-48 mx-auto bg-white flex items-center justify-center">
                    <span className="text-gray-400">Simulação de QR Code</span>
                  </div>
                </div>
                <button 
                  onClick={handleSubmit}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? 'Gerando Pix...' : `Gerar QR Code para pagamento`}
                </button>
              </div>
            )}
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Ao confirmar, você concorda com os nossos Termos de Serviço e autoriza a cobrança recorrente mensal.
              Você pode cancelar sua assinatura a qualquer momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;
