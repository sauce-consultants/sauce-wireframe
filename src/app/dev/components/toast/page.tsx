"use client";

import { Button } from "@/components/ui";
import { ToastProvider, useToast } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">
        {title}
      </h3>
      {children}
    </div>
  );
}

function ToastDemos() {
  const { toast } = useToast();

  return (
    <>
      <Section title="Variants">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => toast("success", "Changes saved successfully.")}>
            Success
          </Button>
          <Button variant="secondary" onClick={() => toast("error", "Failed to save changes.")}>
            Error
          </Button>
          <Button variant="secondary" onClick={() => toast("warning", "Your session expires in 5 minutes.")}>
            Warning
          </Button>
          <Button variant="secondary" onClick={() => toast("info", "A new version is available.")}>
            Info
          </Button>
        </div>
      </Section>

      <Section title="With Action">
        <Button
          variant="secondary"
          onClick={() =>
            toast("success", "Record deleted.", {
              label: "Undo",
              onClick: () => toast("info", "Deletion undone."),
            })
          }
        >
          Delete with Undo
        </Button>
      </Section>

      <Section title="Stacking">
        <Button
          variant="secondary"
          onClick={() => {
            toast("success", "First toast.");
            setTimeout(() => toast("info", "Second toast."), 300);
            setTimeout(() => toast("warning", "Third toast."), 600);
          }}
        >
          Fire 3 Toasts
        </Button>
      </Section>
    </>
  );
}

export default function ToastShowcase() {
  return (
    <ToastProvider>
      <div className="max-w-3xl">
        <h1 className="text-4xl mb-2">Toast</h1>
        <p className="text-text-muted mb-8">
          Brief, non-blocking feedback that auto-dismisses after 3-5 seconds.
        </p>
        <ToastDemos />
      </div>
    </ToastProvider>
  );
}
