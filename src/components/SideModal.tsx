import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface SideModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

const SideModal: React.FC<SideModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Fond semi-transparent (désactivé pour éviter la fermeture au clic) */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Contenu du modal */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="relative w-[40%] h-full bg-white shadow-lg flex flex-col"
      >
        {/* Header avec bouton de fermeture (optionnel) */}
        {onClose && (
          <div className="p-1 flex justify-end items-center">
            <button onClick={onClose} className="text-gray-500 hover:text-black">
              <X size={24} />
            </button>
          </div>
        )}

        {/* Contenu dynamique */}
        <div className="p-6 flex-1 overflow-auto">{children}</div>
      </motion.div>
    </div>
  );
};

export default SideModal;
