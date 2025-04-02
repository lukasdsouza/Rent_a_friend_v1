
import { firestore } from './firebase';

// Inicializar Stripe
const initializeStripe = async () => {
  const stripe = await loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY);
  return stripe;
};

// Criar sessão de checkout
export const createCheckoutSession = async (activityId, userId) => {
  try {
    // Buscar detalhes da atividade
    const activityDoc = await firestore.collection('activities').doc(activityId).get();
    
    if (!activityDoc.exists) {
      throw new Error('Atividade não encontrada');
    }
    
    const activity = activityDoc.data();
    
    // Verificar se a atividade ocorrerá em pelo menos 2 dias
    const activityDate = activity.date.toDate();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    
    if (activityDate < twoDaysFromNow) {
      throw new Error('Pagamentos só podem ser efetuados até 2 dias antes do evento');
    }
    
    // Criar documento de pagamento no Firestore
    const paymentRef = await firestore.collection('payments').add({
      activityId,
      userId,
      amount: activity.price,
      status: 'pending',
      createdAt: new Date()
    });
    
    // Chamar função do Firebase para criar sessão no Stripe
    // Em um ambiente real, isso seria uma Cloud Function
    const sessionData = {
      payment_id: paymentRef.id,
      success_url: window.location.origin + `/payment-success?payment_id=${paymentRef.id}`,
      cancel_url: window.location.origin + `/payment-cancel?payment_id=${paymentRef.id}`,
      customer_email: userId,
      line_items: [
        {
          name: activity.title,
          description: activity.description,
          amount: activity.price * 100, // Stripe usa centavos
          currency: 'brl',
          quantity: 1
        }
      ]
    };
    
    // Em um cenário real, faríamos uma chamada para uma API do Firebase Functions
    // para criar uma sessão no Stripe
    // Por enquanto, apenas simulamos isso
    console.log('Sessão de checkout criada:', sessionData);
    
    // Em um cenário real, o retorno seria algo como:
    return {
      id: 'cs_test_' + Math.random().toString(36).substring(2, 15),
      url: 'https://checkout.stripe.com/...'
    };
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    throw error;
  }
};

// Verificar status do pagamento
export const checkPaymentStatus = async (paymentId) => {
  try {
    const paymentDoc = await firestore.collection('payments').doc(paymentId).get();
    
    if (!paymentDoc.exists) {
      throw new Error('Pagamento não encontrado');
    }
    
    return paymentDoc.data();
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    throw error;
  }
};

// Simular processamento de pagamento Pix
export const createPixPayment = async (activityId, userId) => {
  try {
    // Buscar detalhes da atividade
    const activityDoc = await firestore.collection('activities').doc(activityId).get();
    
    if (!activityDoc.exists) {
      throw new Error('Atividade não encontrada');
    }
    
    const activity = activityDoc.data();
    
    // Criar documento de pagamento no Firestore
    const paymentRef = await firestore.collection('payments').add({
      activityId,
      userId,
      amount: activity.price,
      method: 'pix',
      status: 'pending',
      createdAt: new Date(),
      pixCode: 'PIX' + Math.random().toString(36).substring(2, 15).toUpperCase()
    });
    
    // Em um cenário real, integraríamos com uma API de Pix
    // Por enquanto, apenas simulamos o código
    return {
      id: paymentRef.id,
      pixCode: paymentRef.data().pixCode,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutos
    };
  } catch (error) {
    console.error('Erro ao criar pagamento Pix:', error);
    throw error;
  }
};
