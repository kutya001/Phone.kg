import React, { useState } from 'react';
import { ProductReview } from '@/types';
import { StarRating } from '@/components/ui/StarRating';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ThumbsUp, Flag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ReviewsBlockProps {
  reviews: ProductReview[];
  rating: number;
  reviewCount: number;
}

export const ReviewsBlock: React.FC<ReviewsBlockProps> = ({ reviews, rating, reviewCount }) => {
  const [sort, setSort] = useState<'helpful' | 'newest' | 'highest' | 'lowest'>('helpful');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  // Calculate rating distribution
  const distribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    return {
      stars,
      count,
      percentage: reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0
    };
  });

  const filteredReviews = filterRating 
    ? reviews.filter(r => r.rating === filterRating)
    : reviews;

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sort === 'helpful') return b.helpful - a.helpful;
    if (sort === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sort === 'highest') return b.rating - a.rating;
    if (sort === 'lowest') return a.rating - b.rating;
    return 0;
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <h2 className="text-2xl font-bold font-display">Отзывы покупателей</h2>
        <Button>Написать отзыв</Button>
      </div>

      {/* Rating Summary */}
      <div className="flex flex-col md:flex-row gap-8 bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
        <div className="flex flex-col items-center justify-center md:w-1/3 md:border-r border-gray-200 gap-2">
          <div className="text-5xl font-bold font-display text-gray-900">{rating.toFixed(1)}</div>
          <StarRating rating={rating} size="lg" />
          <div className="text-sm text-gray-500 mt-1">{reviewCount} отзывов</div>
        </div>
        
        <div className="flex-1 flex flex-col gap-2">
          {distribution.map(({ stars, count, percentage }) => (
            <button 
              key={stars}
              onClick={() => setFilterRating(filterRating === stars ? null : stars)}
              className="flex items-center gap-3 text-sm group"
            >
              <div className="w-8 text-right font-medium text-gray-600 group-hover:text-primary">{stars} ★</div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${filterRating === stars ? 'bg-primary' : 'bg-yellow-400 group-hover:bg-yellow-500'}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="w-10 text-left text-gray-500">{percentage}%</div>
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {filterRating && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-primary text-sm">
              Только {filterRating} ★
              <button onClick={() => setFilterRating(null)} className="ml-1 hover:text-primary-dark">✕</button>
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Сортировка:</span>
          <select 
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="helpful">Сначала полезные</option>
            <option value="newest">Сначала новые</option>
            <option value="highest">Сначала высокие оценки</option>
            <option value="lowest">Сначала низкие оценки</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="flex flex-col gap-6">
        {sortedReviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Отзывов пока нет.</p>
          </div>
        ) : (
          sortedReviews.map(review => (
            <div key={review.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                    {review.authorAvatar ? <img src={review.authorAvatar} alt={review.authorName} className="w-full h-full rounded-full object-cover" /> : review.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{review.authorName}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <time dateTime={review.date}>
                        {formatDistanceToNow(new Date(review.date), { addSuffix: true, locale: ru })}
                      </time>
                      {review.verified && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-success font-medium">
                            <CheckCircle2 className="h-3 w-3" />
                            Купил товар
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>

              {review.usagePeriod && (
                <div className="text-sm text-gray-500 bg-gray-50 inline-flex px-3 py-1 rounded-md self-start">
                  Опыт использования: {
                    review.usagePeriod === 'less-1-month' ? 'Менее месяца' :
                    review.usagePeriod === '1-6 months' ? 'Несколько месяцев' :
                    review.usagePeriod === '6-12-months' ? 'Полгода' : 'Более года'
                  }
                </div>
              )}

              <div className="flex flex-col gap-3 text-sm text-gray-700">
                {review.pros && (
                  <div>
                    <span className="font-bold text-gray-900 mr-2">Достоинства:</span>
                    {review.pros}
                  </div>
                )}
                {review.cons && (
                  <div>
                    <span className="font-bold text-gray-900 mr-2">Недостатки:</span>
                    {review.cons}
                  </div>
                )}
                <div>
                  <span className="font-bold text-gray-900 mr-2 block mb-1">Комментарий:</span>
                  <p className="leading-relaxed">{review.comment}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-50">
                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors">
                  <ThumbsUp className="h-4 w-4" />
                  Полезно ({review.helpful})
                </button>
                <button className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                  <Flag className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
