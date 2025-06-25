import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, FileText, Camera, CheckCircle, Sparkles, Users, Award, Globe } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-purple-100 verisure-shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl verisure-gradient">
                <ShieldCheck className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold verisure-text-primary">VeriSure</h1>
                <p className="text-xs text-gray-500 font-medium">Secure Identity Verification</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                How It Works
              </a>
              <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                Features
              </a>
              <a href="#security" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                Security
              </a>
              <Button variant="outline" className="verisure-border hover:bg-purple-50">
                Support
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full">
              <Sparkles className="text-purple-600" size={16} />
              <span className="text-purple-800 font-semibold text-sm">Next-Gen Verification Technology</span>
            </div>
          </div>
          
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Identity Verification
            <span className="block verisure-gradient bg-clip-text text-transparent">
              Reimagined
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Experience the future of secure identity verification with our AI-powered OCR technology, 
            multi-language support, and advanced facial recognition. Fast, accurate, and completely private.
          </p>
        </div>

        {/* Start Verification Button */}
        <div className="text-center mb-12">
          <Link href="/verification">
            <Button size="lg" className="verisure-bg-primary hover:bg-purple-700 text-white px-10 py-4 text-lg rounded-xl verisure-shadow-lg">
              Start Verification Process
              <CheckCircle className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </main>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-6">How VeriSure Works</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience seamless identity verification with our AI-powered process. 
              Three simple steps to complete verification in under 2 minutes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center verisure-border hover:verisure-shadow-lg transition-all duration-300 verisure-hover group">
              <CardHeader className="pb-6">
                <div className="mx-auto mb-6 p-4 verisure-gradient rounded-2xl w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="text-white" size={36} />
                </div>
                <CardTitle className="text-2xl verisure-text-primary">Upload Document</CardTitle>
                <div className="w-12 h-1 verisure-gradient rounded-full mx-auto mt-3"></div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Upload your government-issued ID in any format. Our advanced OCR supports multiple languages 
                  including English, Hindi, and Telugu for complete accuracy.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center verisure-border hover:verisure-shadow-lg transition-all duration-300 verisure-hover group">
              <CardHeader className="pb-6">
                <div className="mx-auto mb-6 p-4 verisure-gradient rounded-2xl w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="text-white" size={36} />
                </div>
                <CardTitle className="text-2xl verisure-text-primary">Capture Selfie</CardTitle>
                <div className="w-12 h-1 verisure-gradient rounded-full mx-auto mt-3"></div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Take a live selfie with real-time quality feedback. Our system guides you for optimal 
                  lighting and positioning to ensure the best results.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center verisure-border hover:verisure-shadow-lg transition-all duration-300 verisure-hover group">
              <CardHeader className="pb-6">
                <div className="mx-auto mb-6 p-4 verisure-gradient rounded-2xl w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle className="text-white" size={36} />
                </div>
                <CardTitle className="text-2xl verisure-text-primary">Get Verified</CardTitle>
                <div className="w-12 h-1 verisure-gradient rounded-full mx-auto mt-3"></div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Receive instant verification with detailed confidence scores, quality assessment, 
                  and comprehensive security analysis. Results in seconds, not minutes.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="verisure-gradient-soft py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-6">Why Choose VeriSure?</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge AI technology combined with intuitive design delivers the most reliable 
              and user-friendly identity verification experience available today.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="mb-6 p-4 bg-green-100 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <CheckCircle className="text-green-600" size={36} />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">99.9% Accuracy</h4>
              <p className="text-gray-600 leading-relaxed">Advanced computer vision and multi-language OCR technology ensures precise verification across all document types.</p>
            </div>
            
            <div className="text-center group">
              <div className="mb-6 p-4 bg-blue-100 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-blue-600" size={36} />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Bank-Grade Security</h4>
              <p className="text-gray-600 leading-relaxed">Enterprise-level encryption, secure data handling, and comprehensive privacy protection for complete peace of mind.</p>
            </div>
            
            <div className="text-center group">
              <div className="mb-6 p-4 bg-purple-100 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Camera className="text-purple-600" size={36} />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Instant Results</h4>
              <p className="text-gray-600 leading-relaxed">Real-time processing with detailed confidence scores and quality feedback delivered in under 30 seconds.</p>
            </div>
            
            <div className="text-center group">
              <div className="mb-6 p-4 bg-orange-100 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Globe className="text-orange-600" size={36} />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Global Coverage</h4>
              <p className="text-gray-600 leading-relaxed">Supports documents from 190+ countries with multi-language OCR including English, Hindi, Telugu, and more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="verisure-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">Ready to Experience VeriSure?</h3>
          <p className="text-purple-100 mb-10 max-w-3xl mx-auto text-lg leading-relaxed">
            Join millions of users worldwide who trust VeriSure for secure, fast, and reliable identity verification. 
            Experience the future of digital identity today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/verification">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100 px-10 py-4 text-lg rounded-xl verisure-shadow-lg">
                Start Verification Now
                <CheckCircle className="ml-2" size={20} />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-10 py-4 text-lg rounded-xl">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-xl verisure-gradient">
                  <ShieldCheck className="text-white" size={20} />
                </div>
                <span className="text-xl font-bold">VeriSure</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Next-generation identity verification powered by advanced AI and machine learning technology.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 VeriSure. All rights reserved. | Privacy Policy | Terms of Service | Security
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
