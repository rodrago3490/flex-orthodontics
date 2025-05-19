# Proyecto: Flex ORTHODONTICS - Plan de Pagos

## Descripción

Flex ORTHODONTICS es una aplicación web moderna para la gestión de planes de pago en tratamientos de ortodoncia. Permite a los usuarios definir el costo total y la duración del tratamiento, seleccionar un pago inicial (Down Payment) y calcular mensualidades de forma interactiva y visual.

### Funcionalidades principales

- **Selección flexible de Down Payment**:
  Los usuarios pueden elegir un pago inicial entre $500 y hasta el 35% del costo total del tratamiento, con validación automática.
- **Cálculo dinámico de mensualidades**:
  La mensualidad estándar se calcula como `(Total del pago - Down Payment) / Meses del tratamiento`.
  Incluye una opción de "Mensualidad Extendida": `(Total del pago - Extended Down Payment) / (Meses del tratamiento + 6)`.
- **Interfaz interactiva y visual**:
  Sliders y campos editables permiten ajustar tanto el Down Payment como la mensualidad, sincronizándose automáticamente.
- **Validación y persistencia de datos**:
  El formulario inicial valida los datos y los guarda en localStorage para su uso en la vista de pagos.
- **Sincronización avanzada**:
  Los sliders y campos editables están sincronizados en ambas direcciones, permitiendo modificar valores desde cualquier control.
- **Logs y depuración**:
  El sistema registra eventos y errores tanto en consola como en archivos de log para facilitar la depuración.
- **Optimización para producción**:
  Soporte para archivos minificados, compresión y caché en despliegue productivo.
- **Gestión de logs avanzada**:
  Los logs de la aplicación y del servidor se almacenan en la carpeta `logs/` y se gestionan con PM2 si se desea.

## Estructura del Proyecto

```plaintext
Flex ORTHODONTICS/
├── src/
│   ├── css/
│   │   ├── form.css
│   │   └── style.css
│   ├── images/
│   │   ├── icon_web.ico
│   │   ├── logo_index.png
│   │   └── logo_sin_fondo.ico
│   ├── js/
│   │   ├── form.js
│   │   └── payment_view.js
│   ├── pages/
│   │   ├── home.html
│   │   └── payment_view.html
├── logs/
│   └── app.log
├── server.js
├── ecosystem.config.js
├── package.json
├── package-lock.json
└── README.md
```

## Instalación y Ejecución

1. **Clonar el repositorio**:

   ```powershell
   git clone <URL_DEL_REPOSITORIO>
   cd flex-orthodontics
   ```

2. **Instalar dependencias**:

   Asegúrate de tener Node.js instalado. Luego ejecuta:

   ```powershell
   npm install
   ```

3. **Desarrollo local**:

   ```powershell
   npm run dev
   ```

   O bien:

   ```powershell
   node server.js
   ```

4. **Producción (opcional)**:

   - Minifica los archivos CSS y JS:

     ```powershell
     npm run build
     ```

   - Ejecuta con PM2 (requiere instalación global de pm2):

     ```powershell
     pm2 start ecosystem.config.js
     ```

5. **Abrir en el navegador**:

   Accede a la aplicación en `http://localhost:3000`.

## Archivos y Carpetas principales

- **`src/pages/home.html`**: Formulario inicial para ingresar el costo total y meses del tratamiento.
- **`src/pages/payment_view.html`**: Vista interactiva para ajustar Down Payment y mensualidades.
- **`src/js/form.js`**: Lógica de validación, guardado y navegación del formulario inicial.
- **`src/js/payment_view.js`**: Sincronización avanzada de sliders, cálculos y validaciones en la vista de pagos.
- **`src/css/form.css`**: Estilos del formulario inicial.
- **`src/css/style.css`**: Estilos de la vista de pagos y componentes visuales.
- **`server.js`**: Servidor Express, gestión de rutas, logs y archivos estáticos.
- **`ecosystem.config.js`**: Configuración para despliegue con PM2.
- **`logs/`**: Carpeta de logs de la aplicación y del servidor.

## Logs

- Los registros de la aplicación se almacenan en `logs/app.log`.
- Si se usa PM2, los logs adicionales se guardan en la carpeta `logs/`.

## Contribución

1. Haz un fork del repositorio.

2. Crea una rama para tu funcionalidad o corrección de errores:

   ```powershell
   git checkout -b mi-nueva-funcionalidad
   ```

3. Realiza tus cambios y haz un commit:

   ```powershell
   git commit -m "Descripción de los cambios"
   ```

4. Envía un pull request.

---

**Contacto:** Para dudas o sugerencias, abre un issue o contacta al administrador del repositorio.
