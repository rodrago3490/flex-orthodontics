// src/js/payment_view.js

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
    console.group('%c[PaymentView] Inicialización', logStyles.info);

    const totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;
    const rawTreatmentMonths = localStorage.getItem('treatmentMonths');
    console.log(`   %cRaw 'treatmentMonths' from localStorage:`, logStyles.label, rawTreatmentMonths);
    const treatmentMonths = parseInt(rawTreatmentMonths) || 0;

    console.log('%cDatos recuperados de localStorage:', logStyles.label);
    console.log(`   %cPrecio Total:`, logStyles.label, `$${totalPrice.toFixed(2)}`);
    console.log(`   %cParsed 'treatmentMonths':`, logStyles.label, treatmentMonths);

    if (!totalPrice || totalPrice <= 0 || !treatmentMonths || treatmentMonths <= 0) {
        console.error('%cError: Datos inválidos o faltantes en localStorage.', logStyles.error, { totalPrice, treatmentMonths });
        alert('No se encontraron datos válidos del tratamiento. Volviendo al formulario inicial.');
        console.groupEnd();
        window.location.href = '../home.html';
        return;
    }

    const minDownPayment = 500;
    const maxDownPaymentPercentage = 0.35;
    // Asegúrate de que maxDownPayment no sea menor que minDownPayment, especialmente si totalPrice es bajo.
    const calculatedMaxDownPayment = totalPrice * maxDownPaymentPercentage;
    const maxDownPayment = Math.max(minDownPayment, calculatedMaxDownPayment);


    console.log('%cLímites calculados para Down Payment:', logStyles.label);
    console.log(`   %cMínimo:`, logStyles.label, `$${minDownPayment.toFixed(2)}`);
    console.log(`   %cMáximo (35% o $500, el que sea mayor):`, logStyles.label, `$${maxDownPayment.toFixed(2)}`);


    const downPaymentSlider = document.getElementById('downPayment');
    const downPaymentValueSpan = document.getElementById('downPaymentValue'); // Renombrado para claridad
    const monthlyPaymentSlider = document.getElementById('monthlyPayment');
    const monthlyPaymentValueSpan = document.getElementById('monthlyPaymentValue'); // Renombrado
    const extendedDownPaymentSlider = document.getElementById('extendedDownPayment');
    const extendedDownPaymentValueSpan = document.getElementById('extendedDownPaymentValue'); // Renombrado
    const extendedMonthlyPaymentSlider = document.getElementById('extendedMonthlyPayment');
    const extendedMonthlyPaymentValueSpan = document.getElementById('extendedMonthlyPaymentValue'); // Renombrado
    const monthlyPaymentMonthsLabel = document.getElementById('monthlyPaymentMonthsLabel');
    const extendedMonthlyPaymentMonthsLabel = document.getElementById('extendedMonthlyPaymentMonthsLabel');

    if (!downPaymentSlider || !downPaymentValueSpan || !monthlyPaymentSlider || !monthlyPaymentValueSpan ||
        !extendedDownPaymentSlider || !extendedDownPaymentValueSpan || !extendedMonthlyPaymentSlider || !extendedMonthlyPaymentValueSpan ||
        !monthlyPaymentMonthsLabel || !extendedMonthlyPaymentMonthsLabel) {
         console.error('%cError Crítico: No se encontraron todos los elementos slider/valor/label en el DOM.', logStyles.error);
         console.groupEnd();
         return;
    } else {
        console.log('%cElementos del DOM encontrados correctamente.', logStyles.success);
    }

    const updateSliderBackground = (slider) => {
         if (!slider || parseFloat(slider.min) >= parseFloat(slider.max)) { // Asegurar comparación numérica
             slider.style.setProperty('--value', '0%');
             return;
         }
         const value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
         slider.style.setProperty('--value', `${value}%`);
    };

    const updateValues = (updatedSliderId = null) => {
        console.log(`%c[PaymentView] updateValues CALLED. Source: ${updatedSliderId || 'Initial Call'}. treatmentMonths: ${treatmentMonths}`, logStyles.info);

        let currentDownPayment = parseFloat(downPaymentSlider.value);
        let currentExtendedDownPayment = parseFloat(extendedDownPaymentSlider.value);

        // Lógica de Sincronización Inversa
        if (updatedSliderId === 'monthlyPayment') {
            const currentMonthlyPayment = parseFloat(monthlyPaymentSlider.value);
            currentDownPayment = totalPrice - (currentMonthlyPayment * treatmentMonths);
            currentDownPayment = Math.max(minDownPayment, Math.min(currentDownPayment, maxDownPayment));
            downPaymentSlider.value = currentDownPayment.toFixed(2); // Asegurar que el valor del slider también se actualice
        } else if (updatedSliderId === 'extendedMonthlyPayment') {
           const currentExtendedMonthlyPayment = parseFloat(extendedMonthlyPaymentSlider.value);
            currentExtendedDownPayment = totalPrice - (currentExtendedMonthlyPayment * (treatmentMonths + 6));
            currentExtendedDownPayment = Math.max(minDownPayment, Math.min(currentExtendedDownPayment, maxDownPayment));
            extendedDownPaymentSlider.value = currentExtendedDownPayment.toFixed(2); // Asegurar que el valor del slider también se actualice
        }

        const remainingBalance = totalPrice - currentDownPayment;
        const monthlyPayment = treatmentMonths > 0 ? remainingBalance / treatmentMonths : 0;
        const extendedRemainingBalance = totalPrice - currentExtendedDownPayment;
        const extendedMonths = treatmentMonths + 6;
        const extendedMonthlyPayment = extendedMonths > 0 ? extendedRemainingBalance / extendedMonths : 0;

        if (monthlyPaymentMonthsLabel) {
            if (treatmentMonths && treatmentMonths > 0) {
                monthlyPaymentMonthsLabel.textContent = `(${treatmentMonths} months)`;
            } else {
                monthlyPaymentMonthsLabel.textContent = '';
            }
        }

        if (extendedMonthlyPaymentMonthsLabel) {
            const actualExtendedMonths = treatmentMonths + 6; // Recalcular por si treatmentMonths fuera 0 inicialmente
            if (treatmentMonths && treatmentMonths > 0 && actualExtendedMonths > 0) { // Validar treatmentMonths aquí también
                extendedMonthlyPaymentMonthsLabel.textContent = `(${actualExtendedMonths} months)`;
            } else {
                extendedMonthlyPaymentMonthsLabel.textContent = '';
            }
        }

        // Actualizar los rangos (min/max) de los sliders de mensualidades
        // Asegurarse que minPayment no sea negativo o NaN y que max sea mayor que min
        const minMonthlyPaymentSliderValue = treatmentMonths > 0 ? Math.max(0, (totalPrice - maxDownPayment) / treatmentMonths) : 0;
        const maxMonthlyPaymentSliderValue = treatmentMonths > 0 ? Math.max(0, (totalPrice - minDownPayment) / treatmentMonths) : 0;

        monthlyPaymentSlider.min = Math.floor(minMonthlyPaymentSliderValue);
        monthlyPaymentSlider.max = Math.ceil(maxMonthlyPaymentSliderValue);
        // Si min es mayor o igual a max, el slider se desactiva o no funciona bien.
        // Podrías añadir una lógica para manejar esto, ej. fijar un rango pequeño o deshabilitar.
        if (parseFloat(monthlyPaymentSlider.min) >= parseFloat(monthlyPaymentSlider.max)) {
            monthlyPaymentSlider.value = monthlyPaymentSlider.min; // o max
            // Considera deshabilitar el slider si el rango no es válido: monthlyPaymentSlider.disabled = true;
        }


        const minExtendedMonthlyPaymentSliderValue = extendedMonths > 0 ? Math.max(0, (totalPrice - maxDownPayment) / extendedMonths) : 0;
        const maxExtendedMonthlyPaymentSliderValue = extendedMonths > 0 ? Math.max(0, (totalPrice - minDownPayment) / extendedMonths) : 0;

        extendedMonthlyPaymentSlider.min = Math.floor(minExtendedMonthlyPaymentSliderValue);
        extendedMonthlyPaymentSlider.max = Math.ceil(maxExtendedMonthlyPaymentSliderValue);
        if (parseFloat(extendedMonthlyPaymentSlider.min) >= parseFloat(extendedMonthlyPaymentSlider.max)) {
            extendedMonthlyPaymentSlider.value = extendedMonthlyPaymentSlider.min; // o max
        }


        // Actualizar los valores en pantalla (spans)
        // Solo actualizar el span si no es el que originó el cambio (para evitar sobreescribir la edición manual)
        if (updatedSliderId !== 'downPayment' && document.activeElement !== downPaymentValueSpan) {
            downPaymentValueSpan.textContent = `$${currentDownPayment.toFixed(2)}`;
        }
        if (updatedSliderId !== 'monthlyPayment' && document.activeElement !== monthlyPaymentValueSpan) {
            // Si el slider de mensualidad se ajustó por el de downpayment, actualizamos su valor aquí
             if (updatedSliderId === 'downPayment' || updatedSliderId === null) {
                monthlyPaymentSlider.value = Math.max(parseFloat(monthlyPaymentSlider.min), Math.min(monthlyPayment, parseFloat(monthlyPaymentSlider.max))).toFixed(2);
            }
            monthlyPaymentValueSpan.textContent = `$${parseFloat(monthlyPaymentSlider.value).toFixed(2)}`; // Usar el valor del slider para el span
        }
         if (updatedSliderId !== 'extendedDownPayment' && document.activeElement !== extendedDownPaymentValueSpan) {
            extendedDownPaymentValueSpan.textContent = `$${currentExtendedDownPayment.toFixed(2)}`;
        }
        if (updatedSliderId !== 'extendedMonthlyPayment' && document.activeElement !== extendedMonthlyPaymentValueSpan) {
             if (updatedSliderId === 'extendedDownPayment' || updatedSliderId === null) {
                extendedMonthlyPaymentSlider.value = Math.max(parseFloat(extendedMonthlyPaymentSlider.min), Math.min(extendedMonthlyPayment, parseFloat(extendedMonthlyPaymentSlider.max))).toFixed(2);
            }
            extendedMonthlyPaymentValueSpan.textContent = `$${parseFloat(extendedMonthlyPaymentSlider.value).toFixed(2)}`;
        }


        // Actualizar el valor de los sliders de mensualidad SI NO FUERON LOS QUE INICIARON EL CAMBIO
        // y si su rango es válido.
        if (updatedSliderId !== 'monthlyPayment' && parseFloat(monthlyPaymentSlider.min) < parseFloat(monthlyPaymentSlider.max)) {
            const newMonthlyPaymentValue = Math.max(parseFloat(monthlyPaymentSlider.min), Math.min(monthlyPayment, parseFloat(monthlyPaymentSlider.max)));
            monthlyPaymentSlider.value = newMonthlyPaymentValue.toFixed(2);
        }
        if (updatedSliderId !== 'extendedMonthlyPayment' && parseFloat(extendedMonthlyPaymentSlider.min) < parseFloat(extendedMonthlyPaymentSlider.max)) {
            const newExtendedMonthlyPaymentValue = Math.max(parseFloat(extendedMonthlyPaymentSlider.min), Math.min(extendedMonthlyPayment, parseFloat(extendedMonthlyPaymentSlider.max)));
            extendedMonthlyPaymentSlider.value = newExtendedMonthlyPaymentValue.toFixed(2);
        }

        updateSliderBackground(downPaymentSlider);
        updateSliderBackground(monthlyPaymentSlider);
        updateSliderBackground(extendedDownPaymentSlider);
        updateSliderBackground(extendedMonthlyPaymentSlider);

        console.log(`   DP: ${downPaymentValueSpan.textContent}, Mensual: ${monthlyPaymentValueSpan.textContent} (Slider: ${monthlyPaymentSlider.min}-${monthlyPaymentSlider.max}, Value: ${monthlyPaymentSlider.value})`);
        console.log(`   DP Ext: ${extendedDownPaymentValueSpan.textContent}, Mensual Ext: ${extendedMonthlyPaymentValueSpan.textContent} (Slider: ${extendedMonthlyPaymentSlider.min}-${extendedMonthlyPaymentSlider.max}, Value: ${extendedMonthlyPaymentSlider.value})`);
    };

    console.log('%cConfigurando valores iniciales de sliders...', logStyles.info);
    downPaymentSlider.min = minDownPayment.toFixed(2);
    downPaymentSlider.max = maxDownPayment.toFixed(2);
    downPaymentSlider.value = minDownPayment.toFixed(2); // Iniciar con el mínimo

    extendedDownPaymentSlider.min = minDownPayment.toFixed(2);
    extendedDownPaymentSlider.max = maxDownPayment.toFixed(2);
    extendedDownPaymentSlider.value = minDownPayment.toFixed(2); // Iniciar con el mínimo

    // Llamada inicial para configurar todo.
    // Es importante que los sliders de mensualidad tengan un min/max válido antes de esta llamada.
    // updateValues() los calculará, pero una llamada previa puede ser necesaria si hay dependencias complejas.
    // Se puede llamar a updateValues() al final, después de configurar los listeners.

    // --- Event Listeners para SLIDERS ---
    downPaymentSlider.addEventListener('input', () => {
        downPaymentValueSpan.textContent = `$${parseFloat(downPaymentSlider.value).toFixed(2)}`;
        updateValues('downPayment');
    });
    monthlyPaymentSlider.addEventListener('input', () => {
        monthlyPaymentValueSpan.textContent = `$${parseFloat(monthlyPaymentSlider.value).toFixed(2)}`;
        updateValues('monthlyPayment');
    });
    extendedDownPaymentSlider.addEventListener('input', () => {
        extendedDownPaymentValueSpan.textContent = `$${parseFloat(extendedDownPaymentSlider.value).toFixed(2)}`;
        updateValues('extendedDownPayment');
    });
    extendedMonthlyPaymentSlider.addEventListener('input', () => {
        extendedMonthlyPaymentValueSpan.textContent = `$${parseFloat(extendedMonthlyPaymentSlider.value).toFixed(2)}`;
        updateValues('extendedMonthlyPayment');
    });
    console.log('%cListeners añadidos a los sliders.', logStyles.success);

    // --- Sincronizar el slider con el span editable ---
    const syncSliderWithEditableSpan = (slider, editableSpan) => {
        // Cuando el span editable pierde el foco (blur), valida y actualiza el slider
        editableSpan.addEventListener('blur', () => {
            let value = parseFloat(editableSpan.textContent.replace(/[^0-9.]/g, '')); // Limpiar no números y puntos
            const sliderMin = parseFloat(slider.min);
            const sliderMax = parseFloat(slider.max);

            if (isNaN(value)) { // Si no es un número válido
                value = sliderMin; // Volver al mínimo del slider
            }

            // Asegurar que el valor esté dentro del rango del slider
            value = Math.max(sliderMin, Math.min(value, sliderMax));

            slider.value = value.toFixed(2); // Actualizar el valor del slider
            editableSpan.textContent = `$${value.toFixed(2)}`; // Formatear y mostrar en el span

            console.log(`%c[EditableSpan Blur] Slider ${slider.id} actualizado a: ${slider.value} por span. Llamando a updateValues.`, logStyles.info);
            updateValues(slider.id); // Llamar a updateValues para recalcular todo basado en el cambio del slider
        });

        // Permitir solo números y un punto decimal en el span editable mientras se escribe
        editableSpan.addEventListener('input', (event) => {
            const originalValue = editableSpan.textContent;
            // Permite números, un punto decimal, y el símbolo $.
            // Se limpiará completamente en 'blur' si es necesario.
            let newValue = originalValue.replace(/[^0-9.$]/g, '');

            // Evitar múltiples puntos decimales o $ en lugares incorrectos (simplificado)
            if ((newValue.match(/\./g) || []).length > 1) {
                newValue = newValue.substring(0, newValue.lastIndexOf('.'));
            }
            if ((newValue.match(/\$/g) || []).length > 1) {
                newValue = '$' + newValue.replace(/\$/g, '');
            }
            if (newValue.indexOf('$') > 0) { // $ solo al inicio
                newValue = newValue.replace(/\$/g, '');
                newValue = '$' + newValue;
            }


            if (originalValue !== newValue) {
                editableSpan.textContent = newValue;
                // Mover el cursor al final podría ser necesario aquí si la edición se vuelve problemática
            }
        });

         // Opcional: Prevenir Enter en contenteditable y tratarlo como blur
        editableSpan.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevenir nueva línea
                editableSpan.blur();    // Disparar el evento blur para procesar
            }
        });
    };

    // Configurar sincronización para cada slider y su span editable
    syncSliderWithEditableSpan(downPaymentSlider, downPaymentValueSpan);
    syncSliderWithEditableSpan(monthlyPaymentSlider, monthlyPaymentValueSpan);
    syncSliderWithEditableSpan(extendedDownPaymentSlider, extendedDownPaymentValueSpan);
    syncSliderWithEditableSpan(extendedMonthlyPaymentSlider, extendedMonthlyPaymentValueSpan);

    updateValues(); // Llamada inicial para configurar todos los valores y sliders correctamente

    console.log('%c[PaymentView] Inicialización completada.', logStyles.success);
    console.groupEnd();
});