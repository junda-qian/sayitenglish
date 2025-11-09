import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center gap-8 px-8 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          Say It English
        </h1>
        <p className="max-w-md text-lg text-gray-700 dark:text-gray-300">
          Build your English vocabulary with AI-powered practice
        </p>

        <div className="flex flex-col gap-4 w-full max-w-md mt-8">
          <Link
            href="/input"
            className="flex flex-col items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
          >
            <span className="text-lg font-semibold">🇯🇵 → 🇬🇧 Japanese to English</span>
            <span className="text-sm mt-1 opacity-90">Speak Japanese, get English translation</span>
          </Link>

          <Link
            href="/english-input"
            className="flex flex-col items-center justify-center px-8 py-4 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-colors"
          >
            <span className="text-lg font-semibold">📚 English Word in Context</span>
            <span className="text-sm mt-1 opacity-90">Speak English word, get example sentence</span>
          </Link>

          <Link
            href="/practice"
            className="flex items-center justify-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-green-700 transition-colors"
          >
            Practice Sentences
          </Link>
        </div>
      </main>
    </div>
  );
}
