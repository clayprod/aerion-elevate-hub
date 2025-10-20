import React from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error";
  title: string;
  message: string;
  buttonText?: string;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  buttonText = "Entendi"
}) => {
  const isSuccess = type === "success";
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </button>
          
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isSuccess 
                ? "bg-green-100 text-green-600" 
                : "bg-red-100 text-red-600"
            }`}>
              {isSuccess ? (
                <CheckCircle className="w-10 h-10" />
              ) : (
                <XCircle className="w-10 h-10" />
              )}
            </div>
          </div>
          
          {/* Title */}
          <DialogTitle className="text-xl font-bold text-gray-900 mb-2">
            {title}
          </DialogTitle>
          
          {/* Message */}
          <p className="text-gray-600 text-sm leading-relaxed">
            {message}
          </p>
        </DialogHeader>
        
        {/* Action Button */}
        <div className="flex justify-center mt-6">
          <Button
            onClick={onClose}
            className={`w-full max-w-xs font-semibold text-white ${
              isSuccess
                ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            }`}
          >
            {buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
