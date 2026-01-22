
export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="flex flex-col items-center">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700 opacity-25"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-l-purple-600 animate-spin"></div>
        </div>
        <div className="mt-4 flex flex-col items-center">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
            Student Management
          </h1>
          <p className="text-sm text-gray-400 mt-2 animate-pulse">Initializing...</p>
        </div>
      </div>
    </div>
  );
}
