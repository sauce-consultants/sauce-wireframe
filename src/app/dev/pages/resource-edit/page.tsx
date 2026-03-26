"use client";

import {
  Breadcrumbs, Form, FormSection, FormFieldGroup, FormActions,
  Input, Textarea, Select, Button,
} from "@/components/ui";
import { MainAside } from "@/components/layouts";
import { CustomerAside } from "../_shared/customer-aside";

export default function ResourceEditTemplate() {
  return (
    <div>
      {/* Page header */}
      <div className="mb-4">
        <Breadcrumbs items={[
          { label: "Home", href: "#" },
          { label: "Customers", href: "#" },
          { label: "Acme Corp", href: "#" },
          { label: "Edit" },
        ]} />
      </div>
      <h1 className="text-3xl mb-6">Edit Customer</h1>

      <MainAside aside={<CustomerAside />}>
        <Form onSubmit={(e) => e.preventDefault()}>
          <FormSection title="Contact Details">
            <FormFieldGroup columns={2}>
              <Input label="First Name" defaultValue="Jane" required />
              <Input label="Last Name" defaultValue="Smith" required />
            </FormFieldGroup>
            <Input label="Email" type="email" defaultValue="hello@acme.com" required />
            <Input label="Phone" type="tel" defaultValue="+1 555 123 4567" />
          </FormSection>

          <FormSection title="Company">
            <Input label="Company Name" defaultValue="Acme Corp" required />
            <FormFieldGroup columns={2}>
              <Select
                label="Industry"
                value="tech"
                onChange={() => {}}
                options={[
                  { value: "tech", label: "Technology" },
                  { value: "finance", label: "Finance" },
                  { value: "healthcare", label: "Healthcare" },
                  { value: "retail", label: "Retail" },
                ]}
              />
              <Select
                label="Company Size"
                value="51-200"
                onChange={() => {}}
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
            <Input label="Street Address" defaultValue="123 Main St" />
            <FormFieldGroup columns={2}>
              <Input label="City" defaultValue="San Francisco" />
              <Input label="Postcode" defaultValue="94105" />
            </FormFieldGroup>
          </FormSection>

          <FormSection>
            <Textarea label="Notes" defaultValue="Key enterprise customer. Quarterly review scheduled for April." />
          </FormSection>

          <FormActions>
            <Button variant="ghost">Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </FormActions>
        </Form>
      </MainAside>
    </div>
  );
}
