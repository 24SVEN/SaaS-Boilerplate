'use server';

import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import {
  clearSession,
  comparePasswords,
  hashPassword,
  setSession,
} from '@/libs/auth/session';
import { db } from '@/libs/DB';
import { userSchema } from '@/models/Schema';

const users = userSchema;

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function signIn(_: any, formData: FormData) {
  const data = signInSchema.parse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1);

  if (result.length === 0) {
    return { error: 'Invalid email or password.' };
  }

  const user = result[0]!;
  const valid = await comparePasswords(data.password, user.passwordHash);
  if (!valid) {
    return { error: 'Invalid email or password.' };
  }

  await setSession(user.id);
  redirect('/dashboard');
}

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function signUp(_: any, formData: FormData) {
  const data = signUpSchema.parse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1);

  if (existing.length > 0) {
    return { error: 'Email already registered.' };
  }

  const passwordHash = await hashPassword(data.password);
  const [user] = await db
    .insert(users)
    .values({ email: data.email, passwordHash })
    .returning();
  if (user) {
    await setSession(user.id);
  }
  redirect('/dashboard');
}

export async function signOut() {
  await clearSession();
}
