
import { firestore } from './firebase';

// Verificar se um pagamento está relacionado a uma atividade
export const checkActivityPaymentStatus = async (activityId, userId) => {
  try {
    const paymentsRef = await firestore.collection('payments')
      .where('activityId', '==', activityId)
      .where('userId', '==', userId)
      .where('status', '==', 'completed')
      .limit(1)
      .get();
    
    return !paymentsRef.empty;
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    throw error;
  }
};

// Função para prevenir a troca de "amigo" após a reserva
export const lockActivityAfterPayment = async (activityId) => {
  try {
    // Verificar se existe algum pagamento para esta atividade
    const paymentsRef = await firestore.collection('payments')
      .where('activityId', '==', activityId)
      .where('status', '==', 'completed')
      .limit(1)
      .get();
    
    if (!paymentsRef.empty) {
      // Se há pagamento, bloquear alterações na atividade
      await firestore.collection('activities').doc(activityId).update({
        locked: true,
        lockedAt: new Date()
      });
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Erro ao bloquear atividade:', error);
    throw error;
  }
};

// Inicializar Stripe
const initializeStripe = async () => {
  const stripe = await loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY);
  return stripe;
};

// Criar sessão de checkout
export const createCheckoutSession = async (activityId, userId) => {
  try {
    // Verificar se o usuário já pagou por esta atividade
    const alreadyPaid = await checkActivityPaymentStatus(activityId, userId);
    if (alreadyPaid) {
      throw new Error('Você já realizou o pagamento para esta atividade');
    }

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
    // Verificar se o usuário já pagou por esta atividade
    const alreadyPaid = await checkActivityPaymentStatus(activityId, userId);
    if (alreadyPaid) {
      throw new Error('Você já realizou o pagamento para esta atividade');
    }
    
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

// Finalizar pagamento e aplicar comissão
export const completePayment = async (paymentId) => {
  try {
    // Obter detalhes do pagamento
    const paymentDoc = await firestore.collection('payments').doc(paymentId).get();
    
    if (!paymentDoc.exists) {
      throw new Error('Pagamento não encontrado');
    }
    
    const payment = paymentDoc.data();
    
    if (payment.status === 'completed') {
      return { success: true, alreadyCompleted: true };
    }
    
    // Calcular comissão (15% padrão, 10% para usuários premium)
    const activityDoc = await firestore.collection('activities').doc(payment.activityId).get();
    const activity = activityDoc.data();
    const friendId = activity.createdBy;
    
    // Verificar se o amigo é premium para aplicar taxa reduzida
    const friendDoc = await firestore.collection('users').doc(friendId).get();
    const isPremium = friendDoc.exists && friendDoc.data().subscriptionStatus === 'active' && 
                     friendDoc.data().subscriptionPlan === 'premium';
    
    const commissionRate = isPremium ? 0.10 : 0.15; // 10% para premium, 15% para outros
    const commission = payment.amount * commissionRate;
    const netAmount = payment.amount - commission;
    
    // Atualizar pagamento
    await firestore.collection('payments').doc(paymentId).update({
      status: 'completed',
      commission,
      netAmount,
      completedAt: new Date()
    });
    
    // Atualizar saldo do amigo
    const currentBalance = friendDoc.data().balance || 0;
    await firestore.collection('users').doc(friendId).update({
      balance: currentBalance + netAmount
    });
    
    // Bloquear alterações na atividade após o pagamento
    await lockActivityAfterPayment(payment.activityId);
    
    return {
      success: true,
      paymentId,
      amount: payment.amount,
      commission,
      netAmount
    };
  } catch (error) {
    console.error('Erro ao completar pagamento:', error);
    throw error;
  }
};
