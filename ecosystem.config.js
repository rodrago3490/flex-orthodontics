module.exports = {
  apps: [
    {
      name: 'flex-app',
      script: 'server.js',
      exec_mode: 'cluster', // Modo cluster para balanceo de carga
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      log_file: 'logs/pm2_combined.log', // Archivo combinado de logs
      out_file: 'logs/pm2_out.log', // Logs de salida estándar
      error_file: 'logs/pm2_error.log', // Logs de errores
      time: true // Agrega timestamp a los logs
    }
  ]
};
