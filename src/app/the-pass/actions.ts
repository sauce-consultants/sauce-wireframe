"use server";

import { revalidatePath } from "next/cache";
import { insertCustomer, updateCustomer as updateCustomerDb, insertJournalEntry } from "@/lib/queries";
import { T_SHIRT_SIZES, type Stage, type TShirtSize, type EntryType } from "@/components/the-pass/types";

const VALID_SIZES = T_SHIRT_SIZES.map((s) => s.value);
const VALID_STAGES: Stage[] = ["enquiry", "reservation", "seated", "cleared", "archived"];

export async function createCustomer(formData: FormData) {
  const companyName = formData.get("companyName") as string;
  const subtitle = formData.get("subtitle") as string;
  const stage = formData.get("stage") as string;
  const owner = formData.get("owner") as string;
  const size = formData.get("size") as string;
  const nextAction = formData.get("nextAction") as string;
  const dueDate = formData.get("dueDate") as string;

  if (!companyName?.trim()) return { error: "Company name is required." };
  if (!VALID_STAGES.includes(stage as Stage)) return { error: "Please select a stage." };
  if (!owner?.trim()) return { error: "Please select an owner." };

  try {
    insertCustomer({
      companyName: companyName.trim(),
      subtitle: subtitle?.trim() || undefined,
      stage: stage as Stage,
      owner: owner.trim(),
      size: VALID_SIZES.includes(size as TShirtSize) ? (size as TShirtSize) : undefined,
      nextAction: nextAction?.trim() || undefined,
      dueDate: dueDate?.trim() || undefined,
    });

    revalidatePath("/the-pass");
    return { success: true };
  } catch {
    return { error: "Failed to create customer. Please try again." };
  }
}

export async function updateCustomer(formData: FormData) {
  const id = Number(formData.get("id"));
  const companyName = formData.get("companyName") as string;
  const subtitle = formData.get("subtitle") as string;
  const stage = formData.get("stage") as string;
  const owner = formData.get("owner") as string;
  const size = formData.get("size") as string;
  const nextAction = formData.get("nextAction") as string;
  const dueDate = formData.get("dueDate") as string;

  if (!id) return { error: "Customer ID is missing." };
  if (!companyName?.trim()) return { error: "Company name is required." };
  if (!VALID_STAGES.includes(stage as Stage)) return { error: "Please select a stage." };
  if (!owner?.trim()) return { error: "Please select an owner." };

  try {
    updateCustomerDb({
      id,
      companyName: companyName.trim(),
      subtitle: subtitle?.trim() || undefined,
      stage: stage as Stage,
      owner: owner.trim(),
      size: VALID_SIZES.includes(size as TShirtSize) ? (size as TShirtSize) : undefined,
      nextAction: nextAction?.trim() || undefined,
      dueDate: dueDate?.trim() || undefined,
    });

    revalidatePath("/the-pass");
    return { success: true };
  } catch {
    return { error: "Failed to update customer. Please try again." };
  }
}

const VALID_ENTRY_TYPES: EntryType[] = ["note", "update", "meeting", "call", "email"];

export async function addJournalEntry(formData: FormData) {
  const customerId = Number(formData.get("customerId"));
  const content = formData.get("content") as string;
  const author = formData.get("author") as string;
  const entryType = formData.get("entryType") as string;

  if (!customerId) return { error: "Customer ID is missing." };
  if (!content?.trim()) return { error: "Content is required." };
  if (!author?.trim()) return { error: "Please select an author." };

  try {
    insertJournalEntry({
      customerId,
      content: content.trim(),
      author: author.trim(),
      entryType: VALID_ENTRY_TYPES.includes(entryType as EntryType) ? (entryType as EntryType) : undefined,
    });

    revalidatePath("/the-pass");
    return { success: true };
  } catch {
    return { error: "Failed to add journal entry. Please try again." };
  }
}
