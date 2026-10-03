'use client'

import { useState } from "react";
import AddBarber from "./addBarber"

const GestaoHeader = () => {
  const [isAdding, setIsAdding] = useState(false);

  return (
     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-tighter italic">
            Gestão de <span className="text-red-600">Equipe</span>
          </h1>
          <p className="text-gray-500 text-sm">Adicione barbeiros e gerencie permissões de acesso.</p>
        </div>

        <AddBarber isAdding={isAdding} setIsAdding={setIsAdding}/>
      </div>

  )
}

export default GestaoHeader
