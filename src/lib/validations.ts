export interface ValidationError {
  field: string;
  message: string;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return /^[\+]?[\d\s\-\(\)]{7,15}$/.test(phone.trim());
}

export interface LeadInput {
  name: string;
  phone: string;
  email: string;
  address: string;
  houseSize: number;
  floors: number;
  heatingSystem: string;
  message?: string;
}

export function validateLead(data: unknown): ValidationError[] {
  const errors: ValidationError[] = [];
  const d = data as Record<string, unknown>;

  if (!d.name || String(d.name).trim().length < 2) {
    errors.push({ field: "name", message: "Namn måste vara minst 2 tecken" });
  }
  if (!d.phone || !validatePhone(String(d.phone))) {
    errors.push({ field: "phone", message: "Ogiltigt telefonnummer" });
  }
  if (!d.email || !validateEmail(String(d.email))) {
    errors.push({ field: "email", message: "Ogiltig e-postadress" });
  }
  if (!d.address || String(d.address).trim().length < 5) {
    errors.push({ field: "address", message: "Ange en fullständig adress" });
  }
  const houseSize = Number(d.houseSize);
  if (!houseSize || houseSize < 10 || houseSize > 5000) {
    errors.push({
      field: "houseSize",
      message: "Bostadsyta måste vara mellan 10 och 5000 m²",
    });
  }
  const floors = Number(d.floors);
  if (!floors || floors < 1 || floors > 10) {
    errors.push({
      field: "floors",
      message: "Antal våningar måste vara mellan 1 och 10",
    });
  }
  if (!d.heatingSystem || String(d.heatingSystem).trim().length < 2) {
    errors.push({
      field: "heatingSystem",
      message: "Ange ditt nuvarande värmesystem",
    });
  }

  return errors;
}

export interface BookingInput {
  leadId: number;
  date: string;
  time: string;
  type: string;
}

export function validateBooking(data: unknown): ValidationError[] {
  const errors: ValidationError[] = [];
  const d = data as Record<string, unknown>;

  if (!d.leadId || isNaN(Number(d.leadId))) {
    errors.push({ field: "leadId", message: "Ogiltigt lead-ID" });
  }
  if (!d.date || isNaN(Date.parse(String(d.date)))) {
    errors.push({ field: "date", message: "Ogiltigt datum" });
  }
  if (!d.time || !/^\d{2}:\d{2}$/.test(String(d.time))) {
    errors.push({ field: "time", message: "Ogiltig tid (HH:MM)" });
  }
  if (!d.type || !["CONSULTATION", "INSTALLATION"].includes(String(d.type))) {
    errors.push({ field: "type", message: "Ogiltig bokningstyp" });
  }

  return errors;
}

export interface CustomerInput {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
}

export function validateCustomer(data: unknown): ValidationError[] {
  const errors: ValidationError[] = [];
  const d = data as Record<string, unknown>;

  if (!d.name || String(d.name).trim().length < 2) {
    errors.push({ field: "name", message: "Namn måste vara minst 2 tecken" });
  }
  if (!d.phone || !validatePhone(String(d.phone))) {
    errors.push({ field: "phone", message: "Ogiltigt telefonnummer" });
  }
  if (!d.email || !validateEmail(String(d.email))) {
    errors.push({ field: "email", message: "Ogiltig e-postadress" });
  }
  if (!d.address || String(d.address).trim().length < 5) {
    errors.push({ field: "address", message: "Ange en fullständig adress" });
  }

  return errors;
}
