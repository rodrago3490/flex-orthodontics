// src/js/payment_view.js

// Estilos para los logs de la consola para facilitar la depuración.
const logStyles = {
    success: 'color: green; font-weight: bold;',
    error: 'color: red; font-weight: bold;',
    warn: 'color: orange; font-weight: bold;',
    info: 'color: blue;',
    label: 'color: gray; font-weight: bold;',
    value: 'color: black;'
};

document.addEventListener('DOMContentLoaded', () => {
    console.group('%c[PaymentView] Inicialización del Módulo de Pagos', logStyles.info);

    // --- 1. RECUPERACIÓN Y VALIDACIÓN DE DATOS INICIALES ---
    const totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;
    const rawTreatmentMonths = localStorage.getItem('treatmentMonths');
    console.log(`   %cValor crudo de 'treatmentMonths' desde localStorage:`, logStyles.label, rawTreatmentMonths);
    const treatmentMonths = parseInt(rawTreatmentMonths) || 0;

    console.log('%cDatos recuperados de localStorage:', logStyles.label);
    console.log(`   %cPrecio Total:`, logStyles.label, `$${totalPrice.toFixed(2)}`);
    console.log(`   %cMeses de Tratamiento (parseado):`, logStyles.label, treatmentMonths);

    if (!totalPrice || totalPrice <= 0 || !treatmentMonths || treatmentMonths <= 0) {
        console.error('%cError: Datos de tratamiento inválidos o faltantes en localStorage.', logStyles.error, { totalPrice, treatmentMonths });
        alert('No se encontraron datos válidos del tratamiento. Por favor, inténtelo de nuevo desde el formulario inicial.');
        console.groupEnd();
        window.location.href = '../home.html';
        return;
    }

    // --- Actualizar los títulos con el precio total ---
    const totalPriceOption1Span = document.getElementById('totalPriceOption1');
    const totalPriceOption2Span = document.getElementById('totalPriceOption2');

    if (totalPriceOption1Span) {
        totalPriceOption1Span.textContent = `$${totalPrice.toFixed(2)}`;
    }
    if (totalPriceOption2Span) {
        totalPriceOption2Span.textContent = `$${totalPrice.toFixed(2)}`;
    }
    // --- Fin de la actualización de títulos ---


    // --- 2. DEFINICIÓN DE LÍMITES Y CONSTANTES PARA PAGOS ---
    const minDownPayment = 500;
    const maxDownPaymentPercentage = 0.35;
    const calculatedMaxDownPayment = totalPrice * maxDownPaymentPercentage;
    const maxDownPayment = Math.max(minDownPayment, calculatedMaxDownPayment);

    console.log('%cLímites calculados para el Enganche (Down Payment):', logStyles.label);
    console.log(`   %cMínimo Enganche Permitido:`, logStyles.label, `$${minDownPayment.toFixed(2)}`);
    console.log(`   %cMáximo Enganche Permitido (35% del total o ${minDownPayment}, el que sea mayor):`, logStyles.label, `$${maxDownPayment.toFixed(2)}`);

    // --- 3. REFERENCIAS A ELEMENTOS DEL DOM ---
    const downPaymentSlider = document.getElementById('downPayment');
    const downPaymentValueSpan = document.getElementById('downPaymentValue');
    const monthlyPaymentSlider = document.getElementById('monthlyPayment');
    const monthlyPaymentValueSpan = document.getElementById('monthlyPaymentValue');
    const extendedDownPaymentSlider = document.getElementById('extendedDownPayment');
    const extendedDownPaymentValueSpan = document.getElementById('extendedDownPaymentValue');
    const extendedMonthlyPaymentSlider = document.getElementById('extendedMonthlyPayment');
    const extendedMonthlyPaymentValueSpan = document.getElementById('extendedMonthlyPaymentValue');
    const monthlyPaymentMonthsLabel = document.getElementById('monthlyPaymentMonthsLabel');
    const extendedMonthlyPaymentMonthsLabel = document.getElementById('extendedMonthlyPaymentMonthsLabel');


    if (!downPaymentSlider || !downPaymentValueSpan || !monthlyPaymentSlider || !monthlyPaymentValueSpan ||
        !extendedDownPaymentSlider || !extendedDownPaymentValueSpan || !extendedMonthlyPaymentSlider || !extendedMonthlyPaymentValueSpan ||
        !monthlyPaymentMonthsLabel || !extendedMonthlyPaymentMonthsLabel) {
         console.error('%cError Crítico: Uno o más elementos del DOM (sliders, spans de valor, labels de meses) no fueron encontrados. Verifica los IDs en payment_view.html.', logStyles.error);
         console.groupEnd();
         return;
    } else {
        console.log('%cTodos los elementos del DOM requeridos fueron encontrados correctamente.', logStyles.success);
    }

    // --- 4. FUNCIONES AUXILIARES ---
    const updateSliderBackground = (slider) => {
         if (!slider || parseFloat(slider.min) >= parseFloat(slider.max)) {
             slider.style.setProperty('--value', '0%');
             return;
         }
         // Redondear el valor del slider a entero para que no tenga decimales
         slider.value = Math.round(slider.value);
         const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
         slider.style.setProperty('--value', `${percentage}%`);
    };

    const updateValues = (updatedSliderId = null) => {
        console.groupCollapsed(`%c[PaymentView] updateValues (Fuente: ${updatedSliderId || 'Inicial'})`, logStyles.info);
        console.log(`   Meses de tratamiento base: ${treatmentMonths}`);

        let currentDownPayment = parseFloat(downPaymentSlider.value);
        let currentExtendedDownPayment = parseFloat(extendedDownPaymentSlider.value);

        if (updatedSliderId === 'monthlyPayment') {
            const currentMonthlyPayment = parseFloat(monthlyPaymentSlider.value);
            currentDownPayment = totalPrice - (currentMonthlyPayment * treatmentMonths);
            currentDownPayment = Math.max(minDownPayment, Math.min(currentDownPayment, maxDownPayment));
            downPaymentSlider.value = currentDownPayment.toFixed(2);
            console.log(`   Mensualidad movida a ${currentMonthlyPayment.toFixed(2)}, Enganche ajustado a ${currentDownPayment.toFixed(2)}`);
        } else if (updatedSliderId === 'extendedMonthlyPayment') {
           const currentExtendedMonthlyPayment = parseFloat(extendedMonthlyPaymentSlider.value);
           const extendedMonthsTotal = treatmentMonths + 6;
            currentExtendedDownPayment = totalPrice - (currentExtendedMonthlyPayment * extendedMonthsTotal);
            currentExtendedDownPayment = Math.max(minDownPayment, Math.min(currentExtendedDownPayment, maxDownPayment));
            extendedDownPaymentSlider.value = currentExtendedDownPayment.toFixed(2);
            console.log(`   Mensualidad Extendida movida a ${currentExtendedMonthlyPayment.toFixed(2)}, Enganche Ext. ajustado a ${currentExtendedDownPayment.toFixed(2)}`);
        }

        const remainingBalance = totalPrice - currentDownPayment;
        const monthlyPayment = treatmentMonths > 0 ? remainingBalance / treatmentMonths : 0;

        const extendedRemainingBalance = totalPrice - currentExtendedDownPayment;
        const extendedMonths = treatmentMonths + 6;
        const extendedMonthlyPayment = extendedMonths > 0 ? extendedRemainingBalance / extendedMonths : 0;

        if (monthlyPaymentMonthsLabel) {
            monthlyPaymentMonthsLabel.textContent = (treatmentMonths > 0) ? `(${treatmentMonths} months)` : '';
        }
        if (extendedMonthlyPaymentMonthsLabel) {
            extendedMonthlyPaymentMonthsLabel.textContent = (treatmentMonths > 0 && extendedMonths > 0) ? `(${extendedMonths} months)` : '';
        }

        const minMonthlyPaymentSliderValue = treatmentMonths > 0 ? Math.max(0, (totalPrice - maxDownPayment) / treatmentMonths) : 0;
        const maxMonthlyPaymentSliderValue = treatmentMonths > 0 ? Math.max(0, (totalPrice - minDownPayment) / treatmentMonths) : 0;
        monthlyPaymentSlider.min = Math.floor(minMonthlyPaymentSliderValue).toFixed(2);
        monthlyPaymentSlider.max = Math.ceil(maxMonthlyPaymentSliderValue).toFixed(2);
        if (parseFloat(monthlyPaymentSlider.min) >= parseFloat(monthlyPaymentSlider.max)) {
            monthlyPaymentSlider.value = monthlyPaymentSlider.min;
        }

        const minExtendedMonthlyPaymentSliderValue = extendedMonths > 0 ? Math.max(0, (totalPrice - maxDownPayment) / extendedMonths) : 0;
        const maxExtendedMonthlyPaymentSliderValue = extendedMonths > 0 ? Math.max(0, (totalPrice - minDownPayment) / extendedMonths) : 0;
        extendedMonthlyPaymentSlider.min = Math.floor(minExtendedMonthlyPaymentSliderValue).toFixed(2);
        extendedMonthlyPaymentSlider.max = Math.ceil(maxExtendedMonthlyPaymentSliderValue).toFixed(2);
        if (parseFloat(extendedMonthlyPaymentSlider.min) >= parseFloat(extendedMonthlyPaymentSlider.max)) {
            extendedMonthlyPaymentSlider.value = extendedMonthlyPaymentSlider.min;
        }
        
        console.log(`   Rango Slider Mensual: ${monthlyPaymentSlider.min}-${monthlyPaymentSlider.max}`);
        console.log(`   Rango Slider Mensual Ext.: ${extendedMonthlyPaymentSlider.min}-${extendedMonthlyPaymentSlider.max}`);

        if (document.activeElement !== downPaymentValueSpan) {
            downPaymentValueSpan.textContent = `$${parseInt(downPaymentSlider.value)}`;
        }
        if (document.activeElement !== monthlyPaymentValueSpan) {
            if (updatedSliderId === 'downPayment' || updatedSliderId === null) {
                 const newMonthlyVal = Math.max(parseFloat(monthlyPaymentSlider.min), Math.min(monthlyPayment, parseFloat(monthlyPaymentSlider.max)));
                 monthlyPaymentSlider.value = Math.round(newMonthlyVal);
            }
            monthlyPaymentValueSpan.textContent = `$${parseInt(monthlyPaymentSlider.value)}`;
        }
        if (document.activeElement !== extendedDownPaymentValueSpan) {
            extendedDownPaymentValueSpan.textContent = `$${parseInt(extendedDownPaymentSlider.value)}`;
        }
        if (document.activeElement !== extendedMonthlyPaymentValueSpan) {
            if (updatedSliderId === 'extendedDownPayment' || updatedSliderId === null) {
                const newExtMonthlyVal = Math.max(parseFloat(extendedMonthlyPaymentSlider.min), Math.min(extendedMonthlyPayment, parseFloat(extendedMonthlyPaymentSlider.max)));
                extendedMonthlyPaymentSlider.value = Math.round(newExtMonthlyVal);
            }
            extendedMonthlyPaymentValueSpan.textContent = `$${parseInt(extendedMonthlyPaymentSlider.value)}`;
        }
        
        if (updatedSliderId !== 'monthlyPayment' && parseFloat(monthlyPaymentSlider.min) < parseFloat(monthlyPaymentSlider.max)) {
            const newMonthlyPaymentValue = Math.max(parseFloat(monthlyPaymentSlider.min), Math.min(monthlyPayment, parseFloat(monthlyPaymentSlider.max)));
            if (parseFloat(monthlyPaymentSlider.value) !== newMonthlyPaymentValue) {
                monthlyPaymentSlider.value = newMonthlyPaymentValue.toFixed(2);
            }
        }
        if (updatedSliderId !== 'extendedMonthlyPayment' && parseFloat(extendedMonthlyPaymentSlider.min) < parseFloat(extendedMonthlyPaymentSlider.max)) {
            const newExtendedMonthlyPaymentValue = Math.max(parseFloat(extendedMonthlyPaymentSlider.min), Math.min(extendedMonthlyPayment, parseFloat(extendedMonthlyPaymentSlider.max)));
            if (parseFloat(extendedMonthlyPaymentSlider.value) !== newExtendedMonthlyPaymentValue) {
                 extendedMonthlyPaymentSlider.value = newExtendedMonthlyPaymentValue.toFixed(2);
            }
        }

        updateSliderBackground(downPaymentSlider);
        updateSliderBackground(monthlyPaymentSlider);
        updateSliderBackground(extendedDownPaymentSlider);
        updateSliderBackground(extendedMonthlyPaymentSlider);

        console.log(`   Valores Finales: DP: $${currentDownPayment.toFixed(2)}, Mensual: $${monthlyPayment.toFixed(2)} (Slider: ${monthlyPaymentSlider.value})`);
        console.log(`                   DP Ext: $${currentExtendedDownPayment.toFixed(2)}, Mensual Ext: $${extendedMonthlyPayment.toFixed(2)} (Slider: ${extendedMonthlyPaymentSlider.value})`);
        console.groupEnd();
    };

    // --- 5. CONFIGURACIÓN INICIAL DE SLIDERS ---
    console.log('%cConfigurando valores y rangos iniciales de los sliders...', logStyles.info);
    downPaymentSlider.min = Math.round(minDownPayment);
    downPaymentSlider.max = Math.round(maxDownPayment);
    downPaymentSlider.value = Math.round(minDownPayment);

    extendedDownPaymentSlider.min = Math.round(minDownPayment);
    extendedDownPaymentSlider.max = Math.round(maxDownPayment);
    extendedDownPaymentSlider.value = Math.round(minDownPayment);

    // --- 6. EVENT LISTENERS PARA SLIDERS ---
    downPaymentSlider.addEventListener('input', () => {
        downPaymentSlider.value = Math.round(downPaymentSlider.value);
        downPaymentValueSpan.textContent = `$${parseInt(downPaymentSlider.value)}`;
        updateValues('downPayment');
    });
    monthlyPaymentSlider.addEventListener('input', () => {
        monthlyPaymentSlider.value = Math.round(monthlyPaymentSlider.value);
        monthlyPaymentValueSpan.textContent = `$${parseInt(monthlyPaymentSlider.value)}`;
        updateValues('monthlyPayment');
    });
    extendedDownPaymentSlider.addEventListener('input', () => {
        extendedDownPaymentSlider.value = Math.round(extendedDownPaymentSlider.value);
        extendedDownPaymentValueSpan.textContent = `$${parseInt(extendedDownPaymentSlider.value)}`;
        updateValues('extendedDownPayment');
    });
    extendedMonthlyPaymentSlider.addEventListener('input', () => {
        extendedMonthlyPaymentSlider.value = Math.round(extendedMonthlyPaymentSlider.value);
        extendedMonthlyPaymentValueSpan.textContent = `$${parseInt(extendedMonthlyPaymentSlider.value)}`;
        updateValues('extendedMonthlyPayment');
    });
    console.log('%cListeners de tipo "input" añadidos a todos los sliders.', logStyles.success);

    // --- 7. SINCRONIZACIÓN DE SPANS EDITABLES CON SLIDERS ---
    const syncSliderWithEditableSpan = (slider, editableSpan) => {
        editableSpan.addEventListener('blur', () => {
            let value = parseFloat(editableSpan.textContent.replace(/[^0-9.]/g, ''));
            const sliderMin = parseFloat(slider.min);
            const sliderMax = parseFloat(slider.max);

            if (isNaN(value)) {
                value = sliderMin;
            }
            value = Math.max(sliderMin, Math.min(value, sliderMax));
            value = Math.round(value); // Redondear siempre
            slider.value = value;
            editableSpan.textContent = `$${value}`;
            console.log(`%c[EditableSpan Blur] Slider ${slider.id} actualizado a: ${slider.value} desde span. Llamando a updateValues.`, logStyles.value);
            updateValues(slider.id);
        });

        editableSpan.addEventListener('input', () => {
            const originalValue = editableSpan.textContent;
            let newValue = originalValue.replace(/[^0-9.$]/g, '');
            if (newValue.startsWith('$')) {
                newValue = '$' + newValue.substring(1).replace(/\$/g, '');
            } else {
                newValue = newValue.replace(/\$/g, '');
            }
            const parts = newValue.split('.');
            if (parts.length > 2) {
                newValue = parts[0] + '.' + parts.slice(1).join('');
            }
            if (originalValue !== newValue) {
                editableSpan.textContent = newValue;
            }
        });

        editableSpan.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                editableSpan.blur();
            }
        });
    };

    syncSliderWithEditableSpan(downPaymentSlider, downPaymentValueSpan);
    syncSliderWithEditableSpan(monthlyPaymentSlider, monthlyPaymentValueSpan);
    syncSliderWithEditableSpan(extendedDownPaymentSlider, extendedDownPaymentValueSpan);
    syncSliderWithEditableSpan(extendedMonthlyPaymentSlider, extendedMonthlyPaymentValueSpan);
    console.log('%cSincronización configurada entre spans editables y sliders.', logStyles.success);

    // --- 8. LLAMADA INICIAL PARA ACTUALIZAR VALORES ---
    updateValues();

    console.log('%c[PaymentView] Inicialización del Módulo de Pagos completada con éxito.', logStyles.success);
    console.groupEnd();
});