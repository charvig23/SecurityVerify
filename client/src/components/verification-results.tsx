import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, Award, Download, RefreshCw } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface VerificationResultsProps {
  verificationId: number;
}

export default function VerificationResults({ verificationId }: VerificationResultsProps) {
  const { toast } = useToast();

  const { data: verificationRecord, isLoading } = useQuery({
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <RefreshCw className="text-primary-blue mx-auto mb-2 animate-spin" size={24} />
            <p className="text-sm text-gray-600">Processing OCR Data</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <RefreshCw className="text-primary-blue mx-auto mb-2 animate-spin" size={24} />
            <p className="text-sm text-gray-600">Comparing Faces</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <RefreshCw className="text-primary-blue mx-auto mb-2 animate-spin" size={24} />
            <p className="text-sm text-gray-600">Verifying Age</p>
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
                    Face match: {verificationRecord.faceMatchScore}%
                  </p>
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
                    {verificationRecord.detectedAge 
                      ? `Detected Age: ${verificationRecord.detectedAge} years (from selfie)` 
                      : verificationRecord.extractedAge 
                        ? `Document Age: ${verificationRecord.extractedAge} years` 
                        : 'Age not detected'}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                verificationRecord.ageVerified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {verificationRecord.ageVerified ? '18+ Verified' : 'Under 18'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Extracted Information */}
        <Card>
          <CardContent className="pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Extracted Information</h4>
            <div className="space-y-2 text-sm">
              {verificationRecord.extractedName && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{verificationRecord.extractedName}</span>
                </div>
              )}
              {verificationRecord.detectedAge && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Detected Age (Selfie):</span>
                  <span className="font-medium">{verificationRecord.detectedAge} years</span>
                </div>
              )}
              {verificationRecord.extractedAge && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Document Age:</span>
                  <span className="font-medium">{verificationRecord.extractedAge} years</span>
                </div>
              )}
              {verificationRecord.extractedDob && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Date of Birth:</span>
                  <span className="font-medium">{verificationRecord.extractedDob}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Verification Date:</span>
                <span className="font-medium">
                  {new Date(verificationRecord.completedAt!).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Status */}
      <div className={`text-center p-6 rounded-lg mb-6 ${
        verificationRecord.identityVerified && verificationRecord.ageVerified
          ? 'bg-green-50 border border-green-200'
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className="mb-4">
          {verificationRecord.identityVerified && verificationRecord.ageVerified ? (
            <Award className="text-success-green mx-auto" size={48} />
          ) : (
            <XCircle className="text-error-red mx-auto" size={48} />
          )}
        </div>
        <h3 className={`text-xl font-semibold mb-2 ${
          verificationRecord.identityVerified && verificationRecord.ageVerified
            ? 'text-green-800'
            : 'text-red-800'
        }`}>
          {verificationRecord.identityVerified && verificationRecord.ageVerified
            ? 'Verification Successful'
            : 'Verification Failed'
          }
        </h3>
        <p className="text-gray-600">
          {verificationRecord.identityVerified && verificationRecord.ageVerified
            ? 'Your identity and age have been successfully verified.'
            : 'We were unable to verify your identity or age. Please try again with clearer documents.'
          }
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        {verificationRecord.identityVerified && verificationRecord.ageVerified && (
          <Button className="bg-primary-blue hover:bg-primary-blue-dark text-white px-6 py-2">
            <Download size={16} className="mr-2" />
            Download Certificate
          </Button>
        )}
        <Button variant="outline" onClick={() => window.location.reload()}>
          Start New Verification
        </Button>
      </div>
    </div>
  );
}
