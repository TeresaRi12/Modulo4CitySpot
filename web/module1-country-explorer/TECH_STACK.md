# Stack Tecnológico - Módulo 1

## Versiones de Dependencias (Diciembre 2025)

Este documento registra las versiones exactas de las dependencias utilizadas en este módulo, verificadas en diciembre de 2025.

---

## Dependencias de Desarrollo

| Paquete              | Versión  | Propósito                                      |
| -------------------- | -------- | ---------------------------------------------- |
| typescript           | 5.7.2    | Lenguaje con tipado estático                   |
| vite                 | 6.0.6    | Bundler y servidor de desarrollo               |
| tailwindcss          | 3.4.17   | Framework CSS con clases utilitarias           |
| postcss              | 8.5.1    | Procesador de CSS (requerido por Tailwind 4)   |
| autoprefixer         | 10.4.20  | Añade prefijos de navegador automáticamente    |
| eslint               | 9.17.0   | Linter para JavaScript/TypeScript              |
| typescript-eslint    | 8.18.2   | Plugin de ESLint para TypeScript               |
| prettier             | 3.4.2    | Formateador de código                          |
| @types/node          | 22.10.2  | Tipos de TypeScript para Node.js               |

---

## Notas sobre las versiones

### TypeScript 5.7.2
- **¿Por qué no 5.9?**: Usamos 5.7.2 que es la versión estable más reciente compatible con todas las herramientas del ecosistema Vite.
- Características utilizadas: strict mode, discriminated unions, template literal types

### Vite 6.0.6
- **¿Por qué no Vite 7?**: Vite 7 requiere Node.js 20.19+ y tiene cambios breaking. Usamos Vite 6 para máxima estabilidad.
- El proyecto está preparado para migrar a Vite 7/8 cuando sea necesario.

### Tailwind CSS 3.4.17
- Versión estable más reciente de la rama 3.x (diciembre 2024)
- Sintaxis tradicional con directivas `@tailwind base/components/utilities`
- Amplia compatibilidad con navegadores y herramientas del ecosistema
- **Nota**: Tailwind CSS 4.0 fue lanzado en enero 2025, pero usamos 3.4 por estabilidad

---

## Requisitos del Sistema

| Requisito          | Mínimo    | Recomendado |
| ------------------ | --------- | ----------- |
| Node.js            | 20.19+    | 22.12+      |
| npm                | 10.0+     | 10.9+       |

---

## API Externa

| Servicio           | Versión   | URL                              |
| ------------------ | --------- | -------------------------------- |
| REST Countries API | v3.1      | https://restcountries.com/v3.1   |

---

## Navegadores Soportados

Debido al uso de Tailwind CSS 4 y características modernas de CSS:

| Navegador          | Versión Mínima |
| ------------------ | -------------- |
| Chrome             | 111+           |
| Firefox            | 128+           |
| Safari             | 16.4+          |
| Edge               | 111+           |

---

## Verificación de Versiones

Para verificar las versiones instaladas:

```bash
# TypeScript
npx tsc --version

# Vite
npx vite --version

# Node.js
node --version

# npm
npm --version
```

---

## Actualización de Dependencias

Para actualizar a las últimas versiones:

```bash
# Ver dependencias desactualizadas
npm outdated

# Actualizar dependencias (con precaución)
npm update

# Verificar que todo funciona
npm run build
```

> **Importante**: Siempre verifica que el build funcione después de actualizar dependencias.
