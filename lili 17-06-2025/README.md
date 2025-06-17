# Formulario con API Excel y Departamentos de Colombia

Un formulario web que captura datos de usuarios (imagen, nombre, edad, departamento) y los exporta a archivos Excel mediante una API REST. Integra la [API de Departamentos de Colombia](https://api-colombia.com/api/v1/Department) para proporcionar información detallada de los 32 departamentos del país.

## Características

- 📝 Formulario de registro con validación
- 📷 Carga y previsualización de imágenes
- 🗺️ Selección de departamentos de Colombia con datos oficiales
- 💾 Almacenamiento local de datos
- 📊 Exportación a Excel individual y masiva
- 📁 Gestión de archivos Excel generados
- 🎨 Interfaz moderna con fondo SVG personalizado
- 📱 Diseño responsive
- 🇨🇴 Integración con API oficial de Colombia

## Tecnologías Utilizadas

### Frontend
- HTML5
- CSS3 (con efectos glassmorphism)
- JavaScript (ES6+)
- Fetch API

### Backend
- Node.js
- Express.js
- Multer (manejo de archivos)
- XLSX (generación de archivos Excel)
- CORS

### APIs Externas
- [API Colombia](https://api-colombia.com/api/v1/Department) - Información oficial de departamentos

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm (incluido con Node.js)
- Conexión a internet (para cargar departamentos)

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   # Si tienes git
   git clone <url-del-repositorio>
   
   # O simplemente descarga los archivos
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor**
   ```bash
   npm start
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

### Scripts Disponibles

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon

## Estructura del Proyecto

```
proyecto/
├── index.html          # Formulario principal
├── server.js           # Servidor Node.js
├── package.json        # Dependencias y scripts
├── README.md          # Este archivo
├── excel_files/       # Directorio de archivos Excel (se crea automáticamente)
└── uploads/           # Directorio de archivos subidos (se crea automáticamente)
```

## API Endpoints

### POST /api/save-to-excel
Guarda un usuario individual en Excel.

**Body:**
```json
{
  "name": "Nombre del usuario",
  "age": 25,
  "image": "data:image/jpeg;base64,...",
  "department": {
    "id": 5,
    "name": "Bogotá",
    "capital": "Bogotá D.C.",
    "population": 8906342,
    "surface": 1139,
    "region": 5
  }
}
```

### POST /api/save-multiple-to-excel
Guarda múltiples usuarios en Excel.

**Body:**
```json
{
  "users": [
    {
      "name": "Usuario 1",
      "age": 25,
      "image": "data:image/jpeg;base64,...",
      "department": {
        "id": 31,
        "name": "Valle del Cauca",
        "capital": "Cali",
        "population": 4589278,
        "surface": 22140,
        "region": 2
      }
    }
  ]
}
```

### GET /api/files
Lista todos los archivos Excel disponibles.

### GET /api/download/:fileName
Descarga un archivo Excel específico.

## Funcionalidades del Formulario

### Captura de Datos
- **Imagen**: Selección de archivo con previsualización
- **Nombre**: Campo de texto obligatorio
- **Edad**: Campo numérico con validación (1-120 años)
- **Departamento**: Select con los 32 departamentos de Colombia

### Información de Departamentos
Cada departamento incluye:
- Nombre del departamento
- Capital
- Población
- Superficie en km²
- Región geográfica

### Almacenamiento
- Los datos se guardan temporalmente en el navegador
- Se muestran en tarjetas visuales con información del departamento
- Se pueden limpiar todos los datos

### Exportación
- **Exportar a Excel**: Guarda el último usuario registrado
- **Exportar Todos**: Guarda todos los usuarios en un solo archivo
- Los archivos se guardan con timestamp único
- Se pueden descargar desde la interfaz

## Formato del Archivo Excel

Los archivos Excel generados incluyen:

| Columna | Descripción |
|---------|-------------|
| Nombre | Nombre completo del usuario |
| Edad | Edad del usuario |
| Departamento | Nombre del departamento |
| Capital | Capital del departamento |
| Población Departamento | Población del departamento |
| Superficie (km²) | Superficie del departamento |
| Fecha de Registro | Fecha y hora del registro |
| Imagen | Referencia a la imagen (base64 truncado) |

## Departamentos de Colombia Incluidos

El formulario incluye los 32 departamentos de Colombia con información oficial:

- **Región Caribe**: Atlántico, Bolívar, Cesar, Córdoba, La Guajira, Magdalena, San Andrés y Providencia, Sucre
- **Región Andina**: Antioquia, Boyacá, Caldas, Caquetá, Casanare, Cundinamarca, Huila, Norte de Santander, Quindío, Risaralda, Santander, Tolima
- **Región Pacífica**: Chocó, Nariño, Valle del Cauca
- **Región Orinoquía**: Arauca, Meta, Vichada
- **Región Amazonía**: Amazonas, Caquetá, Guainía, Guaviare, Putumayo, Vaupés
- **Distrito Capital**: Bogotá

## Personalización

### Cambiar el Puerto del Servidor
Edita la variable `PORT` en `server.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

### Modificar el Fondo SVG
El fondo SVG está definido en el CSS del archivo `index.html`. Puedes reemplazar la URL del `background-image` con tu propio SVG.

### Cambiar el Estilo
Los estilos están en el `<style>` del archivo `index.html`. Puedes modificar colores, tamaños y efectos según tus necesidades.

## Solución de Problemas

### Error de CORS
Si tienes problemas de CORS, verifica que el servidor esté corriendo en el puerto correcto y que la URL en el frontend coincida.

### Error de Conexión
- Verifica que el servidor esté corriendo
- Revisa la consola del navegador para errores
- Asegúrate de que el puerto 3000 esté disponible

### Archivos Excel no se Generan
- Verifica que el directorio `excel_files/` tenga permisos de escritura
- Revisa los logs del servidor para errores específicos

### Departamentos no se Cargan
- Verifica tu conexión a internet
- La API de Colombia debe estar disponible
- Revisa la consola del navegador para errores de red

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Soporte

Si tienes alguna pregunta o problema, puedes:
- Abrir un issue en el repositorio
- Contactar al desarrollador
- Revisar la documentación de las librerías utilizadas
- Consultar la [documentación de la API de Colombia](https://api-colombia.com/) 