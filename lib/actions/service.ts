'use server';

import prisma from "../prisma";

export const getServices = async (servicesId?: string[]) => {
    try {
        const services = await prisma.service.findMany({
            where: {
                id: servicesId ? { in: servicesId } : undefined
            }
        });

        if (!services || services.length === 0) {
            return { error: 'Não foi possível encontrar os serviços', data: null };
        }

        const serializedServices = services.map(service => ({
            ...service,
            price: Number(service.price), 
            duration: Number(service.duration) 
        }));
        
        return { error: null, data: serializedServices };

    } catch (err) {
        console.error(err);
        return { error: 'Não foi possível encontrar os serviços', data: null };
    }
}