import type { Term } from '@/lib/types';

interface TermCardProps {
  term: Term;
  onClick?: () => void;
}

export default function TermCard({ term, onClick }: TermCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-gray-100 hover:border-primary-200"
    >
      {/* ヘッダー */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{term.term}</h3>
          <p className="text-sm text-gray-500 mt-1">{term.reading}</p>
        </div>
        <span className="px-3 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded-full">
          {term.category}
        </span>
      </div>

      {/* 説明 */}
      <p className="text-gray-700 mb-4 line-clamp-2">{term.description}</p>

      {/* 使用例 */}
      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <p className="text-xs text-gray-500 mb-1">💡 使用例:</p>
        <p className="text-sm text-gray-700 line-clamp-2">{term.example}</p>
      </div>

      {/* 関連用語 */}
      {term.relatedTerms.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-xs text-gray-500">🔗 関連:</span>
          {term.relatedTerms.slice(0, 3).map((related, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
            >
              {related}
            </span>
          ))}
          {term.relatedTerms.length > 3 && (
            <span className="text-xs text-gray-400">
              +{term.relatedTerms.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
