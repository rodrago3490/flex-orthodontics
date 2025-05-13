# Proyecto: Flex ORTHODONTICS - Plan de Pagos

## Descripción

Este proyecto es una aplicación web diseñada para gestionar planes de pago para tratamientos de ortodoncia. Permite a los usuarios seleccionar un pago inicial (Down Payment) y calcular las mensualidades correspondientes en función del costo total del tratamiento y la duración del mismo.

### Funcionalidades principales

- **Selección de Down Payment**:
  Los usuarios pueden seleccionar un pago inicial mínimo de $500 hasta un máximo del 35% del costo total del tratamiento.
- **Cálculo de Mensualidades**:
  La mensualidad se calcula automáticamente como `(Total del pago - Down Payment) / Meses del tratamiento`.
  También se incluye una opción de "Mensualidad Extendida", que calcula la mensualidad como `(Total del pago - Extended Down Payment) / (Meses del tratamiento + 6)`.
- **Interfaz interactiva**:
  Los sliders permiten ajustar dinámicamente los valores de Down Payment y Mensualidad, sincronizándose automáticamente.
- **Validación de datos**:
  Los datos del tratamiento (costo total y meses) se obtienen del formulario inicial y se validan antes de cargar la página de cálculo.

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
├── server.js
├── logs/
│   └── app.log
├── package.json
└── README.md
```

## Instalación

Sigue estos pasos para instalar y ejecutar el proyecto:

1. **Clonar el repositorio**:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd Flex-ORTHODONTICS
   ```

2. **Instalar dependencias**:

   Asegúrate de tener Node.js instalado. Luego, ejecuta:

   ```bash
   npm install
   ```

3. **Iniciar el servidor**:

   Ejecuta el siguiente comando para iniciar el servidor:

   ```bash
   node server.js
   ```

4. **Abrir en el navegador**:

   Accede a la aplicación en `http://localhost:3000` (o el puerto configurado en `server.js`).

## Archivos principales

- **`home.html`**:
  Página inicial donde los usuarios ingresan el costo total del tratamiento y la duración en meses.
- **`payment_view.html`**:
  Página donde los usuarios pueden ajustar el Down Payment y las mensualidades.
- **`payment_view.js`**:
  Contiene la lógica para sincronizar los sliders y calcular los valores dinámicamente.
- **`form.js`**:
  Maneja la validación y envío de datos desde el formulario inicial.

## Logs

Los registros de la aplicación se almacenan en el archivo `logs/app.log` para facilitar la depuración.

## Contribución

Si deseas contribuir al proyecto:

1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad o corrección de errores:

   ```bash
   git checkout -b mi-nueva-funcionalidad
   ```

3. Realiza tus cambios y haz un commit:

   ```bash
   git commit -m "Descripción de los cambios"
   ```

4. Envía un pull request.
