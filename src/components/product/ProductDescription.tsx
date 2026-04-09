import React from 'react';

interface ProductDescriptionProps {
  description: string;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {
  return (
    <div className="prose prose-blue max-w-none">
      <h2 className="text-2xl font-bold font-display mb-6">Описание</h2>
      <div 
        className="text-gray-700 leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};
