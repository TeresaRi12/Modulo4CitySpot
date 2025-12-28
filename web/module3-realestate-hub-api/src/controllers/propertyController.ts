// =============================================================================
// CONTROLADOR DE PROPIEDADES - Module 3: RealEstate Hub API
// =============================================================================
// Los controladores contienen la lógica de negocio de los endpoints.
//
// ## Patrón Controller
// Separamos la lógica de negocio de las rutas para:
// - Facilitar el testing
// - Reutilizar lógica entre endpoints
// - Mantener las rutas limpias y declarativas
//
// ## Manejo de Errores
// Cada controlador maneja sus propios errores y devuelve respuestas
// consistentes usando el formato ApiResponse/ApiErrorResponse.
// =============================================================================

import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  createPropertySchema,
  updatePropertySchema,
  type Property,
  type PropertyFilters,
} from '../types/property.js';

// Instancia singleton del cliente Prisma
const prisma = new PrismaClient();

// =============================================================================
// HELPER: Transformar propiedad de Prisma a API
// =============================================================================
// Prisma almacena amenities e images como JSON strings.
// Los convertimos a arrays para la respuesta API.
// =============================================================================

interface PrismaProperty {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  operationType: string;
  price: number;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string;
  images: string;
  createdAt: Date;
  updatedAt: Date;
}

function transformProperty(dbProperty: PrismaProperty): Property {
  return {
    id: dbProperty.id,
    title: dbProperty.title,
    description: dbProperty.description,
    propertyType: dbProperty.propertyType as Property['propertyType'],
    operationType: dbProperty.operationType as Property['operationType'],
    price: dbProperty.price,
    address: dbProperty.address,
    city: dbProperty.city,
    bedrooms: dbProperty.bedrooms,
    bathrooms: dbProperty.bathrooms,
    area: dbProperty.area,
    amenities: JSON.parse(dbProperty.amenities) as Property['amenities'],
    images: JSON.parse(dbProperty.images) as Property['images'],
    createdAt: dbProperty.createdAt.toISOString(),
    updatedAt: dbProperty.updatedAt.toISOString(),
  };
}

// =============================================================================
// GET /api/properties - Listar propiedades con filtros
// =============================================================================
// Reemplaza: localStorage.getItem('properties')
// =============================================================================

export async function getAllProperties(req: Request, res: Response): Promise<void> {
  try {
    // Extraemos filtros de los query params
    const filters: PropertyFilters = {
      search: req.query.search as string | undefined,
      propertyType: req.query.propertyType as PropertyFilters['propertyType'],
      operationType: req.query.operationType as PropertyFilters['operationType'],
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      minBedrooms: req.query.minBedrooms ? Number(req.query.minBedrooms) : undefined,
      city: req.query.city as string | undefined,
    };

    // Construimos la query de Prisma dinámicamente
    const where: Record<string, unknown> = {};

    if (filters.propertyType) {
      where.propertyType = filters.propertyType;
    }

    if (filters.operationType) {
      where.operationType = filters.operationType;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        (where.price as Record<string, number>).gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        (where.price as Record<string, number>).lte = filters.maxPrice;
      }
    }

    if (filters.minBedrooms !== undefined) {
      where.bedrooms = { gte: filters.minBedrooms };
    }

    if (filters.city) {
      where.city = { contains: filters.city };
    }

    // Búsqueda por texto en múltiples campos
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
        { address: { contains: filters.search } },
        { city: { contains: filters.search } },
      ];
    }

    // Ejecutamos la query
    const properties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Transformamos y enviamos respuesta
    const transformed = properties.map(transformProperty);

    res.json({
      success: true,
      data: transformed,
    });
  } catch (error) {
    console.error('Error al obtener propiedades:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
      },
    });
  }
}

// =============================================================================
// GET /api/properties/:id - Obtener una propiedad por ID
// =============================================================================

export async function getPropertyById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      res.status(404).json({
        success: false,
        error: {
          message: 'Propiedad no encontrada',
          code: 'NOT_FOUND',
        },
      });
      return;
    }

    res.json({
      success: true,
      data: transformProperty(property),
    });
  } catch (error) {
    console.error('Error al obtener propiedad:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
      },
    });
  }
}

// =============================================================================
// POST /api/properties - Crear una nueva propiedad
// =============================================================================
// Reemplaza: localStorage.setItem('properties', ...)
// =============================================================================

export async function createProperty(req: Request, res: Response): Promise<void> {
  try {
    // Validamos el body con Zod
    const validationResult = createPropertySchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Datos de entrada inválidos',
          code: 'VALIDATION_ERROR',
          details: validationResult.error.errors,
        },
      });
      return;
    }

    const data = validationResult.data;

    // Creamos la propiedad en la base de datos
    const property = await prisma.property.create({
      data: {
        ...data,
        amenities: JSON.stringify(data.amenities),
        images: JSON.stringify(data.images),
      },
    });

    res.status(201).json({
      success: true,
      data: transformProperty(property),
    });
  } catch (error) {
    console.error('Error al crear propiedad:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
      },
    });
  }
}

// =============================================================================
// PUT /api/properties/:id - Actualizar una propiedad
// =============================================================================

export async function updateProperty(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    // Verificamos que la propiedad existe
    const existing = await prisma.property.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({
        success: false,
        error: {
          message: 'Propiedad no encontrada',
          code: 'NOT_FOUND',
        },
      });
      return;
    }

    // Validamos el body
    const validationResult = updatePropertySchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Datos de entrada inválidos',
          code: 'VALIDATION_ERROR',
          details: validationResult.error.errors,
        },
      });
      return;
    }

    const data = validationResult.data;

    // Preparamos los datos para actualizar
    const updateData: Record<string, unknown> = { ...data };

    if (data.amenities) {
      updateData.amenities = JSON.stringify(data.amenities);
    }
    if (data.images) {
      updateData.images = JSON.stringify(data.images);
    }

    // Actualizamos
    const property = await prisma.property.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      data: transformProperty(property),
    });
  } catch (error) {
    console.error('Error al actualizar propiedad:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
      },
    });
  }
}

// =============================================================================
// DELETE /api/properties/:id - Eliminar una propiedad
// =============================================================================

export async function deleteProperty(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    // Verificamos que la propiedad existe
    const existing = await prisma.property.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({
        success: false,
        error: {
          message: 'Propiedad no encontrada',
          code: 'NOT_FOUND',
        },
      });
      return;
    }

    // Eliminamos
    await prisma.property.delete({ where: { id } });

    res.json({
      success: true,
      data: { message: 'Propiedad eliminada correctamente' },
    });
  } catch (error) {
    console.error('Error al eliminar propiedad:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
      },
    });
  }
}
