"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { isUserAdmin } from "@/lib/auth/admin";

/**
 * Creates a new poll with title, description, and options
 * Validates input data, sanitizes HTML, and stores in database
 * @param formData - Form data containing title, description, and options
 * @returns Error object if creation fails, null error on success
 */
export async function createPoll(formData: FormData) {
  const supabase = await createClient();

  let title = formData.get("title") as string || formData.get("question") as string;
  let description = formData.get("description") as string;
  let options = formData.getAll("options").filter(Boolean) as string[];
  
  // Sanitize title, description and options
  title = title?.replace(/<[^>]*>?/gm, "").trim();
  description = description?.replace(/<[^>]*>?/gm, "").trim();
  options = options.map(opt => opt.replace(/<[^>]*>?/gm, "").trim());

  if (!title || options.length < 2 || options.some(opt => !opt)) {
    return { error: "Please provide a valid title and at least two non-empty options." };
  }

  // Get user from session
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    return { error: userError.message };
  }
  if (!user) {
    return { error: "You must be logged in to create a poll." };
  }

  const { error } = await supabase.from("polls").insert([
    {
      user_id: user.id,
      title,
      description,
      options,
    },
  ]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/polls");
  return { error: null };
}

/**
 * Retrieves all polls created by the currently authenticated user
 * Returns polls sorted by creation date (newest first)
 * @returns Object containing polls array and error status
 */
export async function getUserPolls() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { polls: [], error: "Not authenticated" };

  const { data, error } = await supabase
    .from("polls")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { polls: [], error: error.message };
  return { polls: data ?? [], error: null };
}

/**
 * Fetches a single poll by its ID from the database
 * Used for displaying poll details and voting interface
 * @param id - Unique identifier of the poll to retrieve
 * @returns Object containing poll data and error status
 */
export async function getPollById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("polls")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { poll: null, error: error.message };
  return { poll: data, error: null };
}

/**
 * Records a user's vote for a specific poll option
 * Allows anonymous voting if user is not authenticated
 * @param pollId - ID of the poll being voted on
 * @param optionIndex - Index of the selected option
 * @returns Error object if vote submission fails, null error on success
 */
export async function submitVote(pollId: string, optionIndex: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Optionally require login to vote
  // if (!user) return { error: 'You must be logged in to vote.' };

  const { error } = await supabase.from("votes").insert([
    {
      poll_id: pollId,
      user_id: user?.id ?? null,
      option_index: optionIndex,
    },
  ]);

  if (error) return { error: error.message };
  return { error: null };
}

/**
 * Deletes a poll from the database with authorization checks
 * Only allows deletion by poll owner or admin users
 * @param id - ID of the poll to delete
 * @returns Error object if deletion fails, null error on success
 */
export async function deletePoll(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    return { error: userError.message };
  }
  if (!user) {
    return { error: "You must be logged in to delete a poll." };
  }
  
  // Validate poll id format
  if (!/^[a-zA-Z0-9\-_]+$/.test(id)) {
    return { error: "Invalid poll ID format." };
  }

  // Check if user owns the poll OR is admin
  const { data: poll, error: fetchError } = await supabase
    .from("polls")
    .select("user_id")
    .eq("id", id)
    .single();

  if (fetchError) {
    return { error: "Poll not found or access denied." };
  }

  // Only allow deletion if user owns the poll OR is admin
  const isOwner = poll.user_id === user.id;
  const isAdmin = await isUserAdmin(user.id).catch(() => false);
  
  if (!isOwner && !isAdmin) {
    return { error: "You are not authorized to delete this poll." };
  }

  const { error } = await supabase.from("polls").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/polls");
  return { error: null };
}

/**
 * Updates an existing poll's title, description, and options
 * Only allows updates by the poll owner, validates and sanitizes input
 * @param pollId - ID of the poll to update
 * @param formData - Form data containing updated title, description, and options
 * @returns Error object if update fails, null error on success
 */
export async function updatePoll(pollId: string, formData: FormData) {
  const supabase = await createClient();

  let title = formData.get("title") as string || formData.get("question") as string;
  let description = formData.get("description") as string;
  let options = formData.getAll("options").filter(Boolean) as string[];
  
  // Sanitize title, description and options
  title = title?.replace(/<[^>]*>?/gm, "").trim();
  description = description?.replace(/<[^>]*>?/gm, "").trim();
  options = options.map(opt => opt.replace(/<[^>]*>?/gm, "").trim());

  if (!title || options.length < 2 || options.some(opt => !opt)) {
    return { error: "Please provide a valid title and at least two non-empty options." };
  }

  // Get user from session
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    return { error: userError.message };
  }
  if (!user || userError) {
    return { error: "You must be logged in to update a poll." };
  }

  // Only allow updating polls owned by the user
  const { data: poll, error: fetchError } = await supabase
    .from("polls")
    .select("user_id")
    .eq("id", pollId)
    .single();
  if (fetchError) {
    return { error: fetchError.message };
  }
  if (poll?.user_id !== user.id) {
    return { error: "You are not allowed to update this poll." };
  }

  const { error } = await supabase.from("polls").update({ 
    title, 
    description, 
    options 
  }).eq("id", pollId);
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/polls");
  return { error: null };
}
