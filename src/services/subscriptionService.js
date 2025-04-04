
import { firestore, auth } from './firebase';

// Gerenciar assinaturas dos "amigos"
export const createSubscription = async (userId, planId, paymentMethodId) => {
  try {
    // Em um sistema real, isso se conectaria ao gateway de pagamento como Stripe
    // para criar uma assinatura recorrente

    // Registrar assinatura no banco de dados
    await firestore.collection('subscriptions').add({
      userId,
      planId,
      status: 'active',
      startDate: new Date(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 dias
      createdAt: new Date()
    });

    // Atualizar status do usuário para "premium"
    await firestore.collection('users').doc(userId).update({
      subscriptionStatus: 'active',
      role: 'friend',
      updatedAt: new Date()
    });

    return true;
  } catch (error) {
    console.error("Erro ao criar assinatura:", error);
    throw error;
  }
};

export const cancelSubscription = async (subscriptionId) => {
  try {
    // Em um sistema real, isso se conectaria ao gateway de pagamento
    // para cancelar a assinatura recorrente

    // Atualizar status da assinatura no banco de dados
    await firestore.collection('subscriptions').doc(subscriptionId).update({
      status: 'cancelled',
      cancelDate: new Date(),
      updatedAt: new Date()
    });

    return true;
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error);
    throw error;
  }
};

// Verificar status da assinatura
export const checkSubscriptionStatus = async (userId) => {
  try {
    const subscriptionsRef = await firestore.collection('subscriptions')
      .where('userId', '==', userId)
      .where('status', '==', 'active')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (subscriptionsRef.empty) {
      return { active: false };
    }

    const subscription = subscriptionsRef.docs[0].data();
    return {
      active: true,
      subscription: {
        id: subscriptionsRef.docs[0].id,
        ...subscription
      }
    };
  } catch (error) {
    console.error("Erro ao verificar status da assinatura:", error);
    throw error;
  }
};

// Calcular comissão automática sobre pagamentos
export const calculateCommission = (paymentAmount, commissionRate = 0.15) => {
  return paymentAmount * commissionRate;
};

// Processar pagamento com comissão
export const processPaymentWithCommission = async (activityId, userId, amount) => {
  try {
    // Calcular comissão (15% por padrão)
    const commission = calculateCommission(amount);
    const netAmount = amount - commission;

    // Registrar pagamento e comissão no banco de dados
    const paymentRef = await firestore.collection('payments').add({
      activityId,
      userId,
      totalAmount: amount,
      commission,
      netAmount,
      status: 'completed',
      createdAt: new Date()
    });

    // Atualizar saldo do "amigo" que ofereceu a atividade
    const activityDoc = await firestore.collection('activities').doc(activityId).get();
    const friendId = activityDoc.data().createdBy;

    const friendDoc = await firestore.collection('users').doc(friendId).get();
    const currentBalance = friendDoc.data().balance || 0;

    await firestore.collection('users').doc(friendId).update({
      balance: currentBalance + netAmount
    });

    return {
      success: true,
      paymentId: paymentRef.id
    };
  } catch (error) {
    console.error("Erro ao processar pagamento com comissão:", error);
    throw error;
  }
};
