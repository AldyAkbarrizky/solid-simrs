"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Shadcn UI & Lucide Icons
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ArrowLeft,
  Save,
  Plus,
  Calendar as CalendarIcon,
  Upload,
  User,
  MapPin,
  Users as UsersIcon,
  Shield,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/services/api"; // Pastikan path ini benar
import { PatientFormData, patientFormSchema } from "@/schemas/patient";

interface Insurance {
  id?: string;
  type: string;
  company: string;
  cardNumber: string;
  class?: string;
  expiryDate?: Date;
}

interface Patient {
  id: string;
  fullName?: string;
  nickname?: string;
  idType?: string;
  idNumber?: string;
  kkNumber?: string;
  title?: string;
  patientType?: "Dewasa" | "Anak" | "Bayi";
  birthPlace?: string;
  birthDate?: Date | string; // Bisa string dari API
  gender?: string;
  bloodType?: string;
  religion?: string;
  maritalStatus?: string;
  education?: string;
  address?: string;
  province?: string;
  city?: string;
  district?: string;
  village?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  motherName?: string;
  emergencyName?: string;
  relationship?: string;
  emergencyPhone?: string;
  occupation?: string;
  company?: string;
  insurances: Insurance[];
}

const steps = [
  { id: 1, name: "Data Diri", icon: User },
  { id: 2, name: "Alamat & Kontak", icon: MapPin },
  { id: 3, name: "Keluarga & Pekerjaan", icon: UsersIcon },
  { id: 4, name: "Data Penjamin", icon: Shield },
];

const PatientForm = ({ patient }: { patient?: Patient }) => {
  const router = useRouter();
  const isEdit = !!patient;
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: patient
      ? {
          ...patient,
          birthDate: patient.birthDate
            ? new Date(patient.birthDate)
            : undefined,
          insurances: patient.insurances ?? [],
        }
      : {
          fullName: "",
          nickname: "",
          title: "",
          patientType: "Dewasa",
          idType: "",
          idNumber: "",
          kkNumber: "",
          birthPlace: "",
          birthDate: undefined,
          gender: "",
          maritalStatus: "",
          bloodType: "",
          religion: "",
          education: "",
          address: "",
          province: "",
          city: "",
          district: "",
          village: "",
          postalCode: "",
          phone: "",
          email: "",
          motherName: "",
          emergencyName: "",
          relationship: "",
          emergencyPhone: "",
          occupation: "",
          company: "",
          insurances: [],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "insurances",
  });

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const getPatientDetails = (
    birthDate: Date,
    gender: string,
    maritalStatus: string
  ) => {
    const age = calculateAge(birthDate);
    let patientType: "Dewasa" | "Anak" | "Bayi";
    let title: "Tuan" | "Nyonya" | "Nona" | "Anak" | "Bayi";

    if (age < 1) {
      patientType = "Bayi";
      title = "Bayi";
    } else if (age < 14) {
      patientType = "Anak";
      title = "Anak";
    } else {
      patientType = "Dewasa";
      if (gender === "male") {
        title = "Tuan";
      } else {
        if (maritalStatus === "married") {
          title = "Nyonya";
        } else {
          title = "Nona";
        }
      }
    }
    return { patientType, title };
  };

  async function onSubmit(data: PatientFormData) {
    setIsLoading(true);

    const { patientType, title } = getPatientDetails(
      data.birthDate,
      data.gender,
      data.maritalStatus
    );
    const finalData = { ...data, patientType, title };

    try {
      if (isEdit) {
        await api.put(`/patients/${patient.id}`, finalData);
      } else {
        await api.post("/patients", finalData);
      }
      alert("Data pasien berhasil disimpan!"); // Ganti dengan Toast
      router.push("/");
      router.refresh(); // Untuk memicu re-fetch data di halaman daftar
    } catch (error) {
      console.error("Gagal menyimpan data pasien:", error);
      alert("Gagal menyimpan data pasien. Silakan coba lagi."); // Ganti dengan Toast
    } finally {
      setIsLoading(false);
    }
  }

  const nextStep = () =>
    setCurrentStep((prev) => (prev < steps.length ? prev + 1 : prev));
  const prevStep = () => setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nama Lengkap <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Panggilan</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama panggilan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="idType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Identitas</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe identitas" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ktp">KTP</SelectItem>
                      <SelectItem value="sim">SIM</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nomor Identitas <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nomor identitas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthPlace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempat Lahir</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan tempat lahir" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Tanggal Lahir <span className="text-destructive">*</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "dd MMMM yyyy", { locale: id })
                          ) : (
                            <span>Pilih tanggal</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Jenis Kelamin <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis kelamin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Laki-laki</SelectItem>
                      <SelectItem value="female">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maritalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Status Pernikahan{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="single">Belum Menikah</SelectItem>
                      <SelectItem value="married">Menikah</SelectItem>
                      <SelectItem value="divorced">Cerai</SelectItem>
                      <SelectItem value="widowed">Janda/Duda</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>
                    Alamat Lengkap <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan alamat lengkap"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provinsi</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan provinsi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kota/Kabupaten</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan kota/kabupaten" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    No. Handphone <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nomor handphone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Masukkan email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="motherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Ibu Kandung</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama ibu kandung" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pekerjaan</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan pekerjaan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Data Penjamin</h3>
              <Button
                type="button"
                size="sm"
                onClick={() =>
                  append({ type: "", company: "", cardNumber: "" })
                }
              >
                <Plus className="w-4 h-4 mr-2" /> Tambah Penjamin
              </Button>
            </div>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card
                  key={field.id}
                  className="p-4 grid grid-cols-10 gap-4 relative"
                >
                  <FormField
                    control={form.control}
                    name={`insurances.${index}.type`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Tipe</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih tipe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bpjs">BPJS</SelectItem>
                            <SelectItem value="asuransi">Asuransi</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`insurances.${index}.company`}
                    render={({ field }) => (
                      <FormItem className="col-span-3">
                        <FormLabel>Perusahaan</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama perusahaan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`insurances.${index}.cardNumber`}
                    render={({ field }) => (
                      <FormItem className="col-span-4">
                        <FormLabel>No. Kartu</FormLabel>
                        <FormControl>
                          <Input placeholder="Nomor kartu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="col-span-1 flex items-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="hover:bg-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isEdit ? "Edit Data Pasien" : "Tambah Pasien Baru"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEdit
                ? "Perbarui informasi data pasien"
                : "Lengkapi formulir data pasien baru"}
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex">
            {/* Step Sidebar */}
            <Card className="w-64 h-fit bg-card border-border shadow-card">
              <CardContent className="p-6">
                <nav className="relative">
                  <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-border" />
                  <div
                    className="absolute left-6 top-10 w-0.5 bg-primary transition-all duration-500 ease-in-out"
                    style={{
                      height: `${
                        ((currentStep - 1) / (steps.length - 1)) * 100
                      }%`,
                    }}
                  />
                  {steps.map((step) => {
                    const isCompleted = currentStep > step.id;
                    return (
                      <div
                        key={step.id}
                        className="relative z-10 flex items-center py-6"
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center w-12 h-12 rounded-full text-[16px] font-medium transition-all border-2",
                            currentStep === step.id
                              ? "bg-primary text-primary-foreground border-primary"
                              : isCompleted
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-muted-foreground border-border"
                          )}
                        >
                          {isCompleted ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            step.id
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center gap-2">
                            <step.icon className="w-4 h-4" />
                            <span className="text-[16px] font-medium">
                              {step.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>

            {/* Form Content */}
            <div className="flex-1 mx-6">
              <Card className="border-border bg-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {React.createElement(steps[currentStep - 1].icon, {
                      className: "w-5 h-5",
                    })}
                    {steps[currentStep - 1].name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-[16px]">
                  {renderStepContent()}

                  {/* Navigasi Step */}
                  <div className="flex justify-between pt-6 mt-6 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" /> Sebelumnya
                    </Button>
                    {currentStep < steps.length ? (
                      <Button type="button" onClick={nextStep}>
                        Selanjutnyaaa{" "}
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isLoading}>
                        <Save className="w-4 h-4 mr-2" />{" "}
                        {isLoading ? "Menyimpan..." : "Simpan"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PatientForm;
