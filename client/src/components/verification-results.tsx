import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, Award, Download, RefreshCw } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import QualityFeedback from "./quality-feedback";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface VerificationResultsProps {
  verificationId: number;
}

interface VerificationRecord {
  status: string;
  identityVerified: boolean;
  ageVerified: boolean;
  faceMatchScore?: number;
  faceConfidence?: number;
  detectedAge?: number;
  ageConfidence?: number;
  extractedAge?: number;
  ocrConfidence?: number;
  extractedName?: string;
  extractedDob?: string;
  ocrLanguage?: string;
  completedAt?: string;
  results?: {
    feedback?: any;
  };
}

export default function VerificationResults({ verificationId }: VerificationResultsProps) {
  const { toast } = useToast();

  const { data: verificationRecord, isLoading } = useQuery<VerificationRecord>({
    queryKey: [`/api/verification/${verificationId}`],
    refetchInterval: 2000, // Poll every 2 seconds until completed
    refetchIntervalInBackground: false,
  });

  const processVerificationMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/process-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verificationId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process verification');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Verification processed",
        description: "Your verification has been completed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Processing failed",
        description: error.message || "Failed to process verification. Please try again.",
        variant: "destructive",
      });
    },
  });

  const startVerification = () => {
    processVerificationMutation.mutate();
  };

  const handleDownloadPDF = async () => {
    const element = document.querySelector(".verification-step.active");
    if (!element) return;
    const canvas = await html2canvas(element as HTMLElement);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight, undefined, "FAST");
    pdf.save("verification-results.pdf");
  };

  if (isLoading) {
    return (
      <div className="verification-step active bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center mr-3">
            <RefreshCw className="text-white animate-spin" size={16} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Loading...</h3>
        </div>
        <p className="text-gray-600">Please wait while we load your verification data.</p>
      </div>
    );
  }

  if (!verificationRecord) {
    return (
      <div className="verification-step active bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-error-red rounded-full flex items-center justify-center mr-3">
            <XCircle className="text-white" size={16} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Error</h3>
        </div>
        <p className="text-gray-600">Failed to load verification data.</p>
      </div>
    );
  }

  const isCompleted = verificationRecord.status === 'completed';
  const isProcessing = verificationRecord.status === 'processing';

  if (!isCompleted && !isProcessing) {
    return (
      <div className="verification-step active bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm font-medium">4</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Ready for Verification</h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          Your document and selfie have been uploaded. Click below to start the verification process.
        </p>

        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Extracted Information:</h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            {verificationRecord.extractedName && (
              <p><span className="font-medium">Name:</span> {verificationRecord.extractedName}</p>
            )}
            {verificationRecord.extractedAge && (
              <p><span className="font-medium">Age:</span> {verificationRecord.extractedAge} years</p>
            )}
            {verificationRecord.extractedDob && (
              <p><span className="font-medium">Date of Birth:</span> {verificationRecord.extractedDob}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={startVerification}
            disabled={processVerificationMutation.isPending}
            className="bg-primary-blue hover:bg-primary-blue-dark text-white px-8 py-3"
          >
            {processVerificationMutation.isPending ? "Processing..." : "Start Verification"}
          </Button>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="verification-step active bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center mr-3">
            <RefreshCw className="text-white animate-spin" size={16} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Processing Verification</h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          Please wait while we verify your identity and age. This may take a few moments.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <RefreshCw className="text-primary-blue mx-auto mb-2 animate-spin" size={24} />
            <p className="text-sm text-gray-600">Enhanced OCR</p>
            <p className="text-xs text-gray-400">Multi-pass processing</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <RefreshCw className="text-primary-blue mx-auto mb-2 animate-spin" size={24} />
            <p className="text-sm text-gray-600">Face Analysis</p>
            <p className="text-xs text-gray-400">Computer vision</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <RefreshCw className="text-primary-blue mx-auto mb-2 animate-spin" size={24} />
            <p className="text-sm text-gray-600">Confidence Scoring</p>
            <p className="text-xs text-gray-400">Quality assessment</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <RefreshCw className="text-primary-blue mx-auto mb-2 animate-spin" size={24} />
            <p className="text-sm text-gray-600">Age Detection</p>
            <p className="text-xs text-gray-400">Facial feature analysis</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verification-step active bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-success-green rounded-full flex items-center justify-center mr-3">
          <CheckCircle2 className="text-white" size={16} />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Verification Complete</h3>
      </div>
      
      <p className="text-gray-600 mb-6">
        Your identity verification has been completed. Review the results below.
      </p>

      <div className="space-y-4 mb-6">
        {/* Identity Verification Result */}
        <Card className={`border-2 ${verificationRecord.identityVerified ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {verificationRecord.identityVerified ? (
                  <CheckCircle2 className="text-success-green" size={24} />
                ) : (
                  <XCircle className="text-error-red" size={24} />
                )}
                <div>
                  <h4 className="font-medium text-gray-900">Identity Verification</h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-lg">
                      {verificationRecord.faceMatchScore}% match
                    </span>
                    {verificationRecord.faceConfidence && (
                      <span className="text-gray-500 ml-2">
                        (confidence: {verificationRecord.faceConfidence}%)
                      </span>
                    )}
                  </p>
                  {verificationRecord.faceMatchScore && (
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          verificationRecord.faceMatchScore >= 70 ? 'bg-green-500' :
                          verificationRecord.faceMatchScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, verificationRecord.faceMatchScore)}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                verificationRecord.identityVerified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {verificationRecord.identityVerified ? 'Verified' : 'Failed'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Age Verification Result */}
        <Card className={`border-2 ${verificationRecord.ageVerified ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {verificationRecord.ageVerified ? (
                  <CheckCircle2 className="text-success-green" size={24} />
                ) : (
                  <XCircle className="text-error-red" size={24} />
                )}
                <div>
                  <h4 className="font-medium text-gray-900">Age Verification</h4>
                  <p className="text-sm text-gray-600">
                    {verificationRecord.detectedAge} years
                    {verificationRecord.ageConfidence && (
                      <span className="text-gray-500 ml-2">
                        (confidence: {verificationRecord.ageConfidence}%)
                      </span>
                    )}
                  </p>
                  {verificationRecord.detectedAge && (
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          verificationRecord.detectedAge >= 18 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, verificationRecord.detectedAge)}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                verificationRecord.ageVerified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {verificationRecord.ageVerified ? 'Verified' : 'Failed'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Feedback */}
        {verificationRecord.results?.feedback && (
          <QualityFeedback feedback={verificationRecord.results.feedback} />
        )}

        <div className="flex justify-end mt-4">
          <Button
            onClick={handleDownloadPDF}
            className="bg-primary-blue hover:bg-primary-blue-dark text-white px-8 py-3"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF Report
          </Button>
        </div>
      </div>
    </div>
  );
}
