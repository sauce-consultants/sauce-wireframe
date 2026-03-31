"use server";

import { revalidatePath } from "next/cache";
import { insertDish, updateDish as updateDishDb, insertDishComment } from "@/lib/dish-queries";
import type { DishStatus, Priority, AuthorType } from "@/components/the-kitchen/types";

const VALID_STATUSES: DishStatus[] = ["backlog", "todo", "in_progress", "review", "done"];
const VALID_PRIORITIES: Priority[] = ["high", "med", "low"];

export async function createDish(formData: FormData) {
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const status = formData.get("status") as string;
  const customerId = Number(formData.get("customerId"));
  const assignee = formData.get("assignee") as string;
  const agent = formData.get("agent") as string;
  const priority = formData.get("priority") as string;
  const size = formData.get("size") as string;
  const labels = formData.get("labels") as string;

  if (!title?.trim()) return { error: "Title is required." };
  if (!customerId) return { error: "Please select a project." };

  try {
    insertDish({
      title: title.trim(),
      body: body?.trim() || "",
      status: VALID_STATUSES.includes(status as DishStatus) ? (status as DishStatus) : "backlog",
      customerId,
      assignee: assignee?.trim() || undefined,
      agent: agent?.trim() || undefined,
      priority: VALID_PRIORITIES.includes(priority as Priority) ? (priority as Priority) : "med",
      size: size?.trim() || undefined,
      labels: labels?.trim() || "",
    });

    revalidatePath("/the-kitchen");
    return { success: true };
  } catch {
    return { error: "Failed to create dish." };
  }
}

export async function updateDish(formData: FormData) {
  const id = Number(formData.get("id"));
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const status = formData.get("status") as string;
  const customerId = Number(formData.get("customerId"));
  const assignee = formData.get("assignee") as string;
  const agent = formData.get("agent") as string;
  const priority = formData.get("priority") as string;
  const size = formData.get("size") as string;
  const labels = formData.get("labels") as string;
  const changedBy = formData.get("changedBy") as string;
  const changedByType = formData.get("changedByType") as string;

  if (!id) return { error: "Dish ID is missing." };
  if (!title?.trim()) return { error: "Title is required." };
  if (!customerId) return { error: "Please select a project." };

  try {
    updateDishDb({
      id,
      title: title.trim(),
      body: body?.trim() || "",
      status: VALID_STATUSES.includes(status as DishStatus) ? (status as DishStatus) : "backlog",
      customerId,
      assignee: assignee?.trim() || undefined,
      agent: agent?.trim() || undefined,
      priority: VALID_PRIORITIES.includes(priority as Priority) ? (priority as Priority) : "med",
      size: size?.trim() || undefined,
      labels: labels?.trim() || "",
      changedBy: changedBy?.trim() || "Unknown",
      changedByType: (changedByType === "agent" ? "agent" : "human") as AuthorType,
    });

    revalidatePath("/the-kitchen");
    return { success: true };
  } catch {
    return { error: "Failed to update dish." };
  }
}

export async function addDishComment(formData: FormData) {
  const dishId = Number(formData.get("dishId"));
  const content = formData.get("content") as string;
  const authorName = formData.get("authorName") as string;
  const authorType = formData.get("authorType") as string;

  if (!dishId) return { error: "Dish ID is missing." };
  if (!content?.trim()) return { error: "Comment content is required." };
  if (!authorName?.trim()) return { error: "Author name is required." };

  try {
    insertDishComment({
      dishId,
      content: content.trim(),
      authorName: authorName.trim(),
      authorType: (authorType === "agent" ? "agent" : "human") as AuthorType,
    });

    revalidatePath("/the-kitchen");
    return { success: true };
  } catch {
    return { error: "Failed to add comment." };
  }
}
