"use client";

import { Form, FormSection, FormFieldGroup, FormActions, Input, Textarea, Select, Checkbox, Button } from "@/components/ui";

export default function FormShowcase() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl mb-2">Form</h1>
      <p className="text-text-muted mb-8">Composite pattern for structured input with sections, validation, and actions.</p>

      <Form onSubmit={(e) => e.preventDefault()}>
        <FormSection title="Personal Details">
          <FormFieldGroup columns={2}>
            <Input label="First Name" placeholder="Jane" required />
            <Input label="Last Name" placeholder="Smith" required />
          </FormFieldGroup>
          <Input label="Email Address" type="email" placeholder="jane@example.com" required />
          <Input label="Phone" type="tel" placeholder="+1 555 123 4567" />
        </FormSection>

        <FormSection title="Company">
          <Input label="Company Name" placeholder="Acme Corp" />
          <FormFieldGroup columns={2}>
            <Input label="Role" placeholder="Developer" />
            <Select
              label="Department"
              options={[
                { value: "eng", label: "Engineering" },
                { value: "design", label: "Design" },
                { value: "product", label: "Product" },
                { value: "ops", label: "Operations" },
              ]}
            />
          </FormFieldGroup>
        </FormSection>

        <FormSection title="Additional">
          <Textarea label="Notes" placeholder="Anything else we should know..." helperText="Optional. Max 500 characters." />
          <Checkbox label="I agree to the terms and conditions" />
        </FormSection>

        <FormActions>
          <Button variant="ghost">Cancel</Button>
          <Button type="submit">Create Account</Button>
        </FormActions>
      </Form>
    </div>
  );
}
