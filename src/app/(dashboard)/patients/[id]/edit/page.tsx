import PatientForm from "@/components/PatientForm";

const mockPatient = {
  id: "pat_12345",
  fullName: "Budi Santoso",
  nickname: "Budi",
  idType: "ktp",
  idNumber: "3273211203900001",
  kkNumber: "3273210987654321",
  birthPlace: "Bandung",
  birthDate: new Date("1990-03-12"),
  gender: "male",
  bloodType: "O",
  religion: "islam",
  maritalStatus: "married",
  education: "sarjana",
  address: "Jl. Merdeka No. 45, Cihapit",
  province: "jabar",
  city: "jaksel",
  district: "menteng",
  village: "cikini",
  postalCode: "40114",
  phone: "081234567890",
  email: "budi.santoso@example.com",
  motherName: "Siti Aminah",
  emergencyName: "Rina Santoso",
  relationship: "spouse",
  emergencyPhone: "081298765432",
  occupation: "employee",
  company: "PT Teknologi Maju",
  insurances: [
    {
      id: "ins_001",
      type: "bpjs",
      company: "BPJS Kesehatan",
      cardNumber: "0001234567890",
      class: "1",
      expiryDate: new Date("2026-12-31"),
    },
    {
      id: "ins_002",
      type: "asuransi",
      company: "Prudential",
      cardNumber: "PRU987654",
      class: "vip",
      expiryDate: new Date("2025-08-15"),
    },
  ],
};

const EditPatient = () => {
  return <PatientForm patient={mockPatient} />;
};

export default EditPatient;
