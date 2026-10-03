"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // richColors garante que o fundo mude de cor no sucesso/erro
      richColors 
      icons={{
        success: <CircleCheckIcon className="size-4 text-green-500" />,
        info: <InfoIcon className="size-4 text-blue-500" />,
        warning: <TriangleAlertIcon className="size-4 text-yellow-500" />,
        error: <OctagonXIcon className="size-4 text-red-600" />,
        loading: <Loader2Icon className="size-4 animate-spin text-zinc-400" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group toast rounded-[1.2rem] border-white/10 font-sans shadow-2xl",
          description: "group-[.toast]:text-zinc-400 text-[11px]",
          actionButton: "group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-900",
          cancelButton: "group-[.toast]:bg-zinc-800 group-[.toast]:text-zinc-400",
          // Estilo específico para quando for sucesso/erro com richColors
          success: "group-[.toaster]:bg-zinc-950 group-[.toaster]:text-green-500 group-[.toaster]:border-green-500/20",
          error: "group-[.toaster]:bg-zinc-950 group-[.toaster]:text-red-500 group-[.toaster]:border-red-500/20",
        }
      }}
      style={
        {
          // Cores base para o modo Dark da barbearia
          "--normal-bg": "#09090b",           // Preto profundo (zinc-950)
          "--normal-text": "#fafafa",         // Branco acinzentado (zinc-50)
          "--normal-border": "rgba(255, 255, 255, 0.1)", // Borda sutil
          "--success-bg": "#09090b",          // Mantemos o fundo escuro no sucesso
          "--success-text": "#10b981",        // Verde esmeralda
          "--error-bg": "#09090b",            // Fundo escuro no erro
          "--error-text": "#ef4444",          // Vermelho vivo
          "--border-radius": "1.2rem",        // Combinando com os seus cards redondos
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }