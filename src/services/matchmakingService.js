
import { firestore } from './firebase';

// Função para buscar usuários compatíveis com base em interesses
export const findCompatibleUsers = async (userId, filters = {}) => {
  try {
    // Obter dados do usuário atual
    const userDoc = await firestore.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      throw new Error('Usuário não encontrado');
    }
    
    const userData = userDoc.data();
    const userInterests = userData.interests || [];
    
    // Iniciar consulta para encontrar usuários compatíveis
    let query = firestore.collection('users')
      .where('isAvailable', '==', true)
      .where('id', '!=', userId);
    
    // Aplicar filtros se fornecidos
    if (filters.minRating) {
      query = query.where('averageRating', '>=', filters.minRating);
    }
    
    if (filters.location) {
      // Consulta por localização (num cenário real, usaríamos GeoFirestore para consulta por distância)
      query = query.where('city', '==', filters.location);
    }
    
    const snapshot = await query.limit(20).get();
    
    // Processar resultados e calcular pontuação de compatibilidade
    const compatibleUsers = [];
    
    snapshot.forEach(doc => {
      const potentialMatch = doc.data();
      const matchInterests = potentialMatch.interests || [];
      
      // Calcular interesses em comum
      const commonInterests = userInterests.filter(interest => 
        matchInterests.includes(interest)
      );
      
      // Calcular pontuação de compatibilidade
      const compatibilityScore = calculateCompatibility(
        userData,
        potentialMatch,
        commonInterests.length
      );
      
      compatibleUsers.push({
        id: doc.id,
        ...potentialMatch,
        compatibilityScore,
        commonInterests
      });
    });
    
    // Ordenar por pontuação de compatibilidade
    return compatibleUsers.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  } catch (error) {
    console.error('Erro no matchmaking:', error);
    throw error;
  }
};

// Função para calcular pontuação de compatibilidade
const calculateCompatibility = (user1, user2, commonInterestsCount) => {
  let score = 0;
  
  // Pontos por interesses em comum (maior peso)
  score += commonInterestsCount * 10;
  
  // Pontos por avaliação
  const rating2 = user2.averageRating || 0;
  score += rating2 * 5;
  
  // Pontos por experiência (número de atividades concluídas)
  const activities2 = user2.completedActivities || 0;
  score += Math.min(activities2, 10) * 2;
  
  // Outras métricas podem ser adicionadas aqui
  
  return Math.round(score);
};

// Função para recomendar atividades com base em interesses
export const recommendActivities = async (userId) => {
  try {
    // Obter dados do usuário
    const userDoc = await firestore.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      throw new Error('Usuário não encontrado');
    }
    
    const userData = userDoc.data();
    const userInterests = userData.interests || [];
    
    // Buscar atividades relacionadas aos interesses
    const activitiesSnapshot = await firestore
      .collection('activities')
      .where('status', '==', 'active')
      .limit(20)
      .get();
    
    const activities = [];
    
    activitiesSnapshot.forEach(doc => {
      const activity = doc.data();
      const activityTags = activity.tags || [];
      
      // Verificar tags em comum com interesses
      const commonTags = userInterests.filter(interest => 
        activityTags.includes(interest)
      );
      
      // Calcular pontuação de relevância
      const relevanceScore = commonTags.length * 10 + (activity.averageRating || 0) * 5;
      
      activities.push({
        id: doc.id,
        ...activity,
        relevanceScore,
        commonTags
      });
    });
    
    // Ordenar por relevância
    return activities.sort((a, b) => b.relevanceScore - a.relevanceScore);
  } catch (error) {
    console.error('Erro ao recomendar atividades:', error);
    throw error;
  }
};
