"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, QrCode, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { getAppointmentStatus } from "@/lib/actions/appointment";

interface PixModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCode?: string; 
  qrCodeBase64?: string;
  appointmentId?: string;
  onSuccess: () => void;
}

export function PixModal({ isOpen, onClose, qrCode, qrCodeBase64, appointmentId, onSuccess }: PixModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!qrCode) return;
    navigator.clipboard.writeText(qrCode);
    setCopied(true);
    toast.success("Código copiado!", );
    setTimeout(() => setCopied(false), 2000);
  };

  //Polling
  useEffect(() => {
    if (!isOpen || !appointmentId) return;

    const interval = setInterval(async () => {
      try {
        const data = await getAppointmentStatus(appointmentId);
        if (data.status === "CONFIRMED") {
          clearInterval(interval);
          onSuccess();
        }
      } catch (e) { console.error(e) }
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen, appointmentId, onSuccess]);

  if (!qrCode || !qrCodeBase64) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#0a0a0a] border-white/5 text-white rounded-[2.5rem] outline-none">
        <DialogHeader className="pt-4">
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-center">Pagamento via Pix</DialogTitle>
          <DialogDescription className="text-center text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold">SEDRAN Barber Shop</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-4 space-y-6">
          <div className="bg-white p-3 rounded-[2rem] shadow-[0_0_50px_-10px_rgba(220,38,38,0.3)]">
            <Image 
              src={`data:image/jpeg;base64,${qrCodeBase64}`} 
              alt="Pix QR Code" 
              width={180} height={180} 
              className="rounded-xl"
            />
          </div>

          <div className="w-full space-y-4">
            <div className="flex items-center gap-2 justify-center text-red-600 animate-pulse font-black uppercase tracking-[0.2em] text-[9px]">
              <Loader2 className="animate-spin" size={14} /> Aguardando pagamento...
            </div>

            <Button onClick={handleCopy} variant="outline" className="w-full h-14 border-white/5 bg-white/5 hover:bg-white/10 text-white rounded-2xl flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <QrCode size={20} className="text-red-600" />
                <span className="text-xs font-bold uppercase tracking-widest">Copia e Cola</span>
              </div>
              {copied ? <Check className="text-green-500" size={18} /> : <Copy size={18} className="text-gray-500" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}