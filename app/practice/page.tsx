'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SentencePair {
  id: number;
  japanese: string;
  english: string;
  isChecked: boolean;
  createdAt: string;
}

export default function PracticePage() {
  const [allSentences, setAllSentences] = useState<SentencePair[]>([]);
  const [practiceQueue, setPracticeQueue] = useState<SentencePair[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [includeChecked, setIncludeChecked] = useState(false);
  const [isPracticing, setIsPracticing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSentences();
  }, [includeChecked]);

  const loadSentences = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/sentences?includeChecked=${includeChecked}`);
      const data = await response.json();
      setAllSentences(data);
    } catch (error) {
      console.error('Error loading sentences:', error);
    } finally {
      setLoading(false);
    }
  };

  const startPractice = () => {
    if (allSentences.length === 0) return;

    // Shuffle sentences for random order
    const shuffled = [...allSentences].sort(() => Math.random() - 0.5);
    setPracticeQueue(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setIsPracticing(true);
  };

  const nextCard = () => {
    if (currentIndex < practiceQueue.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setIsPracticing(false);
    }
  };

  const toggleChecked = async (id: number, currentStatus: boolean) => {
    try {
      await fetch(`/api/sentences/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isChecked: !currentStatus }),
      });

      // Update local state
      setAllSentences(prev =>
        prev.map(s => s.id === id ? { ...s, isChecked: !currentStatus } : s)
      );
      setPracticeQueue(prev =>
        prev.map(s => s.id === id ? { ...s, isChecked: !currentStatus } : s)
      );
    } catch (error) {
      console.error('Error updating sentence:', error);
    }
  };

  const deleteSentence = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this sentence?')) {
      return;
    }

    try {
      await fetch('/api/sentences', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      // Update local state
      setAllSentences(prev => prev.filter(s => s.id !== id));
      setPracticeQueue(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting sentence:', error);
      alert('Failed to delete sentence. Please try again.');
    }
  };

  const currentSentence = practiceQueue[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <p className="text-xl text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Practice English
        </h1>

        {!isPracticing ? (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Sentence List
                </h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeChecked}
                    onChange={(e) => setIncludeChecked(e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    Include checked sentences
                  </span>
                </label>
              </div>

              {allSentences.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No sentences yet. Add some first!
                  </p>
                  <Link
                    href="/input"
                    className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition-colors"
                  >
                    Add Sentences
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {allSentences.map((sentence) => (
                    <div
                      key={sentence.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={sentence.isChecked}
                        onChange={() => toggleChecked(sentence.id, sentence.isChecked)}
                        className="mt-1 w-5 h-5 rounded flex-shrink-0"
                      />
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white font-medium">
                          {sentence.japanese}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {sentence.english}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteSentence(sentence.id)}
                        className="mt-1 px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors flex-shrink-0"
                        title="Delete sentence"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {allSentences.length > 0 && (
                <button
                  onClick={startPractice}
                  className="w-full px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-green-700 transition-colors"
                >
                  Start Practice ({allSentences.length} sentences)
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <div className="mb-4 text-center text-gray-600 dark:text-gray-400">
              Card {currentIndex + 1} of {practiceQueue.length}
            </div>

            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-lg p-8 mb-6 min-h-48 flex items-center justify-center">
              <p className="text-3xl text-gray-900 dark:text-white text-center font-medium">
                {currentSentence.japanese}
              </p>
            </div>

            {showAnswer && (
              <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6 mb-6">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Answer:
                </h3>
                <p className="text-2xl text-gray-900 dark:text-white">
                  {currentSentence.english}
                </p>
              </div>
            )}

            <div className="flex gap-4">
              {!showAnswer ? (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="flex-1 px-6 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors"
                >
                  Show Answer
                </button>
              ) : (
                <>
                  <button
                    onClick={() => toggleChecked(currentSentence.id, currentSentence.isChecked)}
                    className={`flex-1 px-6 py-4 text-lg font-semibold rounded-lg shadow transition-colors ${
                      currentSentence.isChecked
                        ? 'bg-gray-400 hover:bg-gray-500 text-white'
                        : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    }`}
                  >
                    {currentSentence.isChecked ? 'Uncheck' : 'Mark as Practiced'}
                  </button>
                  <button
                    onClick={nextCard}
                    className="flex-1 px-6 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg shadow hover:bg-green-700 transition-colors"
                  >
                    {currentIndex < practiceQueue.length - 1 ? 'Next' : 'Finish'}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setIsPracticing(false)}
              className="w-full mt-4 px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Exit Practice
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
