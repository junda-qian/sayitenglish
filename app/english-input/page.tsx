'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EnglishInputPage() {
  const [isListening, setIsListening] = useState(false);
  const [englishWord, setEnglishWord] = useState('');
  const [generatedEnglish, setGeneratedEnglish] = useState('');
  const [japanese, setJapanese] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
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
    setEnglishWord('');
    setGeneratedEnglish('');
    setJapanese('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setEnglishWord(transcript);
      setIsListening(false);

      // Generate sentence and translate
      await generateAndTranslate(transcript);
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

  const generateAndTranslate = async (word: string) => {
    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/generate-from-english', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ englishWord: word }),
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const data = await response.json();
      setGeneratedEnglish(data.english);
      setJapanese(data.japanese);
      setSuccess(true);
    } catch (err) {
      console.error('Generation error:', err);
      setError('Failed to generate sentence. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
          >
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Learn English Word in Context
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Say an English word or phrase to generate a natural example sentence
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <button
              onClick={startListening}
              disabled={isListening || isGenerating}
              className={`
                px-12 py-6 rounded-full text-xl font-semibold shadow-lg transition-all
                ${isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
                }
                ${(isListening || isGenerating) ? 'cursor-not-allowed opacity-75' : ''}
              `}
            >
              {isListening ? '🎤 Listening...' : isGenerating ? 'Generating...' : '🎤 Speak English Word'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg">
              Sentence pair saved successfully!
            </div>
          )}

          {englishWord && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Your Word/Phrase
                </h3>
                <p className="text-lg text-gray-900 dark:text-white font-medium">
                  {englishWord}
                </p>
              </div>

              {generatedEnglish && (
                <>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      Example Sentence (English)
                    </h3>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {generatedEnglish}
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      Japanese Translation
                    </h3>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {japanese}
                    </p>
                  </div>
                </>
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
