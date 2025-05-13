const form = document.getElementById('treatmentForm');

// Estilos para los logs
const logStyles = {
    success: 'color: green; font-weight: bold;',
    error: 'color: red; font-weight: bold;',
    info: 'color: blue;',
    label: 'color: gray; font-weight: bold;'
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.group('%c[Formulario]', logStyles.info); 

    try {
        const totalPriceInput = document.getElementById('totalPrice');
        const treatmentMonthsInput = document.getElementById('treatmentMonths');
        const totalPrice = totalPriceInput.value;
        const treatmentMonths = treatmentMonthsInput.value;

        if (!totalPrice || !treatmentMonths) {
            console.error('%cError: Campos vacíos detectados.', logStyles.error);
            alert('Por favor, completa todos los campos.');
            console.groupEnd(); 
            return;
        }

        // Guardar los datos en localStorage
        localStorage.setItem('totalPrice', totalPrice);
        localStorage.setItem('treatmentMonths', treatmentMonths);

        console.log('%cDatos guardados con éxito:', logStyles.success);
        console.log(`   %cPrecio Total:`, logStyles.label, totalPrice);
        console.log(`   %cMeses Tratamiento:`, logStyles.label, treatmentMonths);

        console.log('%cNavegando a la vista de pagos...', logStyles.info);
        // Redirigir a la página de payment_view 
        window.location.href = '../pages/payment_view.html';

    } catch (error) {
        console.error('%cError inesperado al procesar el formulario:', logStyles.error, error);
    } finally {
        console.groupEnd(); // Asegura cerrar el grupo incluso si hay error
    }
});

// Log inicial para saber que el script se cargó
console.log('%c[Formulario] Script cargado y listener añadido.', logStyles.info);