document.addEventListener('DOMContentLoaded', function() {
    const serviceType = document.getElementById('serviceType');
    const serviceName = document.getElementById('serviceName');
    const quantity = document.getElementById('quantity');
    const buyPrice = document.getElementById('buyPrice');
    const sellPrice = document.getElementById('sellPrice');
    const buyPriceUSD = document.getElementById('buyPriceUSD');
    const sellPriceUSD = document.getElementById('sellPriceUSD');
    const profitMargin = document.getElementById('profitMargin');
    const dropPercentage = document.getElementById('dropPercentage');
    const finalQuantity = document.getElementById('finalQuantity');
    const exchangeRate = 1300; // 1 dólar = 1300 pesos argentinos

    let combinedData = { services: { seguidores: [], likes: [], vistas: [], comentarios: [] } };

    // Eventos
    serviceType.addEventListener('change', updateIndividualServices);
    quantity.addEventListener('input', updatePrice);
    profitMargin.addEventListener('input', updatePrice);
    dropPercentage.addEventListener('input', updatePrice);

    // Cargar archivo JSON
    async function loadJSONFile() {
        try {
            const response = await fetch('instagram.json');
            const data = await response.json();

            Object.keys(data.services).forEach(category => {
                if (!combinedData.services[category]) {
                    combinedData.services[category] = [];
                }
                combinedData.services[category] = combinedData.services[category].concat(data.services[category]);
            });

            updateIndividualServices();
        } catch (error) {
            console.error('Error loading JSON file:', error);
        }
    }

    // Actualizar servicios individuales según el tipo seleccionado
    function updateIndividualServices() {
        const selectedType = serviceType.value;

        serviceName.innerHTML = '';
        if (combinedData.services[selectedType]) {
            const services = combinedData.services[selectedType];

            services.forEach(service => {
                const option = document.createElement('option');
                option.value = service.id;
                option.textContent = service.service_name;
                option.dataset.price = service.price_per_unit;
                serviceName.appendChild(option);
            });
        }
        updatePrice();
    }

    // Actualizar precio
    function updatePrice() {
        const selectedService = serviceName.selectedOptions[0];
        const pricePerUnitInDollars = selectedService ? parseFloat(selectedService.dataset.price) : 0;
        const pricePerUnitInPesos = pricePerUnitInDollars * exchangeRate;
        const totalPriceInPesos = pricePerUnitInPesos * quantity.value;
        
        const profitMarginValue = parseFloat(profitMargin.value) / 100;
        const dropPercentageValue = parseFloat(dropPercentage.value) / 100;
        
        const adjustedQuantity = quantity.value * (1 + dropPercentageValue);
        const adjustedPrice = totalPriceInPesos * (1 + dropPercentageValue);
        const sellPriceInPesos = adjustedPrice * (1 + profitMarginValue);
        const sellPriceInDollars = sellPriceInPesos / exchangeRate;

        buyPrice.textContent = totalPriceInPesos.toFixed(2);
        sellPrice.textContent = sellPriceInPesos.toFixed(2);
        buyPriceUSD.textContent = (totalPriceInPesos / exchangeRate).toFixed(2);
        sellPriceUSD.textContent = sellPriceInDollars.toFixed(2);
        finalQuantity.textContent = adjustedQuantity.toFixed(0);
    }

    loadJSONFile();
});
