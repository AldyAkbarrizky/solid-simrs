"use client";
import React, { useEffect, useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Calendar as CalendarIcon,
  Upload,
  User,
  MapPin,
  Users as UsersIcon,
  Shield,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { PatientFormData, patientFormSchema } from "@/schemas/patient";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import api from "@/services/api";

interface Insurance {
  id?: string;
  insuranceId: string;
  type: string;
  company: string;
  cardNumber: string;
  class: string;
  expiryDate: Date;
}

const steps = [
  { id: 1, name: "Data Diri", icon: User, key: "personal" },
  { id: 2, name: "Alamat", icon: MapPin, key: "contact" },
  { id: 3, name: "Keluarga", icon: UsersIcon, key: "family" },
  { id: 4, name: "Data Wali", icon: Shield, key: "insurance" },
];

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
  birthDate?: Date;
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

const PatientForm = ({ patient }: { patient?: Patient }) => {
  const router = useRouter();
  const { id: patientId } = useParams();
  const isEdit = !!patient;

  // Form states
  const [currentStep, setCurrentStep] = useState(1);
  const [birthDate, setBirthDate] = useState<Date>();
  const [showInsuranceDialog, setShowInsuranceDialog] = useState(false);
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Insurance form state
  const [newInsurance, setNewInsurance] = useState({
    type: "",
    company: "",
    cardNumber: "",
    class: "",
    expiryDate: undefined as Date | undefined,
  });

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

  useEffect(() => {
    if (isEdit && patient.id) {
      const fetchGuarantors = async () => {
        try {
          const response = await api.get(
            `/guarantors/by-patient/${patient.id}`
          );
          form.setValue("insurances", response.data.data);
        } catch (error) {
          console.error("Gagal mengambil data penjamin:", error);
        }
      };
      fetchGuarantors();
    }
  }, [isEdit, patient, form]);

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

  const handleSave = async (data: PatientFormData, insurances: Insurance[]) => {
    // Implement save logic
    console.log("Data diterima: ", data);
    setIsLoading(true);

    const { patientType, title } = getPatientDetails(
      data.birthDate,
      data.gender,
      data.maritalStatus
    );
    console.log("Data insurances", insurances);
    const finalData = { data, insurances, patientType, title };
    console.log("Final data submitted", finalData);

    try {
      if (isEdit) {
        await api.put(`/patients/${patient.id}`, finalData);
      } else {
        await api.post("/patients", finalData);
      }
      alert("Data pasien berhasil disimpan!");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Gagal menyimpan data pasien:", error);
      alert("Gagal menyimpan data pasien. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/patients");
  };

  const handleAddInsurance = () => {
    if (newInsurance.type && newInsurance.company && newInsurance.cardNumber) {
      const insurance: Insurance = {
        insuranceId: Date.now().toString(),
        type: newInsurance.type,
        company: newInsurance.company,
        cardNumber: newInsurance.cardNumber,
        class: newInsurance.class,
        expiryDate: newInsurance.expiryDate || new Date(),
      };

      setInsurances([...insurances, insurance]);
      setNewInsurance({
        type: "",
        company: "",
        cardNumber: "",
        class: "",
        expiryDate: undefined,
      });
      setShowInsuranceDialog(false);
    }
    if (!patient?.id) {
      alert;
    }
  };

  const removeInsurance = (id: string) => {
    setInsurances(insurances.filter((ins) => ins.insuranceId !== id));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 text-[16px]">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              {/* Photo Upload */}
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label>Foto Pasien</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Klik untuk upload foto atau drag & drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG hingga 2MB
                    </p>
                    <Button variant="outline" className="mt-4 hover:bg-primary">
                      Pilih File
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>
                          Nama Lengkap{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masukkan nama lengkap"
                            className="border-gray-300 w-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nickname"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Nama Panggilan</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masukkan nama panggilan"
                            className="border-gray-300 w-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="idType"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Tipe Identitas</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full border-gray-300">
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
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>
                          Nomor Identitas{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masukkan nomor identitas"
                            className="border-gray-300 w-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="kkNumber"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>No. Kartu Keluarga</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan nomor kartu keluarga"
                          className="border-gray-300 w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="birthPlace"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Tempat Lahir</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masukkan tempat lahir"
                            className="border-gray-300 w-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Tanggal Lahir</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal hover:bg-primary",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value
                                    ? format(field.value, "dd MMMM yyyy", {
                                        locale: id,
                                      })
                                    : "Pilih tanggal"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                captionLayout="dropdown"
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>
                          Jenis Kelamin{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-300 w-full">
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
                    name="bloodType"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Golongan Darah</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-300 w-full">
                              <SelectValue placeholder="Pilih golongan darah" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="AB">AB</SelectItem>
                            <SelectItem value="O">O</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="religion"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Agama</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-300 w-full">
                              <SelectValue placeholder="Pilih agama" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="islam">Islam</SelectItem>
                            <SelectItem value="kristen">Kristen</SelectItem>
                            <SelectItem value="katolik">Katolik</SelectItem>
                            <SelectItem value="hindu">Hindu</SelectItem>
                            <SelectItem value="buddha">Buddha</SelectItem>
                            <SelectItem value="konghucu">Konghucu</SelectItem>
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
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>
                          Status Pernikahan{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-300 w-full">
                              <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="single">
                              Belum Menikah
                            </SelectItem>
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

                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Pendidikan</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300 w-full">
                            <SelectValue placeholder="Pilih pendidikan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sd">SD</SelectItem>
                          <SelectItem value="smp">SMP</SelectItem>
                          <SelectItem value="sma">SMA</SelectItem>
                          <SelectItem value="diploma">Diploma</SelectItem>
                          <SelectItem value="sarjana">Sarjana</SelectItem>
                          <SelectItem value="pascasarjana">
                            Pascasarjana
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>
                        Alamat Lengkap{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Masukkan alamat lengkap"
                          className="min-h-[139px] border-gray-300 w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Provinsi</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-300 w-full">
                              <SelectValue placeholder="Pilih provinsi" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="jakarta">DKI Jakarta</SelectItem>
                            <SelectItem value="jabar">Jawa Barat</SelectItem>
                            <SelectItem value="jateng">Jawa Tengah</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Kota/Kabupaten</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-300 w-full">
                              <SelectValue placeholder="Pilih kota" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="jakpus">
                              Jakarta Pusat
                            </SelectItem>
                            <SelectItem value="jaksel">
                              Jakarta Selatan
                            </SelectItem>
                            <SelectItem value="jakut">Jakarta Utara</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Kecamatan</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-300 w-full">
                              <SelectValue placeholder="Pilih kecamatan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="menteng">Menteng</SelectItem>
                            <SelectItem value="gambir">Gambir</SelectItem>
                            <SelectItem value="tanah-abang">
                              Tanah Abang
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="village"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Kelurahan/Desa</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-300 w-full">
                              <SelectValue placeholder="Pilih kelurahan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="menteng">Menteng</SelectItem>
                            <SelectItem value="pegangsaan">
                              Pegangsaan
                            </SelectItem>
                            <SelectItem value="cikini">Cikini</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Kode Pos</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan kode pos"
                          className="border-gray-300 w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>
                        No. Handphone{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan nomor handphone"
                          className="border-gray-300 w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Masukkan email"
                          className="border-gray-300 w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="motherName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Nama Ibu Kandung</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan nama ibu kandung"
                          className="border-gray-300 w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Card className="border-border pb-8">
                  <CardHeader>
                    <CardTitle className="text-lg">Kontak Darurat</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <FormField
                      control={form.control}
                      name="emergencyName"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel>Nama Kontak Darurat</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Masukkan nama"
                              className="border-gray-300 w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="relationship"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel>Hubungan</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="border-gray-300 w-full">
                                <SelectValue placeholder="Pilih hubungan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="spouse">
                                Suami/Istri
                              </SelectItem>
                              <SelectItem value="parent">Orang Tua</SelectItem>
                              <SelectItem value="child">Anak</SelectItem>
                              <SelectItem value="sibling">Saudara</SelectItem>
                              <SelectItem value="friend">Teman</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emergencyPhone"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel>No. Handphone</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Masukkan nomor handphone"
                              className="border-gray-300 w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Pekerjaan</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300 w-full">
                            <SelectValue placeholder="Pilih pekerjaan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="employee">Karyawan</SelectItem>
                          <SelectItem value="entrepreneur">
                            Wiraswasta
                          </SelectItem>
                          <SelectItem value="civil-servant">PNS</SelectItem>
                          <SelectItem value="student">
                            Pelajar/Mahasiswa
                          </SelectItem>
                          <SelectItem value="unemployed">
                            Tidak Bekerja
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Nama Perusahaan</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan nama perusahaan"
                          className="border-gray-300 w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  Data Penjamin/Asuransi
                </h3>
                <p className="text-sm text-muted-foreground">
                  Kelola data asuransi dan penjamin pasien
                </p>
              </div>

              <Dialog
                open={showInsuranceDialog}
                onOpenChange={setShowInsuranceDialog}
              >
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary-glow">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Penjamin
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>Tambah Data Penjamin</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="insuranceType">Tipe Penjamin</Label>
                      <Select
                        value={newInsurance.type}
                        onValueChange={(value) =>
                          setNewInsurance({ ...newInsurance, type: value })
                        }
                      >
                        <SelectTrigger className="border-gray-300 w-full">
                          <SelectValue placeholder="Pilih tipe penjamin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bpjs">BPJS Kesehatan</SelectItem>
                          <SelectItem value="asuransi">
                            Asuransi Swasta
                          </SelectItem>
                          <SelectItem value="perusahaan">
                            Asuransi Perusahaan
                          </SelectItem>
                          <SelectItem value="umum">Umum/Pribadi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="insuranceCompany">
                        Nama Perusahaan/Asuransi
                      </Label>
                      <Input
                        id="insuranceCompany"
                        placeholder="Masukkan nama perusahaan"
                        className="border-gray-300 w-full"
                        value={newInsurance.company}
                        onChange={(e) =>
                          setNewInsurance({
                            ...newInsurance,
                            company: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="cardNumber">No. Kartu</Label>
                      <Input
                        id="cardNumber"
                        placeholder="Masukkan nomor kartu"
                        className="border-gray-300 w-full"
                        value={newInsurance.cardNumber}
                        onChange={(e) =>
                          setNewInsurance({
                            ...newInsurance,
                            cardNumber: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="insuranceClass">Kelas</Label>
                      <Select
                        value={newInsurance.class}
                        onValueChange={(value) =>
                          setNewInsurance({ ...newInsurance, class: value })
                        }
                      >
                        <SelectTrigger className="border-gray-300 w-full">
                          <SelectValue placeholder="Pilih kelas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Kelas 1</SelectItem>
                          <SelectItem value="2">Kelas 2</SelectItem>
                          <SelectItem value="3">Kelas 3</SelectItem>
                          <SelectItem value="vip">VIP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>Tanggal Kadaluarsa</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal hover:bg-primary",
                              !newInsurance.expiryDate &&
                                "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newInsurance.expiryDate
                              ? format(
                                  newInsurance.expiryDate,
                                  "dd MMMM yyyy",
                                  { locale: id }
                                )
                              : "Pilih tanggal"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={newInsurance.expiryDate}
                            onSelect={(date) =>
                              setNewInsurance({
                                ...newInsurance,
                                expiryDate: date,
                              })
                            }
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleAddInsurance} className="flex-1">
                        Tambah
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowInsuranceDialog(false)}
                        className="flex-1 hover:bg-destructive"
                      >
                        Batal
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {insurances.length > 0 && (
              <Card className="border-border">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead>Tipe</TableHead>
                        <TableHead>Perusahaan</TableHead>
                        <TableHead>No. Kartu</TableHead>
                        <TableHead>Kelas</TableHead>
                        <TableHead>Berlaku Hingga</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {insurances.map((insurance) => (
                        <TableRow key={insurance.id} className="border-border">
                          <TableCell>
                            <Badge variant="secondary">{insurance.type}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {insurance.company}
                          </TableCell>
                          <TableCell>{insurance.cardNumber}</TableCell>
                          <TableCell>{insurance.class}</TableCell>
                          <TableCell>
                            {format(insurance.expiryDate, "dd MMM yyyy", {
                              locale: id,
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeInsurance(insurance.insuranceId)
                              }
                              className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {insurances.length === 0 && (
              <Card className="border-border border-dashed">
                <CardContent className="p-8 text-center">
                  <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Belum ada data penjamin. Klik tombol "Tambah Penjamin" untuk
                    menambah data.
                  </p>
                </CardContent>
              </Card>
            )}
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
            onClick={handleCancel}
            className="hover:bg-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Isi Data Pasien
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEdit
                ? "Perbarui informasi data pasien"
                : "Lengkapi formulir data pasien baru"}
            </p>
          </div>
        </div>
      </div>

      {/* Form with Steps */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            if (currentStep < steps.length) {
              nextStep();
            } else {
              handleSave(data, insurances); // Kirim data ke backend
            }
          })}
        >
          <div className="flex">
            {/* Step Sidebar */}
            <Card className="w-64 h-fit bg-card border-border shadow-card">
              <CardContent className="p-6">
                <nav className="relative">
                  {/* Background connecting line */}
                  <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-border" />

                  {/* Progress line */}
                  <div
                    className="absolute left-6 top-10 w-0.5 bg-primary transition-all duration-500 ease-in-out"
                    style={{
                      height:
                        currentStep === 1
                          ? "0%"
                          : currentStep === 2
                          ? "30%"
                          : currentStep === 3
                          ? "50%"
                          : "75%",
                    }}
                  />

                  {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    const isClickable = step.id <= currentStep;

                    return (
                      <div key={step.id} className="relative z-10">
                        {/* Step Content */}
                        <div className="flex items-center py-6">
                          <div className="flex items-center flex-shrink-0">
                            <button
                              onClick={() => isClickable && goToStep(step.id)}
                              disabled={!isClickable}
                              className={cn(
                                "flex items-center justify-center w-12 h-12 rounded-full text-[16px] font-medium transition-all border-2 bg-background",
                                isActive &&
                                  "bg-primary text-primary-foreground border-primary shadow-sm",
                                isCompleted &&
                                  "bg-primary text-primary-foreground border-primary",
                                !isActive &&
                                  !isCompleted &&
                                  "bg-background text-muted-foreground border-border",
                                isClickable && "cursor-pointer hover:scale-105",
                                !isClickable && "cursor-not-allowed"
                              )}
                            >
                              {isCompleted ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                step.id
                              )}
                            </button>
                          </div>

                          <div className="ml-4 min-w-0 flex-1">
                            <button
                              onClick={() => isClickable && goToStep(step.id)}
                              disabled={!isClickable}
                              className={cn(
                                "text-left w-full transition-colors",
                                isActive && "text-primary font-medium",
                                isCompleted && "text-foreground",
                                !isActive &&
                                  !isCompleted &&
                                  "text-muted-foreground",
                                isClickable &&
                                  "hover:text-primary cursor-pointer",
                                !isClickable && "cursor-not-allowed"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <step.icon className="w-4 h-4" />
                                <span className="text-[16px] font-medium">
                                  {step.name}
                                </span>
                              </div>
                            </button>
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
                    {steps.find((s) => s.id === currentStep)?.icon &&
                      React.createElement(
                        steps.find((s) => s.id === currentStep)!.icon,
                        { className: "w-5 h-5" }
                      )}
                    {steps.find((s) => s.id === currentStep)?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-[16px]">
                  {renderStepContent()}

                  {/* Step Navigation */}
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
                      <Button
                        type="button"
                        onClick={form.handleSubmit(() => {
                          if (currentStep < steps.length) nextStep();
                        })}
                      >
                        Selanjutnya{" "}
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                      </Button>
                    ) : (
                      <Button disabled={isLoading}>
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
