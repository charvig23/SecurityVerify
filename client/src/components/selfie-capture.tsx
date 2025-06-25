import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, RotateCcw, Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Webcam from "react-webcam";

interface SelfieCaptureProps {
  verificationId: number;
  onSelfieUploaded: () => void;
}

export default function SelfieCapture({ verificationId, onSelfieUploaded }: SelfieCaptureProps) {
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (imageData: string) => {
      // Convert base64 to blob
      const response = await fetch(imageData);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('selfie', blob, 'selfie.jpg');
      formData.append('verificationId', verificationId.toString());
      
      const uploadResponse = await fetch('/api/upload-selfie', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload selfie');
      }
      
      return uploadResponse.json();
    },
    onSuccess: () => {
      toast({
        title: "Selfie uploaded successfully",
        description: "Your selfie has been captured and uploaded.",
      });
      onSelfieUploaded();
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload selfie. Please try again.",
        variant: "destructive",
      });
    },
  });

  const activateCamera = () => {
    setCameraActive(true);
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
  };

  const confirmSelfie = () => {
    if (capturedImage) {
      uploadMutation.mutate(capturedImage);
    }
  };

  return (
    <div className="verification-step active bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center mr-3">
          <span className="text-white text-sm font-medium">2</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Take a Live Selfie</h3>
      </div>
      
      <p className="text-gray-600 mb-6">
        Capture a clear selfie to verify your identity against your ID document.
      </p>
      
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        {!cameraActive && !capturedImage && (
          <div>
            <div className="w-64 h-64 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Camera className="text-gray-400" size={64} />
            </div>
            <p className="text-gray-500 mb-4">Click below to activate your camera</p>
            <Button 
              onClick={activateCamera}
              className="bg-primary-blue hover:bg-primary-blue-dark text-white px-6 py-2"
            >
              Activate Camera
            </Button>
          </div>
        )}

        {cameraActive && !capturedImage && (
          <div>
            <div className="w-80 h-60 mx-auto mb-4 rounded-lg overflow-hidden">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                mirrored={true}
              />
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Position your face in the center and ensure good lighting
              </p>
              <Button 
                onClick={capture}
                className="bg-primary-blue hover:bg-primary-blue-dark text-white px-8 py-3"
              >
                <Camera size={20} className="mr-2" />
                Capture Selfie
              </Button>
            </div>
          </div>
        )}

        {capturedImage && (
          <div>
            <div className="w-80 h-60 mx-auto mb-4 rounded-lg overflow-hidden">
              <img 
                src={capturedImage} 
                alt="Captured selfie" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={retake}
                variant="outline"
                className="px-6 py-2"
              >
                <RotateCcw size={16} className="mr-2" />
                Retake
              </Button>
              <Button 
                onClick={confirmSelfie}
                disabled={uploadMutation.isPending}
                className="bg-success-green hover:bg-green-600 text-white px-6 py-2"
              >
                <Check size={16} className="mr-2" />
                {uploadMutation.isPending ? "Uploading..." : "Confirm"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Tips for a good selfie:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Face the camera directly</li>
          <li>• Remove glasses if possible</li>
          <li>• Ensure good lighting</li>
          <li>• Keep a neutral expression</li>
          <li>• Make sure your entire face is visible</li>
        </ul>
      </div>
    </div>
  );
}
