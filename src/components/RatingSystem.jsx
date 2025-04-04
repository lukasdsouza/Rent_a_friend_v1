
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { firestore } from '../services/firebase';

const RatingSystem = ({ targetUserId, currentUserId, afterRating }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Por favor, selecione uma avaliação de 1 a 5 estrelas');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Salvar a avaliação no Firestore
      await firestore.collection('ratings').add({
        targetUserId,
        ratedByUserId: currentUserId,
        rating,
        feedback,
        createdAt: new Date()
      });

      // Atualizar o rating médio do usuário alvo
      const userRef = firestore.collection('users').doc(targetUserId);
      
      // Obter todas as avaliações do usuário
      const ratingsSnapshot = await firestore
        .collection('ratings')
        .where('targetUserId', '==', targetUserId)
        .get();
      
      const ratings = ratingsSnapshot.docs.map(doc => doc.data().rating);
      const totalRatings = ratings.length;
      const averageRating = ratings.reduce((sum, r) => sum + r, 0) / totalRatings;
      
      // Atualizar o documento do usuário
      await userRef.update({
        averageRating,
        totalRatings
      });
      
      setSuccess('Avaliação enviada com sucesso!');
      setRating(0);
      setFeedback('');
      
      if (typeof afterRating === 'function') {
        afterRating();
      }
    } catch (err) {
      console.error('Erro ao enviar avaliação:', err);
      setError('Não foi possível enviar sua avaliação. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rating-system bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold mb-4">Avaliar esta experiência</h3>
      
      <form onSubmit={handleRatingSubmit}>
        <div className="star-rating flex mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="text-2xl focus:outline-none"
            >
              <Star 
                className={`h-8 w-8 ${
                  star <= (hoveredRating || rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label htmlFor="feedback" className="block mb-2 text-sm font-medium">
            Seu feedback:
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            rows="3"
            placeholder="Compartilhe sua experiência..."
          />
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-400"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
        </button>
      </form>
    </div>
  );
};

export default RatingSystem;
