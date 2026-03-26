"use client";

import {
  Breadcrumbs, Form, FormSection, FormFieldGroup, FormActions,
  Input, Textarea, Select, Checkbox, Button,
} from "@/components/ui";

export default function ResourceCreateTemplate() {
  return (
    <div className="max-w-2xl">
      {/* Page header */}
      <div className="mb-4">
        <Breadcrumbs items={[
          { label: "Home", href: "#" },
          { label: "Customers", href: "#" },
          { label: "Add Customer" },
        ]} />
      </div>
      <h1 className="text-3xl mb-6">Add Customer</h1>

      {/* Form */}
      <Form onSubmit={(e) => e.preventDefault()}>
        <FormSection title="Contact Details">
          <FormFieldGroup columns={2}>
            <Input label="First Name" placeholder="Jane" required />
            <Input label="Last Name" placeholder="Smith" required />
          </FormFieldGroup>
          <Input label="Email" type="email" placeholder="jane@example.com" required />
          <Input label="Phone" type="tel" placeholder="+1 555 123 4567" />
        </FormSection>

        <FormSection title="Company">
          <Input label="Company Name" placeholder="Acme Corp" required />
          <FormFieldGroup columns={2}>
            <Select
              label="Industry"
              options={[
                { value: "tech", label: "Technology" },
                { value: "finance", label: "Finance" },
                { value: "healthcare", label: "Healthcare" },
                { value: "retail", label: "Retail" },
              ]}
            />
            <Select
              label="Company Size"
              options={[
                { value: "1-10", label: "1-10 employees" },
                { value: "11-50", label: "11-50 employees" },
                { value: "51-200", label: "51-200 employees" },
                { value: "200+", label: "200+ employees" },
              ]}
            />
          </FormFieldGroup>
        </FormSection>

        <FormSection title="Address">
          <Input label="Street Address" placeholder="123 Main St" />
          <FormFieldGroup columns={2}>
            <Input label="City" placeholder="San Francisco" />
            <Input label="Postcode" placeholder="94105" />
          </FormFieldGroup>
        </FormSection>

        <FormSection>
          <Textarea label="Notes" placeholder="Any additional notes..." helperText="Optional." />
          <Checkbox label="Send welcome email to the customer" />
        </FormSection>

        <FormActions>
          <Button variant="ghost">Cancel</Button>
          <Button type="submit">Create Customer</Button>
        </FormActions>
      </Form>
    </div>
  );
}
