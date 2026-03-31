export type Stage = "enquiry" | "reservation" | "seated" | "cleared" | "archived";

export type Owner =
  | "matt-weldon"
  | "john-polling"
  | "matt-gibson"
  | "jim-wardlaw"
  | "aidan-treasure"
  | "rob-marsh"
  | "james-hay"
  | "xing-xing"
  | "sam-osborne"
  | "sam-mearns"
  | "luke-savory"
  | "emma-elkan"
  | "mel-brooker";

export type Heat = "hot" | "warm" | "cool" | "cold";
export type TShirtSize = "XS" | "S" | "M" | "L" | "XL";

export const T_SHIRT_SIZES: { value: TShirtSize; label: string }[] = [
  { value: "XS", label: "XS" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
];

export interface Customer {
  id: number;
  companyName: string;
  subtitle: string | null;
  stage: Stage;
  owner: Owner;
  size: TShirtSize | null;
  lastActivity: string;
  nextAction: string | null;
  dueDate: string | null;
  heat: Heat;
  sortOrder: number;
}

export interface BoardData {
  enquiry: Customer[];
  reservation: Customer[];
  seated: Customer[];
  cleared: Customer[];
  archived: Customer[];
}

export const STAGES: { key: Stage; title: string; subtitle: string }[] = [
  { key: "enquiry", title: "At the door", subtitle: "Enquiry — exploring fit" },
  { key: "reservation", title: "Booked in", subtitle: "Reservation — active sales" },
  { key: "seated", title: "Being served", subtitle: "Seated — work flowing" },
  { key: "cleared", title: "Plates away", subtitle: "Cleared — aftercare" },
  { key: "archived", title: "Left the building", subtitle: "Archived — dormant or lost" },
];

export const OWNERS: Record<Owner, { name: string; initials: string }> = {
  "matt-weldon": { name: "Matt Weldon", initials: "MW" },
  "john-polling": { name: "John Polling", initials: "JP" },
  "matt-gibson": { name: "Matt Gibson", initials: "MG" },
  "jim-wardlaw": { name: "Jim Wardlaw", initials: "JW" },
  "aidan-treasure": { name: "Aidan Treasure", initials: "AT" },
  "rob-marsh": { name: "Rob Marsh", initials: "RM" },
  "james-hay": { name: "James Hay", initials: "JH" },
  "xing-xing": { name: "Xing Xing", initials: "XX" },
  "sam-osborne": { name: "Sam Osborne", initials: "SO" },
  "sam-mearns": { name: "Sam Mearns", initials: "SM" },
  "luke-savory": { name: "Luke Savory", initials: "LS" },
  "emma-elkan": { name: "Emma Elkan", initials: "EE" },
  "mel-brooker": { name: "Mel Brooker", initials: "MB" },
};

export type EntryType = "note" | "update" | "meeting" | "call" | "email";

export const ENTRY_TYPES: { value: EntryType; label: string }[] = [
  { value: "note", label: "Note" },
  { value: "update", label: "Update" },
  { value: "meeting", label: "Meeting" },
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
];

export interface JournalEntry {
  id: number;
  customerId: number;
  content: string;
  author: Owner;
  entryType: EntryType | null;
  createdAt: string;
}
