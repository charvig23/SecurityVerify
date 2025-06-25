import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface QualityFeedbackProps {
  feedback: {
    face?: string[];
    age?: string[];
    overall?: string[];
  };
}

export default function QualityFeedback({ feedback }: QualityFeedbackProps) {
  const allFeedback = [
    ...(feedback.face || []),
    ...(feedback.age || []),
    ...(feedback.overall || [])
  ];

  if (allFeedback.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-3">
      <h4 className="font-medium text-gray-900 flex items-center gap-2">
        <Info size={16} />
        Quality Assessment & Feedback
      </h4>
      
      <div className="space-y-2">
        {feedback.face && feedback.face.length > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h5 className="font-medium text-blue-900 text-sm mb-2">Face Analysis</h5>
            <ul className="space-y-1">
              {feedback.face.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                  <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {feedback.age && feedback.age.length > 0 && (
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <h5 className="font-medium text-amber-900 text-sm mb-2">Age Estimation</h5>
            <ul className="space-y-1">
              {feedback.age.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-amber-800">
                  <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {feedback.overall && feedback.overall.length > 0 && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h5 className="font-medium text-gray-900 text-sm mb-2">Verification Summary</h5>
            <ul className="space-y-1">
              {feedback.overall.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle size={14} className="mt-0.5 flex-shrink-0 text-green-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}