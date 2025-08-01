"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  ArrowLeft,
  CalendarIcon,
  MapPin,
  Plus,
  Shield,
  Upload,
  User,
  UsersIcon,
  X,
} from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar } from "./ui/calendar";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";

interface Insurance {
  id: string;
  type: string;
  company: string;
  cardNumber: string;
  class: string;
  expiryDate: Date;
}

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
  const isEdit = !!patient;

  const [activeTab, setActiveTab] = useState("personal");
  const [birthDate, setBirthDate] = useState<Date | undefined>(
    patient?.birthDate
  );
  const [showInsuranceDialog, setShowInsuranceDialog] = useState(false);
  const [insurances, setInsurances] = useState<Insurance[]>(
    patient?.insurances || []
  );

  const [newInsurance, setNewInsurance] = useState({
    type: "",
    company: "",
    cardNumber: "",
    class: "",
    expiryDate: undefined as Date | undefined,
  });

  const handleSave = () => {
    console.log("Saving patient data (UI Prototype)...");
    router.push("/");
  };

  const handleAddInsurance = () => {
    if (newInsurance.type && newInsurance.company && newInsurance.cardNumber) {
      const insuranceToAdd: Insurance = {
        id: Date.now().toString(), // Use a temporary ID for the key
        ...newInsurance,
        expiryDate: newInsurance.expiryDate || new Date(),
      };

      setInsurances([...insurances, insuranceToAdd]);

      // Reset the dialog form and close it
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild className="hover:bg-medical-blue">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Link>
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

      <div className="space-y-6">
        <Card className="border-border bg-card shadow-card">
          <CardContent className="p-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-4 bg-muted">
                <TabsTrigger
                  value="personal"
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Data Pribadi
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Alamat & Kontak
                </TabsTrigger>
                <TabsTrigger value="family" className="flex items-center gap-2">
                  <UsersIcon className="w-4 h-4" />
                  Keluarga & Pekerjaan
                </TabsTrigger>
                <TabsTrigger
                  value="insurance"
                  className="flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Penjamin
                </TabsTrigger>
              </TabsList>

              {/* --- PERSONAL DATA TAB --- */}
              <TabsContent value="personal" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="fullName">Nama Lengkap *</Label>
                        <Input
                          id="fullName"
                          placeholder="Masukkan nama lengkap"
                          defaultValue={patient?.fullName}
                          className="border-ring-2"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="nickname">Nama Panggilan</Label>
                        <Input
                          id="nickname"
                          placeholder="Masukkan nama panggilan"
                          defaultValue={patient?.nickname}
                          className="border-ring-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="idType">Tipe Identitas</Label>
                        <Select defaultValue={patient?.idType}>
                          <SelectTrigger className="border-ring-2 w-full">
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
                        <Label htmlFor="idNumber">Nomor Identitas *</Label>
                        <Input
                          id="idNumber"
                          placeholder="Masukkan nomor identitas"
                          defaultValue={patient?.idNumber}
                          className="border-ring-2"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="kkNumber">No. Kartu Keluarga</Label>
                      <Input
                        id="kkNumber"
                        placeholder="Masukkan nomor kartu keluarga"
                        defaultValue={patient?.kkNumber}
                        className="border-ring-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="birthPlace">Tempat Lahir</Label>
                        <Input
                          id="birthPlace"
                          placeholder="Masukkan tempat lahir"
                          defaultValue={patient?.birthPlace}
                          className="border-ring-2"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>Tanggal Lahir</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-popover hover:bg-popover hover:text-popover-foreground border-ring-2",
                                !birthDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {birthDate
                                ? format(birthDate, "dd MMMM yyyy", {
                                    locale: id,
                                  })
                                : "Pilih tanggal"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={birthDate}
                              onSelect={setBirthDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="gender">Jenis Kelamin *</Label>
                        <Select defaultValue={patient?.gender}>
                          <SelectTrigger className="border-ring-2 w-full">
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
                        <Select defaultValue={patient?.bloodType}>
                          <SelectTrigger className="border-ring-2 w-full">
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

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="religion">Agama</Label>
                        <Select defaultValue={patient?.religion}>
                          <SelectTrigger className="border-ring-2 w-full">
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
                        <Select defaultValue={patient?.maritalStatus}>
                          <SelectTrigger className="border-ring-2 w-full">
                            <SelectValue placeholder="Pilih status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">
                              Belum Menikah
                            </SelectItem>
                            <SelectItem value="married">Menikah</SelectItem>
                            <SelectItem value="divorced">Cerai</SelectItem>
                            <SelectItem value="widowed">Janda/Duda</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="education">Pendidikan</Label>
                      <Select defaultValue={patient?.education}>
                        <SelectTrigger className="border-ring-2 w-full">
                          <SelectValue placeholder="Pilih pendidikan" />
                        </SelectTrigger>
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
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Foto Pasien</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Klik untuk upload foto atau drag & drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG hingga 2MB
                        </p>
                        <Button variant="outline" className="mt-4">
                          Pilih File
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* --- CONTACT & ADDRESS TAB --- */}
              <TabsContent value="contact" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="address">Alamat Lengkap *</Label>
                      <Textarea
                        id="address"
                        placeholder="Masukkan alamat lengkap"
                        className="min-h-[100px] border-ring-2 w-full"
                        defaultValue={patient?.address}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="province">Provinsi</Label>
                        <Select defaultValue={patient?.province}>
                          <SelectTrigger className="border-ring-2 w-full">
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
                        <Select defaultValue={patient?.city}>
                          <SelectTrigger className="border-ring-2 w-full">
                            <SelectValue placeholder="Pilih kota" />
                          </SelectTrigger>
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
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="district">Kecamatan</Label>
                        <Select defaultValue={patient?.district}>
                          <SelectTrigger className="border-ring-2 w-full">
                            <SelectValue placeholder="Pilih kecamatan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="menteng">Menteng</SelectItem>
                            <SelectItem value="gambir">Gambir</SelectItem>
                            <SelectItem value="tanah-abang">
                              Tanah Abang
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="village">Kelurahan/Desa</Label>
                        <Select defaultValue={patient?.village}>
                          <SelectTrigger className="border-ring-2 w-full">
                            <SelectValue placeholder="Pilih kelurahan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="menteng">Menteng</SelectItem>
                            <SelectItem value="pegangsaan">
                              Pegangsaan
                            </SelectItem>
                            <SelectItem value="cikini">Cikini</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="postalCode">Kode Pos</Label>
                      <Input
                        id="postalCode"
                        placeholder="Masukkan kode pos"
                        defaultValue={patient?.postalCode}
                        className="border-ring-2 w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="phone">No. Handphone *</Label>
                      <Input
                        id="phone"
                        placeholder="Masukkan nomor handphone"
                        defaultValue={patient?.phone}
                        className="border-ring-2 w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Masukkan email"
                        defaultValue={patient?.email}
                        className="border-ring-2 w-full"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* --- FAMILY & WORK TAB --- */}
              <TabsContent value="family" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="motherName">Nama Ibu Kandung</Label>
                      <Input
                        id="motherName"
                        placeholder="Masukkan nama ibu kandung"
                        defaultValue={patient?.motherName}
                        className="border-ring-2 w-full"
                      />
                    </div>
                    <Card className="border-border pb-10">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Kontak Darurat
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="emergencyName">
                            Nama Kontak Darurat
                          </Label>
                          <Input
                            id="emergencyName"
                            placeholder="Masukkan nama"
                            defaultValue={patient?.emergencyName}
                            className="border-ring-2 w-full"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="relationship">Hubungan</Label>
                          <Select defaultValue={patient?.relationship}>
                            <SelectTrigger className="border-ring-2 w-full">
                              <SelectValue placeholder="Pilih hubungan" />
                            </SelectTrigger>
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
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="emergencyPhone">No. Handphone</Label>
                          <Input
                            id="emergencyPhone"
                            placeholder="Masukkan nomor handphone"
                            defaultValue={patient?.emergencyPhone}
                            className="border-ring-2 w-full"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="occupation">Pekerjaan</Label>
                      <Select defaultValue={patient?.occupation}>
                        <SelectTrigger className="border-ring-2 w-full">
                          <SelectValue placeholder="Pilih pekerjaan" />
                        </SelectTrigger>
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
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="company">Nama Perusahaan</Label>
                      <Input
                        id="company"
                        placeholder="Masukkan nama perusahaan"
                        defaultValue={patient?.company}
                        className="border-ring-2 w-full"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* --- INSURANCE TAB --- */}
              <TabsContent value="insurance" className="space-y-6">
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
                      <Button
                        type="button"
                        className="bg-primary hover:bg-primary-hover"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Penjamin
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border">
                      <DialogHeader>
                        <DialogTitle>Tambah Data Penjamin</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="insuranceType">Tipe Penjamin</Label>
                          <Select
                            value={newInsurance.type}
                            onValueChange={(value) =>
                              setNewInsurance({ ...newInsurance, type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih tipe penjamin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bpjs">
                                BPJS Kesehatan
                              </SelectItem>
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
                        <div className="space-y-2">
                          <Label htmlFor="insuranceCompany">
                            Nama Perusahaan/Asuransi
                          </Label>
                          <Input
                            id="insuranceCompany"
                            placeholder="Masukkan nama perusahaan"
                            value={newInsurance.company}
                            onChange={(e) =>
                              setNewInsurance({
                                ...newInsurance,
                                company: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">No. Kartu</Label>
                          <Input
                            id="cardNumber"
                            placeholder="Masukkan nomor kartu"
                            value={newInsurance.cardNumber}
                            onChange={(e) =>
                              setNewInsurance({
                                ...newInsurance,
                                cardNumber: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="insuranceClass">Kelas</Label>
                          <Select
                            value={newInsurance.class}
                            onValueChange={(value) =>
                              setNewInsurance({ ...newInsurance, class: value })
                            }
                          >
                            <SelectTrigger>
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
                        <div className="space-y-2">
                          <Label>Tanggal Kadaluarsa</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={newInsurance.expiryDate}
                                onSelect={(date) =>
                                  setNewInsurance({
                                    ...newInsurance,
                                    expiryDate: date as Date,
                                  })
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button
                            type="button"
                            onClick={handleAddInsurance}
                            className="flex-1"
                          >
                            Tambah
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowInsuranceDialog(false)}
                            className="flex-1"
                          >
                            Batal
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {insurances.length > 0 ? (
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
                            <TableRow
                              key={insurance.id}
                              className="border-border"
                            >
                              <TableCell>
                                <Badge variant="secondary">
                                  {insurance.type}
                                </Badge>
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
                ) : (
                  <Card className="border-border border-dashed">
                    <CardContent className="p-8 text-center">
                      <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Belum ada data penjamin. Klik tombol "Tambah Penjamin"
                        untuk menambah data.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientForm;
