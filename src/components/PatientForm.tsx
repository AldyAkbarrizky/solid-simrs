"use client";
import React, { useState } from "react";
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

interface Insurance {
  id: string;
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

  // Insurance form state
  const [newInsurance, setNewInsurance] = useState({
    type: "",
    company: "",
    cardNumber: "",
    class: "",
    expiryDate: undefined as Date | undefined,
  });

  const handleSave = () => {
    // Implement save logic
    console.log("Saving patient data...");
    router.push("/patients");
  };

  const handleCancel = () => {
    router.push("/patients");
  };

  const handleAddInsurance = () => {
    if (newInsurance.type && newInsurance.company && newInsurance.cardNumber) {
      const insurance: Insurance = {
        id: Date.now().toString(),
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
  };

  const removeInsurance = (id: string) => {
    setInsurances(insurances.filter((ins) => ins.id !== id));
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
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="fullName">
                      Nama Lengkap <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Masukkan nama lengkap"
                      className="border-gray-300 w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="nickname">Nama Panggilan</Label>
                    <Input
                      id="nickname"
                      placeholder="Masukkan nama panggilan"
                      className="border-gray-300 w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="idType">Tipe Identitas</Label>
                    <Select>
                      <SelectTrigger className="w-full border-gray-300">
                        <SelectValue placeholder="Pilih tipe identitas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ktp">KTP</SelectItem>
                        <SelectItem value="sim">SIM</SelectItem>
                        <SelectItem value="passport">Passport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="idNumber">
                      Nomor Identitas{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="idNumber"
                      placeholder="Masukkan nomor identitas"
                      className="border-gray-300 w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="kkNumber">No. Kartu Keluarga</Label>
                  <Input
                    id="kkNumber"
                    placeholder="Masukkan nomor kartu keluarga"
                    className="border-gray-300 w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="birthPlace">Tempat Lahir</Label>
                    <Input
                      id="birthPlace"
                      placeholder="Masukkan tempat lahir"
                      className="border-gray-300 w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Tanggal Lahir</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal hover:bg-primary",
                            !birthDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {birthDate
                            ? format(birthDate, "dd MMMM yyyy", { locale: id })
                            : "Pilih tanggal"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={birthDate}
                          onSelect={setBirthDate}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="gender">
                      Jenis Kelamin <span className="text-destructive">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger className="border-gray-300 w-full">
                        <SelectValue placeholder="Pilih jenis kelamin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Laki-laki</SelectItem>
                        <SelectItem value="female">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="bloodType">Golongan Darah</Label>
                    <Select>
                      <SelectTrigger className="border-gray-300 w-full">
                        <SelectValue placeholder="Pilih golongan darah" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="AB">AB</SelectItem>
                        <SelectItem value="O">O</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="religion">Agama</Label>
                    <Select>
                      <SelectTrigger className="border-gray-300 w-full">
                        <SelectValue placeholder="Pilih agama" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="islam">Islam</SelectItem>
                        <SelectItem value="kristen">Kristen</SelectItem>
                        <SelectItem value="katolik">Katolik</SelectItem>
                        <SelectItem value="hindu">Hindu</SelectItem>
                        <SelectItem value="buddha">Buddha</SelectItem>
                        <SelectItem value="konghucu">Konghucu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="maritalStatus">Status Pernikahan</Label>
                    <Select>
                      <SelectTrigger className="border-gray-300 w-full">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Belum Menikah</SelectItem>
                        <SelectItem value="married">Menikah</SelectItem>
                        <SelectItem value="divorced">Cerai</SelectItem>
                        <SelectItem value="widowed">Janda/Duda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="education">Pendidikan</Label>
                  <Select>
                    <SelectTrigger className="border-gray-300 w-full">
                      <SelectValue placeholder="Pilih pendidikan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sd">SD</SelectItem>
                      <SelectItem value="smp">SMP</SelectItem>
                      <SelectItem value="sma">SMA</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="sarjana">Sarjana</SelectItem>
                      <SelectItem value="pascasarjana">Pascasarjana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-8">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="address">
                    Alamat Lengkap <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Masukkan alamat lengkap"
                    className="min-h-[139px] border-gray-300 w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="province">Provinsi</Label>
                    <Select>
                      <SelectTrigger className="border-gray-300 w-full">
                        <SelectValue placeholder="Pilih provinsi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jakarta">DKI Jakarta</SelectItem>
                        <SelectItem value="jabar">Jawa Barat</SelectItem>
                        <SelectItem value="jateng">Jawa Tengah</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="city">Kota/Kabupaten</Label>
                    <Select>
                      <SelectTrigger className="border-gray-300 w-full">
                        <SelectValue placeholder="Pilih kota" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jakpus">Jakarta Pusat</SelectItem>
                        <SelectItem value="jaksel">Jakarta Selatan</SelectItem>
                        <SelectItem value="jakut">Jakarta Utara</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="district">Kecamatan</Label>
                    <Select>
                      <SelectTrigger className="border-gray-300 w-full">
                        <SelectValue placeholder="Pilih kecamatan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="menteng">Menteng</SelectItem>
                        <SelectItem value="gambir">Gambir</SelectItem>
                        <SelectItem value="tanah-abang">Tanah Abang</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="village">Kelurahan/Desa</Label>
                    <Select>
                      <SelectTrigger className="border-gray-300 w-full">
                        <SelectValue placeholder="Pilih kelurahan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="menteng">Menteng</SelectItem>
                        <SelectItem value="pegangsaan">Pegangsaan</SelectItem>
                        <SelectItem value="cikini">Cikini</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="postalCode">Kode Pos</Label>
                  <Input
                    id="postalCode"
                    placeholder="Masukkan kode pos"
                    className="border-gray-300 w-full"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">
                    No. Handphone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    placeholder="Masukkan nomor handphone"
                    className="border-gray-300 w-full"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Masukkan email"
                    className="border-gray-300 w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-8">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="motherName">Nama Ibu Kandung</Label>
                  <Input
                    id="motherName"
                    placeholder="Masukkan nama ibu kandung"
                    className="border-gray-300 w-full"
                  />
                </div>

                <Card className="border-border pb-8">
                  <CardHeader>
                    <CardTitle className="text-lg">Kontak Darurat</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="emergencyName">Nama Kontak Darurat</Label>
                      <Input
                        id="emergencyName"
                        placeholder="Masukkan nama"
                        className="border-gray-300 w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="relationship">Hubungan</Label>
                      <Select>
                        <SelectTrigger className="border-gray-300 w-full">
                          <SelectValue placeholder="Pilih hubungan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spouse">Suami/Istri</SelectItem>
                          <SelectItem value="parent">Orang Tua</SelectItem>
                          <SelectItem value="child">Anak</SelectItem>
                          <SelectItem value="sibling">Saudara</SelectItem>
                          <SelectItem value="friend">Teman</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="emergencyPhone">No. Handphone</Label>
                      <Input
                        id="emergencyPhone"
                        placeholder="Masukkan nomor handphone"
                        className="border-gray-300 w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="occupation">Pekerjaan</Label>
                  <Select>
                    <SelectTrigger className="border-gray-300 w-full">
                      <SelectValue placeholder="Pilih pekerjaan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Karyawan</SelectItem>
                      <SelectItem value="entrepreneur">Wiraswasta</SelectItem>
                      <SelectItem value="civil-servant">PNS</SelectItem>
                      <SelectItem value="student">Pelajar/Mahasiswa</SelectItem>
                      <SelectItem value="unemployed">Tidak Bekerja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="company">Nama Perusahaan</Label>
                  <Input
                    id="company"
                    placeholder="Masukkan nama perusahaan"
                    className="border-gray-300 w-full"
                  />
                </div>
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
                              variant="ghost"
                              size="sm"
                              onClick={() => removeInsurance(insurance.id)}
                              className="text-destructive hover:text-destructive"
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
            className="hover:bg-secondary"
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
                            isClickable && "hover:text-primary cursor-pointer",
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
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="disabled:opacity-50 hover:bg-destructive"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Sebelumnya
                </Button>

                {currentStep < steps.length ? (
                  <Button
                    onClick={nextStep}
                    className="bg-primary hover:bg-primary-glow"
                  >
                    Selanjutnya
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSave}
                    className="bg-primary hover:bg-primary-glow"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Simpan
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;
