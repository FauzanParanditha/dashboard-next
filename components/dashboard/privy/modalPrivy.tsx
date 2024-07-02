import React from "react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  url: string;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, url }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 xl:w-1/3 h-3/4 relative">
        <button
          className="absolute top-2 right-2 text-gray-700"
          onClick={onClose}
        >
          X
        </button>
        <iframe
          src={url}
          title="Registration Form"
          className="w-full h-full rounded-lg"
        />
      </div>
    </div>
  );
};

export default Modal;
