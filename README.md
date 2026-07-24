# Desafío Práctico 01 - E-commerce (React, TypeScript & Next.js)

## Enlaces del Proyecto

- **Sitio Web Publicado (Vercel):** https://desafio01-dps-blue.vercel.app
- **Video Demostrativo (Demo):** https://drive.google.com/file/d/1j44V3S9H4--kpT--j5LOZ0SIfqcWZTSy/view?usp=sharing
  

## Características Principales

1. **Autenticación:** Sistema integrado de Login y Registro de usuarios con validaciones de formulario.
2. **Catálogo Dinámico:** Visualización de un catálogo con 20 artículos tecnológicos (laptops, periféricos y componentes de hardware), fuertemente tipados con TypeScript mediante `interface`/`type`.
3. **Carrito de Compras Completo:**
   - Gestión de agregar, modificar cantidades (incrementar/decrementar) y eliminar productos.
   - **Persistencia de datos:** El carrito se mantiene intacto al refrescar la página gracias al uso de `localStorage`.
   - **UX Avanzada:** Mensajes de confirmación y alertas personalizadas utilizando librerías modernas de notificaciones.
4. **Optimización de Imágenes:** Posicionamiento estructurado a la izquierda del nombre e implementación obligatoria de `next/image` para el rendimiento visual.
5. **Generación de Factura:** Creación automatizada de factura electrónica tras completar la compra.
6. **Envío por Correo Electrónico:** Integración de rutas de API backend en Next.js con el servicio de **Resend** para el despacho de correos transaccionales.
7. **Diseño Responsivo (Mobile-First):** Interfaz adaptada a múltiples dispositivos con un diseño limpio y moderno.

---

##  Tecnologías Utilizadas

- **Frontend:** React, Next.js (App Router), TypeScript, Tailwind CSS.
- **Gestión de Estado & UI:** Hooks de React, `localStorage`, Sonner.
- **Backend / API Routes:** Endpoints nativos de Next.js.
- **Servicios Externos:** Resend (API de correo electrónico).
- **Despliegue Continuo:** Vercel conectado con el repositorio oficial de GitHub.

---

## Instrucciones de Instalación y Ejecución Local

Si deseas clonar y ejecutar este proyecto en tu entorno local, sigue estos pasos:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Grim22Reaper/desafio01-dps.git
   cd desafio01-dps
   ```

2. **Instalar las dependencias:**
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno:**
   Crea un archivo `.env.local` en la raíz del proyecto y añade tu llave de API de Resend:
   ```env
   RESEND_API_KEY=tu_clave_de_resend_aqui
   ```

4. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para visualizar la aplicación.

---

## Autor

- **Estudiante:** Pablo  Amilcar Mariona De La O
- **Carnet: MD221906
- **Asignatura:** Diseño y Programación de Software Multiplataforma 
- **Universidad Don Bosco (UDB)**
