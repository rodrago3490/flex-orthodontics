const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'src')));

app.use(morgan('combined'))

app.set('trust proxy', 1);

// Verificar si la conexión es HTTPS y redirigir si no lo es

/* 
app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
});
*/

// Middleware para registrar logs detallados
app.use((req, res, next) => {
    const start = Date.now(); 
    res.on('finish', () => {
        const duration = Date.now() - start;
        const log = `${new Date().toISOString()} - ${req.method} ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms\n`;
        fs.appendFile(path.join(__dirname, 'logs', 'app.log'), log, (err) => {
            if (err) console.error('Error al escribir en el archivo de logs:', err);
        });
        console.log(log.trim()); 
    });
    next();
});

// Middleware para servir archivos minificados en producción
if (process.env.NODE_ENV === 'production') {
    app.use('/css', express.static(path.join(__dirname, 'src/css/style.min.css')));
    app.use('/js', express.static(path.join(__dirname, 'src/js/payment_view.min.js')));
}

// Configuración de caché y compresión para producción
if (process.env.NODE_ENV === 'production') {
    const compression = require('compression');
    app.use(compression());

    app.use((req, res, next) => {
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache de un año
        next();
    });
}

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/home.html'));
});

// Ruta para la vista de pagos
app.get('/payment_view', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/payment_view.html'));
});

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor iniciado en http://0.0.0.0:${PORT}`);
    console.log(`Server logs are being written to logs/app.log`);
});