import { z } from "zod";
import { insuranceSchema } from "./insurance";

export const patientFormSchema = z.object({
  fullName: z.string().min(1, "Nama lengkap wajib diisi."),
  nickname: z.string().optional(),
  title: z.string().optional(),
  patientType: z.enum(["Dewasa", "Anak", "Bayi"]).optional(),
  idType: z.string().optional(),
  idNumber: z.string().min(1, "Nomor identitas wajib diisi."),
  kkNumber: z.string().optional(),
  birthPlace: z.string().optional(),
  birthDate: z.date().refine((date) => !!date, {
    message: "Tanggal lahir harus diisi.",
  }),
  gender: z.string().min(1, { message: "Jenis kelamin harus dipilih." }),
  maritalStatus: z.string().min(1, "Status pernikahan wajib dipilih."),
  // ... tambahkan validasi untuk field lain jika perlu
  bloodType: z.string().optional(),
  religion: z.string().optional(),
  education: z.string().optional(),
  address: z.string().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  village: z.string().optional(),
  postalCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email tidak valid.").optional().or(z.literal("")),
  motherName: z.string().optional(),
  emergencyName: z.string().optional(),
  relationship: z.string().optional(),
  emergencyPhone: z.string().optional(),
  occupation: z.string().optional(),
  company: z.string().optional(),
  insurances: z.array(insuranceSchema).optional(),
});

export type PatientFormData = z.infer<typeof patientFormSchema>;
