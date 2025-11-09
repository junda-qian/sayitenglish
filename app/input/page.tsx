'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InputPage() {
  const [isListening, setIsListening] = useState(false);
  const [japanese, setJapanese] = useState('');
  const [english, setEnglish] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if browser supports speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      }
    }
  }, []);

  const startListening = () => {
    setError('');
    setSuccess(false);
    setJapanese('');
    setEnglish('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'ja-JP';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setJapanese(transcript);
      setIsListening(false);

      // Translate
      await translateAndSave(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const translateAndSave = async (japaneseText: string) => {
    setIsTranslating(true);
    setError('');

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ japanese: japaneseText }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      setEnglish(data.english);
      setSuccess(true);
    } catch (err) {
      console.error('Translation error:', err);
      setError('Failed to translate. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Add New Sentence
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <button
              onClick={startListening}
              disabled={isListening || isTranslating}
              className={`
                px-12 py-6 rounded-full text-xl font-semibold shadow-lg transition-all
                ${isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }
                ${(isListening || isTranslating) ? 'cursor-not-allowed opacity-75' : ''}
              `}
            >
              {isListening ? '🎤 Listening...' : isTranslating ? 'Translating...' : '🎤 Speak Japanese'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg">
              Sentence saved successfully!
            </div>
          )}

          {japanese && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Japanese
                </h3>
                <p className="text-lg text-gray-900 dark:text-white">
                  {japanese}
                </p>
              </div>

              {english && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    English Translation
                  </h3>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {english}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/practice"
            className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors"
          >
            Go to Practice
          </Link>
        </div>
      </div>
    </div>
  );
}
