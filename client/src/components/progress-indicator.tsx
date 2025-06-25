interface ProgressIndicatorProps {
  currentStep: string;
  steps: Array<{ key: string; label: string; number: number }>;
}

export default function ProgressIndicator({ currentStep, steps }: ProgressIndicatorProps) {
  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-medium text-gray-900">Identity Verification Process</h2>
        <span className="text-sm text-gray-500">
          Step {currentStepIndex + 1} of {steps.length}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary-blue h-2 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {steps.map((step, index) => (
          <span
            key={step.key}
            className={`${
              index <= currentStepIndex ? 'text-primary-blue font-medium' : ''
            }`}
          >
            {step.label}
          </span>
        ))}
      </div>
    </div>
  );
}
