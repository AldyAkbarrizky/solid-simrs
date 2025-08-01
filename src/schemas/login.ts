import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username harus diisi"),
  password: z.string().min(1, "Password harus diisi"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
