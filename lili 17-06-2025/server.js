const express = require('express');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configuración de multer para manejo de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Crear directorio para archivos Excel si no existe
const excelDir = 'excel_files/';
if (!fs.existsSync(excelDir)) {
    fs.mkdirSync(excelDir, { recursive: true });
}

// Ruta para servir archivos estáticos (HTML)
app.use(express.static('.'));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API para guardar datos en Excel
app.post('/api/save-to-excel', async (req, res) => {
    try {
        const { name, age, image, department } = req.body;
        
        if (!name || !age || !image || !department) {
            return res.status(400).json({ 
                success: false, 
                message: 'Faltan datos requeridos' 
            });
        }

        // Crear nombre de archivo con timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `usuarios_${timestamp}.xlsx`;
        const filePath = path.join(excelDir, fileName);

        // Preparar datos para Excel
        const excelData = [
            {
                'Nombre': name,
                'Edad': age,
                'Departamento': department.name,
                'Capital': department.capital,
                'Población Departamento': department.population?.toLocaleString() || 'N/A',
                'Superficie (km²)': department.surface?.toLocaleString() || 'N/A',
                'Fecha de Registro': new Date().toLocaleString('es-ES'),
                'Imagen': image.substring(0, 50) + '...' // Solo mostrar parte de la imagen base64
            }
        ];

        // Crear workbook y worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // Ajustar ancho de columnas
        const columnWidths = [
            { wch: 25 }, // Nombre
            { wch: 10 }, // Edad
            { wch: 20 }, // Departamento
            { wch: 20 }, // Capital
            { wch: 20 }, // Población
            { wch: 15 }, // Superficie
            { wch: 25 }, // Fecha
            { wch: 50 }  // Imagen
        ];
        worksheet['!cols'] = columnWidths;

        // Agregar worksheet al workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');

        // Guardar archivo Excel
        XLSX.writeFile(workbook, filePath);

        res.json({
            success: true,
            message: 'Datos guardados en Excel exitosamente',
            fileName: fileName,
            filePath: filePath
        });

    } catch (error) {
        console.error('Error al guardar en Excel:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// API para guardar múltiples datos en Excel
app.post('/api/save-multiple-to-excel', async (req, res) => {
    try {
        const { users } = req.body;
        
        if (!users || !Array.isArray(users) || users.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'No hay datos para guardar' 
            });
        }

        // Crear nombre de archivo con timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `usuarios_multiple_${timestamp}.xlsx`;
        const filePath = path.join(excelDir, fileName);

        // Preparar datos para Excel
        const excelData = users.map(user => ({
            'Nombre': user.name,
            'Edad': user.age,
            'Departamento': user.department.name,
            'Capital': user.department.capital,
            'Población Departamento': user.department.population?.toLocaleString() || 'N/A',
            'Superficie (km²)': user.department.surface?.toLocaleString() || 'N/A',
            'Fecha de Registro': new Date().toLocaleString('es-ES'),
            'Imagen': user.image.substring(0, 50) + '...'
        }));

        // Crear workbook y worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // Ajustar ancho de columnas
        const columnWidths = [
            { wch: 25 }, // Nombre
            { wch: 10 }, // Edad
            { wch: 20 }, // Departamento
            { wch: 20 }, // Capital
            { wch: 20 }, // Población
            { wch: 15 }, // Superficie
            { wch: 25 }, // Fecha
            { wch: 50 }  // Imagen
        ];
        worksheet['!cols'] = columnWidths;

        // Agregar worksheet al workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');

        // Guardar archivo Excel
        XLSX.writeFile(workbook, filePath);

        res.json({
            success: true,
            message: `${users.length} usuarios guardados en Excel exitosamente`,
            fileName: fileName,
            filePath: filePath
        });

    } catch (error) {
        console.error('Error al guardar múltiples datos en Excel:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// API para descargar archivo Excel
app.get('/api/download/:fileName', (req, res) => {
    try {
        const fileName = req.params.fileName;
        const filePath = path.join(excelDir, fileName);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'Archivo no encontrado'
            });
        }

        res.download(filePath, fileName);
    } catch (error) {
        console.error('Error al descargar archivo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al descargar archivo'
        });
    }
});

// API para listar archivos Excel disponibles
app.get('/api/files', (req, res) => {
    try {
        const files = fs.readdirSync(excelDir)
            .filter(file => file.endsWith('.xlsx'))
            .map(file => ({
                name: file,
                path: path.join(excelDir, file),
                size: fs.statSync(path.join(excelDir, file)).size,
                created: fs.statSync(path.join(excelDir, file)).birthtime
            }));

        res.json({
            success: true,
            files: files
        });
    } catch (error) {
        console.error('Error al listar archivos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al listar archivos'
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📁 Los archivos Excel se guardarán en: ${excelDir}`);
}); 