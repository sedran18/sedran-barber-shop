'use client';

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { deleteBarber } from '@/lib/actions/barber'

const DeleteBarberBtn = ({id}: {id: string}) => {
  return (
            <Button 
                  variant="ghost" 
                  className="text-gray-600 cursor-pointer hover:text-red-600 hover:bg-red-600/10 h-10 w-10 p-0 rounded-xl"
                  title="Remover Funcionário"
                  onClick={() => deleteBarber(id)}
            >
                  <Trash2 size={18} />
            </Button>
  )
}

export default DeleteBarberBtn
