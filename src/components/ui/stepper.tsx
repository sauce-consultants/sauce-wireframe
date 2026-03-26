import { Check } from "lucide-react";

type StepStatus = "incomplete" | "current" | "completed" | "error";

interface Step {
  id: string;
  label: string;
  status: StepStatus;
}

interface StepperProps {
  steps: Step[];
  className?: string;
}

const indicatorStyles: Record<StepStatus, string> = {
  incomplete: "bg-gray-light text-text-muted border-4 border-gray-light",
  current: "bg-black text-white border-4 border-black",
  completed: "bg-black text-white border-4 border-black",
  error: "bg-danger text-white border-4 border-danger",
};

const connectorStyles = (prev: StepStatus) =>
  prev === "completed" ? "bg-black" : "bg-gray-light";

function Stepper({ steps, className = "" }: StepperProps) {
  return (
    <div className={`flex items-center ${className}`} role="list">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center flex-1 last:flex-none" role="listitem">
          <div className="flex flex-col items-center gap-1.5">
            <span
              className={`h-10 w-10 flex items-center justify-center text-sm font-bold ${indicatorStyles[step.status]}`}
              aria-current={step.status === "current" ? "step" : undefined}
            >
              {step.status === "completed" ? (
                <Check size={18} strokeWidth={3} />
              ) : (
                i + 1
              )}
            </span>
            <span
              className={`text-xs font-semibold text-center max-w-20 ${
                step.status === "current" ? "text-black" : "text-text-muted"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-1 mx-2 ${connectorStyles(step.status)}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export { Stepper, type StepperProps, type Step, type StepStatus };
