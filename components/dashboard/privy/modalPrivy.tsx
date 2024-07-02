import {
  Dialog,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import React, { Fragment } from "react";
import { HiOutlineX } from "react-icons/hi";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  url: string;
}

const Modal = ({ isOpen = false, setIsOpen, url }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Transition as={Dialog} show={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 z-[9999]">
        <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-4xl p-6 my-8 overflow-hidden transform transition-all">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full p-6 overflow-hidden text-left align-middle">
              <DialogTitle
                as="h3"
                className="flex justify-between text-lg font-medium leading-6 py-2 text-gray-900 dark:text-white"
              >
                Title
                <button
                  type="button"
                  className="bg-rose-50 rounded-full p-1 text-sm font-semibold"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                >
                  <HiOutlineX className="text-rose-600 h-5 w-5" />
                </button>
              </DialogTitle>
              <div className="border border-red-800 my-1">
                <iframe
                  src={url}
                  style={{ width: "100%", height: "500px", border: "none" }}
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Transition>
  );
};

export default Modal;
