import { Accordion } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

const faqItems = [
  { id: "1", title: "How do I reset my password?", content: "Go to Settings > Security > Reset Password. You will receive a confirmation email with a reset link." },
  { id: "2", title: "Can I change my subscription plan?", content: "Yes, navigate to Billing > Plans and select a new plan. Changes take effect at the start of your next billing cycle." },
  { id: "3", title: "How do I export my data?", content: "Go to Settings > Data > Export. You can export all your data as a CSV or JSON file. Large exports may take a few minutes to process." },
  { id: "4", title: "What payment methods are accepted?", content: "We accept Visa, Mastercard, American Express, and bank transfers for annual plans." },
];

const settingsItems = [
  { id: "general", title: "General Settings", content: "Configure your display name, timezone, language preference, and notification defaults." },
  { id: "security", title: "Security", content: "Manage your password, two-factor authentication, and active sessions." },
  { id: "integrations", title: "Integrations", content: "Connect third-party services like Slack, GitHub, and Jira to your account." },
];

export default function AccordionShowcase() {
  return (
    <div className="max-w-xl">
      <h1 className="text-4xl mb-2">Accordion</h1>
      <p className="text-text-muted mb-8">Collapsible content sections. Single or multi-expand.</p>

      <Section title="Single Expand (FAQ)">
        <Accordion items={faqItems} />
      </Section>

      <Section title="Multi Expand (Settings)">
        <Accordion items={settingsItems} multiple defaultOpen={["general"]} />
      </Section>
    </div>
  );
}
