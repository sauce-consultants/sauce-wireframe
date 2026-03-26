import { Stepper } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

export default function StepperShowcase() {
  return (
    <div className="max-w-xl">
      <h1 className="text-4xl mb-2">Stepper</h1>
      <p className="text-text-muted mb-8">Multi-step progress indicator for linear workflows.</p>

      <Section title="In Progress (Step 2 of 4)">
        <Stepper steps={[
          { id: "1", label: "Details", status: "completed" },
          { id: "2", label: "Address", status: "current" },
          { id: "3", label: "Payment", status: "incomplete" },
          { id: "4", label: "Review", status: "incomplete" },
        ]} />
      </Section>

      <Section title="With Error">
        <Stepper steps={[
          { id: "1", label: "Details", status: "completed" },
          { id: "2", label: "Verification", status: "error" },
          { id: "3", label: "Confirm", status: "incomplete" },
        ]} />
      </Section>

      <Section title="All Complete">
        <Stepper steps={[
          { id: "1", label: "Upload", status: "completed" },
          { id: "2", label: "Process", status: "completed" },
          { id: "3", label: "Done", status: "completed" },
        ]} />
      </Section>
    </div>
  );
}
