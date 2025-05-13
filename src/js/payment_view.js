// Estilos para los logs (puedes tener un archivo JS común para estilos si prefieres)
const logStyles = {
    success: 'color: green; font-weight: bold;',
    error: 'color: red; font-weight: bold;',
    warn: 'color: orange; font-weight: bold;',
    info: 'color: blue;',
    label: 'color: gray; font-weight: bold;',
    value: 'color: black;' // Estilo para los valores mostrados
};

document.addEventListener('DOMContentLoaded', () => {
    console.group('%c[PaymentView] Inicialización', logStyles.info); // Grupo para toda la inicialización

    // Obtener los datos de localStorage
    const totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;
    const treatmentMonths = parseInt(localStorage.getItem('treatmentMonths')) || 0;

    console.log('%cDatos recuperados de localStorage:', logStyles.label);
    console.log(`   %cPrecio Total:`, logStyles.label, `$${totalPrice}`);
    console.log(`   %cMeses Tratamiento:`, logStyles.label, treatmentMonths);

    // Validar datos iniciales
    if (!totalPrice || !treatmentMonths || totalPrice <= 0 || treatmentMonths <= 0) {
        console.error('%cError: Datos inválidos o faltantes en localStorage.', logStyles.error, { totalPrice, treatmentMonths });
        alert('No se encontraron datos válidos del tratamiento. Volviendo al formulario inicial.');
        console.groupEnd(); // Cierra el grupo antes de redirigir
        window.location.href = '../home.html'; // Ajusta si home.html está en la raíz
        return;
    }

    // Calcular límites para el Down Payment
    const minDownPayment = 500;
    const maxDownPaymentPercentage = 0.35;
    const maxDownPayment = Math.max(minDownPayment, totalPrice * maxDownPaymentPercentage);

    console.log('%cLímites calculados para Down Payment:', logStyles.label);
    console.log(`   %cMínimo:`, logStyles.label, `$${minDownPayment}`);
    console.log(`   %cMáximo (35% o $500):`, logStyles.label, `$${maxDownPayment.toFixed(2)}`);


    // --- Referencias a los elementos del DOM ---
    const downPaymentSlider = document.getElementById('downPayment');
    const downPaymentValue = document.getElementById('downPaymentValue');
    const monthlyPaymentSlider = document.getElementById('monthlyPayment');
    const monthlyPaymentValue = document.getElementById('monthlyPaymentValue');
    const extendedDownPaymentSlider = document.getElementById('extendedDownPayment');
    const extendedDownPaymentValue = document.getElementById('extendedDownPaymentValue');
    const extendedMonthlyPaymentSlider = document.getElementById('extendedMonthlyPayment');
    const extendedMonthlyPaymentValue = document.getElementById('extendedMonthlyPaymentValue');
    const monthlyPaymentMonthsLabel = document.getElementById('monthlyPaymentMonthsLabel');
    const extendedMonthlyPaymentMonthsLabel = document.getElementById('extendedMonthlyPaymentMonthsLabel');

    // Comprobar si todos los elementos existen (opcional pero bueno para depurar)
    if (!downPaymentSlider || !downPaymentValue || !monthlyPaymentSlider || !monthlyPaymentValue ||
        !extendedDownPaymentSlider || !extendedDownPaymentValue || !extendedMonthlyPaymentSlider || !extendedMonthlyPaymentValue ||
        !monthlyPaymentMonthsLabel || !extendedMonthlyPaymentMonthsLabel) {
         console.error('%cError Crítico: No se encontraron todos los elementos slider/valor/label en el DOM.', logStyles.error);
         console.groupEnd();
         return; // Detener si faltan elementos clave
    } else {
        console.log('%cElementos del DOM encontrados correctamente.', logStyles.success);
    }




    // --- Función para actualizar el fondo del slider ---
    const updateSliderBackground = (slider) => {
        // ... (código sin cambios)
         if (!slider || slider.min === slider.max) {
             slider.style.setProperty('--value', '0%');
             return;
         }
         const value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
         slider.style.setProperty('--value', `${value}%`);
    };

    // --- Función principal para actualizar todos los valores y sliders ---
    const updateValues = (updatedSliderId = null) => {
        // console.groupCollapsed(`%c[PaymentView] Actualizando valores (Iniciado por: ${updatedSliderId || 'Inicial'})`, logStyles.info); // Grupo colapsado para no saturar
        // Descomenta la línea anterior si quieres logs detallados en cada update

        let currentDownPayment = parseFloat(downPaymentSlider.value);
        let currentExtendedDownPayment = parseFloat(extendedDownPaymentSlider.value);

        // --- Lógica de Sincronización Inversa ---
        if (updatedSliderId === 'monthlyPayment') {
            const currentMonthlyPayment = parseFloat(monthlyPaymentSlider.value);
            currentDownPayment = totalPrice - (currentMonthlyPayment * treatmentMonths);
            currentDownPayment = Math.max(minDownPayment, Math.min(currentDownPayment, maxDownPayment));
            downPaymentSlider.value = currentDownPayment;
            // console.log(`   Mensualidad movida a ${currentMonthlyPayment}, Down Payment ajustado a ${currentDownPayment.toFixed(2)}`);
        }
        if (updatedSliderId === 'extendedMonthlyPayment') {
           const currentExtendedMonthlyPayment = parseFloat(extendedMonthlyPaymentSlider.value);
            currentExtendedDownPayment = totalPrice - (currentExtendedMonthlyPayment * (treatmentMonths + 6));
            currentExtendedDownPayment = Math.max(minDownPayment, Math.min(currentExtendedDownPayment, maxDownPayment));
            extendedDownPaymentSlider.value = currentExtendedDownPayment;
             // console.log(`   Mensualidad Ext. movida a ${currentExtendedMonthlyPayment}, Down Payment Ext. ajustado a ${currentExtendedDownPayment.toFixed(2)}`);
        }


        // --- Calcular Mensualidades ---
        const remainingBalance = totalPrice - currentDownPayment;
        const monthlyPayment = treatmentMonths > 0 ? remainingBalance / treatmentMonths : 0;
        const extendedRemainingBalance = totalPrice - currentExtendedDownPayment;
        const extendedMonths = treatmentMonths + 6;
        const extendedMonthlyPayment = extendedMonths > 0 ? extendedRemainingBalance / extendedMonths : 0;

        // --- Actualizar etiquetas de meses ---
        if (monthlyPaymentMonthsLabel) {
            monthlyPaymentMonthsLabel.textContent = `(${treatmentMonths} meses)`;
        }
        if (extendedMonthlyPaymentMonthsLabel) {
            extendedMonthlyPaymentMonthsLabel.textContent = `(${extendedMonths} meses)`;
        }

        // --- Actualizar los rangos (min/max) de los sliders de mensualidades ---
        const maxPossibleMonthly = treatmentMonths > 0 ? (totalPrice - minDownPayment) / treatmentMonths : 0;
        const minPossibleMonthly = treatmentMonths > 0 ? (totalPrice - maxDownPayment) / treatmentMonths : 0;
        monthlyPaymentSlider.min = Math.max(0, Math.floor(minPossibleMonthly));
        monthlyPaymentSlider.max = Math.ceil(maxPossibleMonthly);

        const maxPossibleExtendedMonthly = extendedMonths > 0 ? (totalPrice - minDownPayment) / extendedMonths : 0;
        const minPossibleExtendedMonthly = extendedMonths > 0 ? (totalPrice - maxDownPayment) / extendedMonths : 0;
        extendedMonthlyPaymentSlider.min = Math.max(0, Math.floor(minPossibleExtendedMonthly));
        extendedMonthlyPaymentSlider.max = Math.ceil(maxPossibleExtendedMonthly);

        // --- Actualizar los valores en pantalla ---
        downPaymentValue.textContent = `$${currentDownPayment.toFixed(2)}`;
        monthlyPaymentValue.textContent = `$${monthlyPayment.toFixed(2)}`;
        extendedDownPaymentValue.textContent = `$${currentExtendedDownPayment.toFixed(2)}`;
        extendedMonthlyPaymentValue.textContent = `$${extendedMonthlyPayment.toFixed(2)}`;

         // console.log('%cValores Actualizados:', logStyles.label);
         // console.log(`   DP: ${downPaymentValue.textContent}, Mensual: ${monthlyPaymentValue.textContent} (Rango Slider: ${monthlyPaymentSlider.min}-${monthlyPaymentSlider.max})`);
         // console.log(`   DP Ext: ${extendedDownPaymentValue.textContent}, Mensual Ext: ${extendedMonthlyPaymentValue.textContent} (Rango Slider: ${extendedMonthlyPaymentSlider.min}-${extendedMonthlyPaymentSlider.max})`);


        // --- Actualizar el valor de los sliders de mensualidad ---
         if (updatedSliderId !== 'monthlyPayment' && monthlyPaymentSlider.max > monthlyPaymentSlider.min) {
             monthlyPaymentSlider.value = Math.max(monthlyPaymentSlider.min, Math.min(monthlyPayment, monthlyPaymentSlider.max));
         }
         if (updatedSliderId !== 'extendedMonthlyPayment' && extendedMonthlyPaymentSlider.max > extendedMonthlyPaymentSlider.min) {
             extendedMonthlyPaymentSlider.value = Math.max(extendedMonthlyPaymentSlider.min, Math.min(extendedMonthlyPayment, extendedMonthlyPaymentSlider.max));
         }


        // --- Actualizar el fondo de todos los sliders ---
        updateSliderBackground(downPaymentSlider);
        updateSliderBackground(monthlyPaymentSlider);
        updateSliderBackground(extendedDownPaymentSlider);
        updateSliderBackground(extendedMonthlyPaymentSlider);

        // console.groupEnd(); // Cierra el grupo de actualización
    };

    // --- Configuración Inicial ---
    console.log('%cConfigurando valores iniciales de sliders...', logStyles.info);
    downPaymentSlider.min = minDownPayment;
    downPaymentSlider.max = maxDownPayment;
    downPaymentSlider.value = minDownPayment;

    extendedDownPaymentSlider.min = minDownPayment;
    extendedDownPaymentSlider.max = maxDownPayment;
    extendedDownPaymentSlider.value = minDownPayment;

    updateValues(); // Llamada inicial para configurar todo

    // --- Event Listeners ---
    downPaymentSlider.addEventListener('input', () => updateValues('downPayment'));
    monthlyPaymentSlider.addEventListener('input', () => updateValues('monthlyPayment'));
    extendedDownPaymentSlider.addEventListener('input', () => updateValues('extendedDownPayment'));
    extendedMonthlyPaymentSlider.addEventListener('input', () => updateValues('extendedMonthlyPayment'));
    console.log('%cListeners añadidos a los sliders.', logStyles.success);


    console.log('%c[PaymentView] Inicialización completada.', logStyles.success);
    console.groupEnd(); // Cierra el grupo principal de inicialización

});