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
  Bed,
  Calendar,
  Clock,
  Edit,
  Eye,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  User,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import api from "@/services/api";

// Definisikan tipe data Patient agar lebih aman
interface Patient {
  id: string;
  mrNumber: string;
  fullName: string;
  idNumber: string;
  phone: string; // Di backend namanya 'phone'
  address: string;
  gender: string;
  birthDate: string;
}

const PatientList = () => {
  const router = useRouter();

  // State untuk data dan UI
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk filter dan sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("mrNumber");
  const [sortOrder, setSortOrder] = useState("asc");
  const [genderFilter, setGenderFilter] = useState("all");

  // useEffect ini menangani pengambilan data.
  // Ini akan berjalan saat komponen pertama kali dimuat (initial fetch)
  // dan setiap kali `searchQuery` berubah (setelah debounce).
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/patients", {
          params: {
            page: 1,
            limit: 100, // Ambil data yang cukup untuk diolah di client
            q: searchQuery,
          },
        });
        // Set data pasien dan total data dari respons API
        setPatients(response.data.data);
        setTotalPatients(response.data.pagination.totalItems);
      } catch (error) {
        console.error("Gagal mengambil data pasien:", error);
        // Idealnya, tampilkan notifikasi error kepada user
      } finally {
        setIsLoading(false);
      }
    };

    // Debouncing: Menunggu 300ms setelah user berhenti mengetik
    // sebelum memanggil API untuk mengurangi beban server.
    const timer = setTimeout(() => {
      fetchPatients();
    }, 300);

    // Cleanup function untuk membersihkan timer
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Logika untuk filter (berdasarkan gender) dan sorting di sisi client
  const filteredAndSortedPatients = useMemo(() => {
    return [...patients] // Buat salinan array agar tidak mengubah state asli
      .filter((patient) => {
        const genderValue =
          patient.gender === "male" ? "Laki-laki" : "Perempuan";
        return genderFilter === "all" || genderValue === genderFilter;
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
          default:
            compareA = a.fullName.toLowerCase();
            compareB = b.fullName.toLowerCase();
        }

        if (compareA < compareB) return sortOrder === "asc" ? -1 : 1;
        if (compareA > compareB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [patients, genderFilter, sortBy, sortOrder]);

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

      {/* Stats Cards - Menggunakan data dari state */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border bg-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Pasien
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {totalPatients}
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
                <p className="text-2xl font-bold text-foreground">
                  {totalPatients}
                </p>
              </div>
              <User className="w-8 h-8 text-warning" />
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
                <p className="text-2xl font-bold text-foreground">
                  {totalPatients}
                </p>
              </div>
              <Clock className="w-8 h-8 text-destructive" />
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
                <p className="text-2xl font-bold text-foreground">
                  {totalPatients}
                </p>
              </div>
              <Bed className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        {/* Kartu statistik lainnya bisa diisi dengan data API yang relevan */}
      </div>

      {/* Search and Filter */}
      <Card className="border-border bg-card shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari pasien berdasarkan nama, no. MR, NIK..."
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
                  <SelectItem value="mrNumber">No. MR</SelectItem>
                  <SelectItem value="name">Nama</SelectItem>
                  <SelectItem value="birthDate">Tanggal Lahir</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[140px] bg-input border-border">
                  <SelectValue placeholder="Urutan" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="asc">A - Z / Terlama</SelectItem>
                  <SelectItem value="desc">Z - A / Terbaru</SelectItem>
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
              {totalPatients} pasien
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
                <TableHead>No. MR</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>NIK</TableHead>
                <TableHead>No. Handphone</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedPatients.length > 0 ? (
                filteredAndSortedPatients.map((patient) => (
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
                      {patient.phone}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {patient.address}
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Tidak ada data pasien.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientList;
