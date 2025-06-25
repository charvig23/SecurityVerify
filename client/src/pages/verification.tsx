import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import ProgressIndicator from "@/components/progress-indicator";
import DocumentUpload from "@/components/document-upload";
import SelfieCapture from "@/components/selfie-capture";
import VerificationResults from "@/components/verification-results";

type VerificationStep = "upload" | "selfie" | "verify" | "complete";

export default function Verification() {
  const [currentStep, setCurrentStep] = useState<VerificationStep>("upload");
  const [verificationId, setVerificationId] = useState<number | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);

  const steps = [
    { key: "upload", label: "Upload ID", number: 1 },
    { key: "selfie", label: "Selfie Capture", number: 2 },
    { key: "verify", label: "Verification", number: 3 },
    { key: "complete", label: "Complete", number: 4 },
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  const handleDocumentUploaded = (id: number, data: any) => {
    setVerificationId(id);
    setExtractedData(data);
    setCurrentStep("selfie");
  };

  const handleSelfieUploaded = () => {
    setCurrentStep("verify");
  };

  const handleVerificationComplete = () => {
    setCurrentStep("complete");
  };

  const canGoToPrevious = currentStepIndex > 0;
  const canGoToNext = currentStepIndex < steps.length - 1 && verificationId !== null;

  const goToPrevious = () => {
    if (canGoToPrevious) {
      setCurrentStep(steps[currentStepIndex - 1].key as VerificationStep);
    }
  };

  const goToNext = () => {
    if (canGoToNext) {
      setCurrentStep(steps[currentStepIndex + 1].key as VerificationStep);
    }
  };

  return (
    <div className="min-h-screen bg-surface-gray">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center">
                <Shield className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-medium text-gray-900">SecureVerify</h1>
                <p className="text-sm text-gray-500">Identity Verification System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <span className="sr-only">Help</span>
                ?
              </Button>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm">👤</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <ProgressIndicator
          currentStep={currentStep}
          steps={steps}
        />

        <div className="space-y-6">
          {currentStep === "upload" && (
            <DocumentUpload onDocumentUploaded={handleDocumentUploaded} />
          )}
          
          {currentStep === "selfie" && verificationId && (
            <SelfieCapture
              verificationId={verificationId}
              onSelfieUploaded={handleSelfieUploaded}
            />
          )}
          
          {currentStep === "verify" && verificationId && (
            <div className="verification-step active bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-medium">3</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Identity Verification</h3>
              </div>
              
              <p className="text-gray-600 mb-6">We'll compare your selfie with your ID photo and verify your age.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">🔍</div>
                  <p className="text-sm text-gray-500">OCR Processing</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">👤</div>
                  <p className="text-sm text-gray-500">Facial Recognition</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">📅</div>
                  <p className="text-sm text-gray-500">Age Verification</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleVerificationComplete}
                  className="bg-primary-blue hover:bg-primary-blue-dark text-white px-8 py-3"
                >
                  Start Verification
                </Button>
              </div>
            </div>
          )}
          
          {currentStep === "complete" && verificationId && (
            <VerificationResults verificationId={verificationId} />
          )}
        </div>

        {/* Security Info */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Shield className="text-primary-blue mt-1" size={20} />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Your Privacy & Security</h4>
                <p className="text-sm text-gray-600">
                  All uploaded documents are processed securely and deleted after verification. 
                  We use advanced encryption and comply with data protection regulations.
                </p>
                <Button variant="link" className="text-primary-blue p-0 mt-2 h-auto">
                  Learn more about our security practices
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden">
        <div className="flex justify-between items-center max-w-sm mx-auto">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={goToPrevious}
            disabled={!canGoToPrevious}
            className="disabled:text-gray-400"
          >
            <ArrowLeft size={16} className="mr-2" />
            Previous
          </Button>
          
          <div className="flex space-x-2">
            {steps.map((step, index) => (
              <div
                key={step.key}
                className={`w-2 h-2 rounded-full ${
                  index <= currentStepIndex ? 'bg-primary-blue' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={goToNext}
            disabled={!canGoToNext}
            className={`${canGoToNext ? 'bg-primary-blue text-white' : 'disabled:bg-gray-300 disabled:text-gray-500'}`}
          >
            Next
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
