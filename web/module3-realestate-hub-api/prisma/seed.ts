// =============================================================================
// SEED SCRIPT - Module 3: RealEstate Hub API
// =============================================================================
// Este script pobla la base de datos con datos de ejemplo.
// Se ejecuta con: npm run db:seed
//
// ## ¿Por qué sembrar datos?
// - Facilita el desarrollo y testing
// - Proporciona datos de demostración
// - Los datos coinciden con los de Module 2 para consistencia
// =============================================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Datos de ejemplo (los mismos que en Module 2)
const sampleProperties = [
  {
    title: 'Elegante apartamento con vista al mar en primera línea',
    description:
      'Espectacular apartamento de lujo ubicado en primera línea de playa. Cuenta con amplios espacios, acabados de alta calidad y unas vistas impresionantes al mar Mediterráneo. La cocina está completamente equipada con electrodomésticos de última generación. El edificio cuenta con piscina comunitaria, gimnasio y seguridad 24 horas.',
    propertyType: 'apartamento',
    operationType: 'venta',
    price: 450000,
    address: 'Paseo Marítimo 123, Playa del Sol',
    city: 'Valencia',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    amenities: JSON.stringify(['piscina', 'gimnasio', 'seguridad', 'aire_acondicionado', 'terraza']),
    images: JSON.stringify([
      'https://placehold.co/800x600/3b82f6/ffffff?text=Apartamento+Vista+Mar',
      'https://placehold.co/800x600/3b82f6/ffffff?text=Salon',
      'https://placehold.co/800x600/3b82f6/ffffff?text=Terraza',
    ]),
  },
  {
    title: 'Casa unifamiliar con jardín en urbanización exclusiva',
    description:
      'Magnífica casa independiente en urbanización cerrada con vigilancia. Dispone de amplío jardín con piscina privada, garaje para dos vehículos y trastero. Interior distribuido en dos plantas con salón-comedor de 50m², cocina americana, cuatro dormitorios y tres baños completos. Calidades premium y domótica integrada.',
    propertyType: 'casa',
    operationType: 'venta',
    price: 680000,
    address: 'Calle Las Palmeras 45, Urb. Los Olivos',
    city: 'Madrid',
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    amenities: JSON.stringify([
      'piscina',
      'jardin',
      'garage',
      'seguridad',
      'aire_acondicionado',
      'calefaccion',
    ]),
    images: JSON.stringify([
      'https://placehold.co/800x600/22c55e/ffffff?text=Casa+Jardin',
      'https://placehold.co/800x600/22c55e/ffffff?text=Piscina',
      'https://placehold.co/800x600/22c55e/ffffff?text=Interior',
    ]),
  },
  {
    title: 'Moderno loft en el centro histórico ideal para inversión',
    description:
      'Loft de diseño contemporáneo ubicado en pleno casco antiguo. Espacio diáfano de 75m² con techos altos y grandes ventanales. Perfecto como vivienda o para alquiler turístico. El edificio ha sido completamente rehabilitado manteniendo elementos originales como vigas de madera. Excelente rentabilidad.',
    propertyType: 'apartamento',
    operationType: 'alquiler',
    price: 1200,
    address: 'Plaza Mayor 8, 2º',
    city: 'Barcelona',
    bedrooms: 1,
    bathrooms: 1,
    area: 75,
    amenities: JSON.stringify(['ascensor', 'aire_acondicionado', 'amueblado']),
    images: JSON.stringify([
      'https://placehold.co/800x600/f59e0b/ffffff?text=Loft+Centro',
      'https://placehold.co/800x600/f59e0b/ffffff?text=Cocina',
    ]),
  },
  {
    title: 'Local comercial en zona de alto tránsito peatonal',
    description:
      'Excelente local comercial de 150m² en una de las calles más transitadas de la ciudad. Ideal para retail, hostelería o servicios. Cuenta con dos escaparates amplios, almacén trasero y baño adaptado. Instalaciones eléctricas y de climatización actualizadas. Contrato de larga duración disponible.',
    propertyType: 'local',
    operationType: 'alquiler',
    price: 3500,
    address: 'Calle Gran Vía 234',
    city: 'Madrid',
    bedrooms: 0,
    bathrooms: 1,
    area: 150,
    amenities: JSON.stringify(['aire_acondicionado']),
    images: JSON.stringify(['https://placehold.co/800x600/8b5cf6/ffffff?text=Local+Comercial']),
  },
  {
    title: 'Terreno edificable con proyecto aprobado para 6 viviendas',
    description:
      'Parcela de 800m² en zona residencial consolidada con todos los servicios. Incluye proyecto arquitectónico aprobado para edificio de 6 viviendas de 2 y 3 dormitorios. Licencia de obras en trámite. Excelente oportunidad para promotores o inversores. Financiación disponible.',
    propertyType: 'terreno',
    operationType: 'venta',
    price: 320000,
    address: 'Avenida de la Constitución s/n',
    city: 'Sevilla',
    bedrooms: 0,
    bathrooms: 0,
    area: 800,
    amenities: JSON.stringify([]),
    images: JSON.stringify(['https://placehold.co/800x600/64748b/ffffff?text=Terreno+Edificable']),
  },
  {
    title: 'Oficina premium en torre empresarial con parking',
    description:
      'Oficina de 200m² en planta alta de prestigiosa torre de oficinas. Vistas panorámicas a la ciudad. Distribución flexible, actualmente con recepción, 4 despachos, sala de reuniones y office. Incluye 3 plazas de parking. Edificio con certificación LEED, seguridad, cafetería y auditorio.',
    propertyType: 'oficina',
    operationType: 'alquiler',
    price: 4500,
    address: 'Torre Empresarial Norte, Planta 15',
    city: 'Barcelona',
    bedrooms: 0,
    bathrooms: 2,
    area: 200,
    amenities: JSON.stringify(['seguridad', 'ascensor', 'aire_acondicionado', 'garage']),
    images: JSON.stringify([
      'https://placehold.co/800x600/0ea5e9/ffffff?text=Oficina+Premium',
      'https://placehold.co/800x600/0ea5e9/ffffff?text=Sala+Reuniones',
    ]),
  },
];

async function main(): Promise<void> {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiamos datos existentes
  await prisma.property.deleteMany();
  console.log('🗑️ Datos anteriores eliminados');

  // Insertamos los datos de ejemplo
  for (const property of sampleProperties) {
    await prisma.property.create({
      data: property,
    });
  }

  console.log(`✅ ${sampleProperties.length} propiedades creadas`);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
