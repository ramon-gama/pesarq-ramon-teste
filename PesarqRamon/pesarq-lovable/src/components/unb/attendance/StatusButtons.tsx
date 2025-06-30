
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { type AttendanceRecord } from "@/hooks/useAttendanceControl";

interface StatusButtonsProps {
  record: AttendanceRecord;
  onStatusUpdate: (recordId: string, newStatus: 'presente' | 'falta' | 'parcial') => void;
  loading: boolean;
}

export function StatusButtons({ record, onStatusUpdate, loading }: StatusButtonsProps) {
  const handleStatusClick = (status: 'presente' | 'falta' | 'parcial') => {
    console.log('Status button clicked:', { recordId: record.id, status });
    onStatusUpdate(record.id, status);
  };

  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant={record.status === 'presente' ? 'default' : 'outline'}
        className="h-8 px-2"
        onClick={() => handleStatusClick('presente')}
        disabled={loading}
        title="Marcar como Presente"
      >
        <CheckCircle className="h-4 w-4 text-green-600" />
      </Button>
      
      <Button
        size="sm"
        variant={record.status === 'falta' ? 'default' : 'outline'}
        className="h-8 px-2"
        onClick={() => handleStatusClick('falta')}
        disabled={loading}
        title="Marcar como Falta"
      >
        <XCircle className="h-4 w-4 text-red-600" />
      </Button>
      
      <Button
        size="sm"
        variant={record.status === 'parcial' ? 'default' : 'outline'}
        className="h-8 px-2"
        onClick={() => handleStatusClick('parcial')}
        disabled={loading}
        title="Marcar como Presença Parcial"
      >
        <AlertCircle className="h-4 w-4 text-yellow-600" />
      </Button>
    </div>
  );
}
