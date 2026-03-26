"use client";

import { useState } from "react";
import { Alert, Button } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

export default function AlertShowcase() {
  const [visible, setVisible] = useState(true);

  return (
    <div className="max-w-xl">
      <h1 className="text-4xl mb-2">Alert</h1>
      <p className="text-text-muted mb-8">Persistent inline message for warnings, errors, and notices.</p>

      <Section title="Variants">
        <div className="space-y-4">
          <Alert variant="info" title="Update available">A new version of the app is ready to install.</Alert>
          <Alert variant="success" title="Payment received">Your invoice has been paid successfully.</Alert>
          <Alert variant="warning" title="Storage limit">You are using 90% of your available storage.</Alert>
          <Alert variant="error" title="Sync failed">Unable to connect to the server. Changes are saved locally.</Alert>
        </div>
      </Section>

      <Section title="With Action">
        <Alert variant="warning" title="Session expiring" action={<Button size="sm" variant="secondary">Extend Session</Button>}>
          Your session will expire in 5 minutes.
        </Alert>
      </Section>

      <Section title="Dismissible">
        {visible ? (
          <Alert variant="info" onDismiss={() => setVisible(false)}>
            This alert can be dismissed by clicking the close button.
          </Alert>
        ) : (
          <Button variant="secondary" onClick={() => setVisible(true)}>Show Alert Again</Button>
        )}
      </Section>
    </div>
  );
}
