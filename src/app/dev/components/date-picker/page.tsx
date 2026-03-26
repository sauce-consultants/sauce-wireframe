"use client";

import { useState } from "react";
import { DatePicker } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

export default function DatePickerShowcase() {
  const [date, setDate] = useState<Date | null>(null);
  const [datetime, setDatetime] = useState<Date | null>(new Date());
  const [time, setTime] = useState<Date | null>(null);

  return (
    <div className="max-w-sm">
      <h1 className="text-4xl mb-2">Date Picker</h1>
      <p className="text-text-muted mb-8">Supports date, date &amp; time, or time-only modes.</p>

      <Section title="Date Only">
        <DatePicker label="Start Date" mode="date" value={date} onChange={setDate} />
      </Section>

      <Section title="Date & Time">
        <DatePicker label="Meeting" mode="datetime" value={datetime} onChange={setDatetime} />
      </Section>

      <Section title="Time Only">
        <DatePicker label="Reminder" mode="time" value={time} onChange={setTime} />
      </Section>

      <Section title="States">
        <div className="space-y-4">
          <DatePicker label="Disabled" disabled />
          <DatePicker label="With Error" error="Please select a valid date." />
          <DatePicker label="With Helper" helperText="Select a date within the next 30 days." />
        </div>
      </Section>
    </div>
  );
}
