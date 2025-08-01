"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Edit,
  Eye,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const mockPatients = [
  {
    id: "1",
    mrNumber: "MR001234",
    fullName: "Budi Santoso",
    idNumber: "3201234567890123",
    phoneNumber: "08123456789",
    address: "Jl. Merdeka No. 123, Jakarta Pusat",
    gender: "Laki-laki",
    birthDate: "1985-06-15",
    lastVisit: "2024-01-15",
  },
  {
    id: "2",
    mrNumber: "MR001235",
    fullName: "Siti Nurhaliza",
    idNumber: "3201234567890124",
    phoneNumber: "08123456788",
    address: "Jl. Sudirman No. 456, Jakarta Selatan",
    gender: "Perempuan",
    birthDate: "1990-03-22",
    lastVisit: "2024-01-14",
  },
  {
    id: "3",
    mrNumber: "MR001236",
    fullName: "Ahmad Rahman",
    idNumber: "3201234567890125",
    phoneNumber: "08123456787",
    address: "Jl. Thamrin No. 789, Jakarta Pusat",
    gender: "Laki-laki",
    birthDate: "1978-11-08",
    lastVisit: "2024-01-13",
  },
  {
    id: "4",
    mrNumber: "MR001237",
    fullName: "Dewi Sartika",
    idNumber: "3201234567890126",
    phoneNumber: "08123456786",
    address: "Jl. Gatot Subroto No. 321, Jakarta Selatan",
    gender: "Perempuan",
    birthDate: "1988-07-30",
    lastVisit: "2024-01-12",
  },
  {
    id: "5",
    mrNumber: "MR001238",
    fullName: "Rudi Hartono",
    idNumber: "3201234567890127",
    phoneNumber: "08123456785",
    address: "Jl. Rasuna Said No. 654, Jakarta Selatan",
    gender: "Laki-laki",
    birthDate: "1982-12-05",
    lastVisit: "2024-01-11",
  },
];
const PatientList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [genderFilter, setGenderFilter] = useState("all");
  const router = useRouter();

  const filteredAndSortedPatients = mockPatients
    .filter((patient) => {
      const matchesSearch =
        patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.mrNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.idNumber.includes(searchQuery) ||
        patient.phoneNumber.includes(searchQuery);

      const matchesGender =
        genderFilter === "all" || patient.gender === genderFilter;

      return matchesSearch && matchesGender;
    })
    .sort((a, b) => {
      let compareA: string | Date;
      let compareB: string | Date;

      switch (sortBy) {
        case "name":
          compareA = a.fullName.toLowerCase();
          compareB = b.fullName.toLowerCase();
          break;
        case "mrNumber":
          compareA = a.mrNumber;
          compareB = b.mrNumber;
          break;
        case "birthDate":
          compareA = new Date(a.birthDate);
          compareB = new Date(b.birthDate);
          break;
        case "lastVisit":
          compareA = new Date(a.lastVisit);
          compareB = new Date(b.lastVisit);
          break;
        default:
          compareA = a.fullName.toLowerCase();
          compareB = b.fullName.toLowerCase();
      }

      if (compareA < compareB) return sortOrder === "asc" ? -1 : 1;
      if (compareA > compareB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const handleEdit = (patientId: string) => {
    router.push(`/patients/${patientId}/edit`);
  };

  const handleView = (patientId: string) => {
    router.push(`/patients/view/${patientId}`);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Daftar Pasien
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola data pasien rumah sakit
          </p>
        </div>

        <Button
          onClick={() => router.push("/patients/create")}
          className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-medical"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pasien Baru
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border bg-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Pasien
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {mockPatients.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pasien Hari Ini
                </p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
              <Calendar className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Dalam Antrian
                </p>
                <p className="text-2xl font-bold text-foreground">8</p>
              </div>
              <Phone className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Rawat Inap
                </p>
                <p className="text-2xl font-bold text-foreground">15</p>
              </div>
              <MapPin className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="border-border bg-card shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari pasien berdasarkan nama, no. MR, NIK, atau nomor telepon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] bg-input border-border">
                  <SelectValue placeholder="Urutkan berdasarkan" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="name">Nama</SelectItem>
                  <SelectItem value="mrNumber">No. MR</SelectItem>
                  <SelectItem value="birthDate">Tanggal Lahir</SelectItem>
                  <SelectItem value="lastVisit">Kunjungan Terakhir</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[140px] bg-input border-border">
                  <SelectValue placeholder="Urutan" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="asc">A - Z / Lama - Baru</SelectItem>
                  <SelectItem value="desc">Z - A / Baru - Lama</SelectItem>
                </SelectContent>
              </Select>

              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className="w-[140px] bg-input border-border">
                  <SelectValue placeholder="Jenis Kelamin" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Menampilkan {filteredAndSortedPatients.length} dari{" "}
              {mockPatients.length} pasien
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Patient Table */}
      <Card className="border-border bg-card shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="font-semibold text-foreground">
                  No. MR
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Nama Lengkap
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  NIK
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  No. Handphone
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Alamat
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-foreground text-right">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedPatients.map((patient) => (
                <TableRow
                  key={patient.id}
                  className="border-border hover:bg-muted/50"
                >
                  <TableCell className="font-medium text-primary">
                    {patient.mrNumber}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {patient.fullName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {patient.idNumber}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {patient.phoneNumber}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {patient.address}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-success/10 text-success border-success/20"
                    >
                      Aktif
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-card border-border"
                      >
                        <DropdownMenuItem
                          onClick={() => handleView(patient.id)}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEdit(patient.id)}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Data
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientList;
