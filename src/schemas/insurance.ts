import { z } from "zod";

export const insuranceSchema = z.object({
  type: z.string().min(1, "Tipe wajib diisi"),
  company: z.string().min(1, "Perusahaan wajib diisi"),
  cardNumber: z.string().min(1, "No. Kartu wajib diisi"),
  class: z.string().optional(),
  expiryDate: z.date().optional(),
});

export type InsuranceFormData = z.infer<typeof insuranceSchema>;
