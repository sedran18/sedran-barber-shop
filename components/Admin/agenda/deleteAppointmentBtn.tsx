'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CancelAppointment } from "@/lib/actions/appointment";
import { Trash2, Loader2 } from "lucide-react"; // Trash2 é mais comum para "excluir"
import { toast } from "sonner";

const DeleteAppointmentBtn = ({ id }: { id: string }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const areYouSure = confirm('Cancelar agendamento? O valor será estornado.');
    if (!areYouSure) return;

    setIsDeleting(true);
    try {
      const deleted = await CancelAppointment(id);
      if (deleted.success) {
        toast.success("Agendamento cancelado!", { position: "top-right" });
      } else {
        toast.error('Erro ao cancelar.', { position: "top-right" });
      }
    } catch (error) {
      toast.error('Erro de conexão.', { position: "top-right" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      onClick={handleDelete}
      disabled={isDeleting}
      variant="ghost"
      className="h-8 cursor-pointer w-8 p-0 rounded-full text-zinc-500 hover:text-red-500 hover:bg-red-500/10 active:bg-red-500/20 transition-colors"
    >
      {isDeleting ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Trash2 size={14} /> // Ícone menor (14px) reduz o erro visual
      )}
    </Button>
  );
};

export default DeleteAppointmentBtn;