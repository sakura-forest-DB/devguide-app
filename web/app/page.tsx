'use client';

import { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import TermCard from '@/components/TermCard';
import TermModal from '@/components/TermModal';
import type { Term } from '@/lib/types';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);

  // データを読み込む
  useEffect(() => {
    fetch('/glossary.json')
      .then(res => res.json())
      .then(data => {
        setTerms(data.terms);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load glossary:', error);
        setLoading(false);
      });
  }, []);

  // カテゴリ一覧を取得
  const categories = useMemo(() => {
    const cats = new Set(terms.map(term => term.category));
    return Array.from(cats).sort();
  }, [terms]);

  // Fuse.jsの設定
  const fuse = useMemo(() => {
    if (terms.length === 0) return null;
    return new Fuse(terms, {
      keys: [
        { name: 'term', weight: 2 },
        { name: 'reading', weight: 1.5 },
        { name: 'category', weight: 1 },
        { name: 'description', weight: 1 },
        { name: 'relatedTerms', weight: 0.5 }
      ],
      threshold: 0.4,
      includeScore: true
    });
  }, [terms]);

  // フィルタリング＆検索
  const filteredTerms = useMemo(() => {
    let result = terms;

    // カテゴリでフィルタ
    if (selectedCategory) {
      result = result.filter(term => term.category === selectedCategory);
    }

    // 検索クエリでフィルタ
    if (searchQuery.trim() && fuse) {
      const searchResults = fuse.search(searchQuery);
      const searchedTerms = searchResults.map(r => r.item);

      // カテゴリフィルタが適用されている場合は、さらに絞り込む
      if (selectedCategory) {
        result = searchedTerms.filter(term => term.category === selectedCategory);
      } else {
        result = searchedTerms;
      }
    }

    return result;
  }, [terms, selectedCategory, searchQuery, fuse]);

  // ローディング中
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-xl text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-primary-600 to-primary-500 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-center">
            🎓 DevGuide
          </h1>
          <p className="text-primary-100 text-center text-lg">
            開発初心者向け用語検索ツール
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 -mt-6">
        {/* 検索バー */}
        <div className="mb-8">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="用語を検索... (例: Git, API, npm)"
          />
        </div>

        {/* カテゴリフィルタ */}
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* 結果表示 */}
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{filteredTerms.length}</span> 件の用語
            {searchQuery && <span> （検索: 「{searchQuery}」）</span>}
            {selectedCategory && <span> （カテゴリ: {selectedCategory}）</span>}
          </p>
        </div>

        {/* 用語カード一覧 */}
        {filteredTerms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTerms.map((term) => (
              <TermCard
                key={term.term}
                term={term}
                onClick={() => setSelectedTerm(term)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              用語が見つかりませんでした
            </h3>
            <p className="text-gray-500">
              別のキーワードやカテゴリで試してみてください
            </p>
          </div>
        )}
      </div>

      {/* 用語詳細モーダル */}
      <TermModal term={selectedTerm} onClose={() => setSelectedTerm(null)} />
    </div>
  );
}
