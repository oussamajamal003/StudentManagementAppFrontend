import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-red-100 p-4 rounded-full mb-6"
      >
        <ShieldAlert className="w-12 h-12 text-red-600" />
      </motion.div>
      
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        Access Denied
      </h1>
      
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        You do not have permission to view this page. Please contact your administrator if you believe this is an error.
      </p>

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Go Back
      </button>
    </div>
  );
}
