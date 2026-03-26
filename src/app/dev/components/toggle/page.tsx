"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

export default function ToggleShowcase() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [marketing, setMarketing] = useState(false);

  return (
    <div className="max-w-md">
      <h1 className="text-4xl mb-2">Toggle</h1>
      <p className="text-text-muted mb-8">On/off switch for settings that take effect immediately.</p>

      <Section title="Default">
        <Toggle label="Enable notifications" checked={notifications} onChange={setNotifications} />
      </Section>

      <Section title="With Status Text">
        <Toggle label="Dark mode" checked={darkMode} onChange={setDarkMode} statusText />
      </Section>

      <Section title="Settings List">
        <div className="border-4 border-black divide-y-2 divide-gray-light">
          <div className="px-4 py-3">
            <Toggle label="Email notifications" checked={notifications} onChange={setNotifications} />
          </div>
          <div className="px-4 py-3">
            <Toggle label="Dark mode" checked={darkMode} onChange={setDarkMode} />
          </div>
          <div className="px-4 py-3">
            <Toggle label="Marketing emails" checked={marketing} onChange={setMarketing} />
          </div>
        </div>
      </Section>

      <Section title="States">
        <div className="space-y-4">
          <Toggle label="Off" checked={false} onChange={() => {}} />
          <Toggle label="On" checked={true} onChange={() => {}} />
          <Toggle label="Disabled off" checked={false} disabled />
          <Toggle label="Disabled on" checked={true} disabled />
        </div>
      </Section>
    </div>
  );
}
