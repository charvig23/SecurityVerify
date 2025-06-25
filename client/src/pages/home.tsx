import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, FileText, Camera, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Secure Age & Identity Verification
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Verify your identity and age quickly and securely using advanced OCR technology 
            and facial recognition. Simple, fast, and completely secure.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary-blue/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <FileText className="text-primary-blue" size={24} />
              </div>
              <CardTitle className="text-lg">Upload ID</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Upload a clear photo of your government-issued ID document
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary-blue/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Camera className="text-primary-blue" size={24} />
              </div>
              <CardTitle className="text-lg">Take Selfie</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Capture a live selfie using your device's camera
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary-blue/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Shield className="text-primary-blue" size={24} />
              </div>
              <CardTitle className="text-lg">Verify</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Our system compares your selfie with your ID photo
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-success-green/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="text-success-green" size={24} />
              </div>
              <CardTitle className="text-lg">Complete</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Get instant verification results and certificate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Start Verification Button */}
        <div className="text-center mb-8">
          <Link href="/verification">
            <Button size="lg" className="bg-primary-blue hover:bg-primary-blue-dark text-white px-8 py-3 text-lg">
              Start Verification Process
            </Button>
          </Link>
        </div>

        {/* Security Info */}
        <Card className="bg-blue-50 border-blue-200">
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
    </div>
  );
}
