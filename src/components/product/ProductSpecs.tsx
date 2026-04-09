import React from 'react';
import { SpecGroup } from '@/types';
import { Copy, Check } from 'lucide-react';

interface ProductSpecsProps {
  specs: SpecGroup[];
}

export const ProductSpecs: React.FC<ProductSpecsProps> = ({ specs }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const text = specs.map(g => 
      `${g.groupName.toUpperCase()}\n` + 
      g.specs.map(s => `${s.name}: ${s.value}`).join('\n')
    ).join('\n\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-display">Характеристики</h2>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors"
        >
          {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          {copied ? "Скопировано" : "Скопировать"}
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {specs.map((group, idx) => (
          <div key={idx}>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              {group.groupName}
            </h3>
            <div className="flex flex-col border-t border-gray-100">
              {group.specs.map((spec, sIdx) => (
                <div key={sIdx} className="flex flex-col sm:flex-row py-3 border-b border-gray-100 gap-1 sm:gap-4">
                  <div className="sm:w-1/3 text-gray-500 text-sm">
                    {spec.name}
                  </div>
                  <div className={`sm:w-2/3 text-sm ${spec.highlight ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
