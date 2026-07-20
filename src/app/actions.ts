"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { clearSession, createSession, hashPassword } from "@/lib/auth";
import { logContainerReturn, logCustomerPackagingChoice, reserveListing } from "@/lib/dashboard";
import { prisma } from "@/lib/prisma";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function redirectWithError(message: string): never {
  redirect(`/?error=${encodeURIComponent(message)}`);
}

export async function signUpAction(formData: FormData) {
  const name = getString(formData, "name");
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");
  const role = getString(formData, "role");

  if (!name || !email || !password || !["business", "customer"].includes(role)) {
    redirectWithError("Complete all signup fields.");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    redirectWithError("This email already has an account.");
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashPassword(password),
      role,
    },
  });

  await createSession(user.id);
  redirect("/");
}

export async function loginAction(formData: FormData) {
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");

  if (!email || !password) {
    redirectWithError("Enter your email and password.");
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.passwordHash !== hashPassword(password)) {
    redirectWithError("Invalid login credentials.");
  }

  await createSession(user.id);
  redirect("/");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}

export async function reserveListingAction(formData: FormData) {
  const listingId = getString(formData, "listingId");
  const packagingChoice = getString(formData, "packagingChoice");

  if (!listingId) {
    return;
  }

  await reserveListing(listingId);

  if (packagingChoice) {
    await logCustomerPackagingChoice(packagingChoice);
  }

  revalidatePath("/");
}

export async function logContainerReturnAction() {
  await logContainerReturn();
  revalidatePath("/");
}