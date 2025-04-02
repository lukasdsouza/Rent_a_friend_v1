
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { firestore } from '../services/firebase';

const UserRatings = ({ userId }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const ratingsSnapshot = await firestore
          .collection('ratings')
          .where('targetUserId', '==', userId)
          .orderBy('createdAt', 'desc')
          .limit(10)
          .get();

        const ratingsData = [];

        for (const doc of ratingsSnapshot.docs) {
          const rating = doc.data();
          const userSnapshot = await firestore
            .collection('users')
            .doc(rating.ratedByUserId)
            .get();

          if (userSnapshot.exists) {
            const userData = userSnapshot.data();
            ratingsData.push({
              id: doc.id,
              ...rating,
              raterName: userData.displayName || 'Usuário Anônimo',
              raterPhoto: userData.photoURL || null
            });
          }
        }

        setRatings(ratingsData);
      } catch (err) {
        console.error('Erro ao buscar avaliações:', err);
        setError('Não foi possível carregar as avaliações.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRatings();
    }
  }, [userId]);

  if (loading) {
    return <div className="text-center py-4">Carregando avaliações...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  if (ratings.length === 0) {
    return <div className="text-center py-4">Este usuário ainda não recebeu avaliações.</div>;
  }

  return (
    <div className="user-ratings">
      <h3 className="text-lg font-semibold mb-4">Avaliações Recebidas</h3>
      
      <div className="space-y-4">
        {ratings.map((rating) => (
          <div key={rating.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              {rating.raterPhoto ? (
                <img 
                  src={rating.raterPhoto} 
                  alt={rating.raterName} 
                  className="w-8 h-8 rounded-full mr-2"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
              )}
              <span className="font-medium">{rating.raterName}</span>
            </div>
            
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={`h-5 w-5 ${
                    star <= rating.rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            
            {rating.feedback && <p className="text-sm">{rating.feedback}</p>}
            
            <div className="text-xs text-gray-500 mt-2">
              {new Date(rating.createdAt.toDate()).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserRatings;
