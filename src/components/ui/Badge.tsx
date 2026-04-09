import React from "react";
import { LeadStatus, JobStatus } from "@/types";

type BadgeVariant = "blue" | "green" | "yellow" | "red" | "gray" | "purple";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  blue: "bg-blue-100 text-blue-800",
  green: "bg-green-100 text-green-800",
  yellow: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-800",
  gray: "bg-slate-100 text-slate-700",
  purple: "bg-purple-100 text-purple-800",
};

export function Badge({ variant = "gray", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const config: Record<LeadStatus, { variant: BadgeVariant; label: string }> = {
    NEW: { variant: "blue", label: "Ny" },
    CONTACTED: { variant: "yellow", label: "Kontaktad" },
    BOOKED: { variant: "purple", label: "Bokad" },
    COMPLETED: { variant: "green", label: "Klar" },
    LOST: { variant: "red", label: "Förlorad" },
  };
  const { variant, label } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const config: Record<JobStatus, { variant: BadgeVariant; label: string }> = {
    PENDING: { variant: "yellow", label: "Väntar" },
    IN_PROGRESS: { variant: "blue", label: "Pågår" },
    COMPLETED: { variant: "green", label: "Klar" },
    CANCELLED: { variant: "red", label: "Avbruten" },
  };
  const { variant, label } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}
