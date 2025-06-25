import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CloudUpload, CheckCircle2, FileText, X, Trash2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadProps {
  onDocumentUploaded: (verificationId: number, extractedData: any) => void;
}

export default function DocumentUpload({ onDocumentUploaded }: DocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('document', file);
      
      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload document');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Document uploaded successfully",
        description: "Your document has been processed and information extracted.",
      });
      onDocumentUploaded(data.verificationId, data.extractedData);
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPEG or PNG image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  return (
    <div className="verification-step active bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center mr-3">
          <span className="text-white text-sm font-medium">1</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Upload Government ID Document</h3>
      </div>
      
      <p className="text-gray-600 mb-6">
        Please upload a clear photo of your government-issued ID (Aadhar Card, Driver's License, Passport). 
        Ensure all text is clearly visible.
      </p>
      
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary-blue bg-blue-50' 
              : 'border-gray-300 hover:border-primary-blue'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <CloudUpload className="text-gray-400" size={32} />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drag and drop your ID document here
              </p>
              <p className="text-gray-500">or click to browse files</p>
            </div>
            <div className="flex justify-center">
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary-blue hover:bg-primary-blue-dark text-white px-6 py-2"
              >
                Select File
              </Button>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-400">
              Supported formats: JPEG, PNG (Max 10MB)
            </p>
          </div>
        </div>
      ) : (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Document preview"
                  className="w-24 h-16 object-cover rounded border"
                />
              )}
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <div className="flex items-center text-sm text-success-green mt-1">
                  <CheckCircle2 size={16} className="mr-1" />
                  <span>Document validated</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-error-red hover:text-red-700"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </Card>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
          <CheckCircle2 className="text-success-green" size={20} />
          <span className="text-sm text-gray-700">Clear & Readable</span>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
          <CheckCircle2 className="text-success-green" size={20} />
          <span className="text-sm text-gray-700">All Corners Visible</span>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
          <CheckCircle2 className="text-success-green" size={20} />
          <span className="text-sm text-gray-700">No Glare or Shadows</span>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploadMutation.isPending}
          className="bg-primary-blue hover:bg-primary-blue-dark text-white px-8 py-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {uploadMutation.isPending ? "Processing..." : "Process Document"}
        </Button>
      </div>
    </div>
  );
}
