'use client';

import type { Term } from '@/lib/types';
import { useEffect } from 'react';

interface TermModalProps {
  term: Term | null;
  onClose: () => void;
}

export default function TermModal({ term, onClose }: TermModalProps) {
  useEffect(() => {
    if (term) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [term]);

  if (!term) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{term.term}</h2>
            <p className="text-lg text-gray-500">{term.reading}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6 space-y-6">
          {/* カテゴリ */}
          <div>
            <span className="inline-flex items-center px-4 py-2 text-sm font-medium bg-primary-50 text-primary-700 rounded-full">
              📁 {term.category}
            </span>
          </div>

          {/* 説明 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">説明</h3>
            <p className="text-lg text-gray-700 leading-relaxed">{term.description}</p>
          </div>

          {/* 使用例 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">💡 使用例</h3>
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-primary-500">
              <p className="text-gray-700 font-mono text-sm">{term.example}</p>
            </div>
          </div>

          {/* 関連用語 */}
          {term.relatedTerms.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">🔗 関連用語</h3>
              <div className="flex flex-wrap gap-2">
                {term.relatedTerms.map((related, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors cursor-pointer"
                  >
                    {related}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
