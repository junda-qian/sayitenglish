import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center gap-8 px-8 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          Say It English
        </h1>
        <p className="max-w-md text-lg text-gray-700 dark:text-gray-300">
          Practice speaking English by translating Japanese sentences
        </p>

        <div className="flex flex-col gap-4 w-full max-w-md mt-8">
          <Link
            href="/input"
            className="flex items-center justify-center px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
          >
            Add New Sentences
          </Link>

          <Link
            href="/practice"
            className="flex items-center justify-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-green-700 transition-colors"
          >
            Practice English
          </Link>
        </div>
      </main>
    </div>
  );
}
