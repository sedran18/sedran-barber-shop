"use client";

import { useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react"; // Ícones de som

const VideoCard = ({ src }: { src: string }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="relative group mx-auto w-full aspect-[9/16] max-w-[280px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
      <video
        ref={videoRef}
        src={src}
        muted
        autoPlay
        loop
        playsInline
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Overlay Gradiente para os controles */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Botão de Som */}
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 p-3 bg-red-600/80 hover:bg-red-600 text-white rounded-full backdrop-blur-md transition-all active:scale-90 z-30"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* Detalhe de borda refletiva no hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-600/30 rounded-2xl transition-all pointer-events-none" />
    </div>
  );
};

export default VideoCard;