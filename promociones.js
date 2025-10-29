// Aromanía - Sistema de Promociones
// Archivo: promociones.js

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("promocionesForm");
  const btnLimpiar = document.getElementById("btnLimpiar");
  const resultadosDiv = document.getElementById("resultados");
  const checkboxes = document.querySelectorAll(".producto-checkbox");

  // Habilitar/deshabilitar cantidad según selección
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const productoValue = this.value;
      const cantidadInput = document.getElementById("cant-" + productoValue);

      if (this.checked) {
        cantidadInput.disabled = false;
        cantidadInput.value = 1;
        cantidadInput.min = 1;
      } else {
        cantidadInput.disabled = true;
        cantidadInput.value = 0;
        cantidadInput.min = 0;
      }
    });
  });

  // Manejar envío del formulario
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calcularPromocion();
  });

  // Botón limpiar
  btnLimpiar.addEventListener("click", limpiarFormulario);

  // ==========================
  // FUNCIÓN PRINCIPAL
  // ==========================
  function calcularPromocion() {
    const tipoPromo = document.getElementById("tipoPromo").value;

    if (!tipoPromo) {
      alert("Por favor, seleccioná una promoción.");
      return;
    }

    const productosSeleccionados = obtenerProductosSeleccionados();

    if (productosSeleccionados.length === 0) {
      alert("Seleccioná al menos un producto.");
      return;
    }

    let resultado;

    switch (tipoPromo) {
      case "ritual":
        resultado = calcularRitual(productosSeleccionados);
        break;
      case "duo":
        resultado = calcularDuo(productosSeleccionados);
        break;
      case "bienestar":
        resultado = calcularBienestar(productosSeleccionados);
        break;
      default:
        alert("Promoción no válida.");
        return;
    }

    mostrarResultados(resultado, productosSeleccionados);
  }

  // ==========================
  // OBTENER PRODUCTOS SELECCIONADOS
  // ==========================
  function obtenerProductosSeleccionados() {
    const productos = [];

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const productoValue = checkbox.value;
        const precio = parseFloat(checkbox.dataset.precio);
        const cantidad = parseInt(document.getElementById("cant-" + productoValue).value);

        if (cantidad > 0) {
          productos.push({
            nombre: checkbox.parentElement.textContent.trim(),
            precio,
            cantidad,
          });
        }
      }
    });

    return productos;
  }

  // ==========================
  // PROMOCIONES
  // ==========================

  // Ritual Relax (40% OFF en segundo producto más barato)
  function calcularRitual(productos) {
    let subtotal = 0;
    let descuento = 0;
    const unidades = [];

    productos.forEach((p) => {
      for (let i = 0; i < p.cantidad; i++) unidades.push(p.precio);
      subtotal += p.precio * p.cantidad;
    });

    if (unidades.length >= 2) {
      unidades.sort((a, b) => a - b);
      descuento = unidades[0] * 0.4;
    }

    const total = subtotal - descuento;

    return {
      subtotal,
      descuento,
      total,
      mensaje:
        descuento > 0
          ? "Ahorraste un 40% en el segundo producto con Ritual Relax 🧘‍♀️"
          : "Agregá al menos 2 productos para aplicar la promoción.",
    };
  }

  // Dúo Aromático (3x2: el más barato gratis)
  function calcularDuo(productos) {
    let subtotal = 0;
    let descuento = 0;
    const unidades = [];

    productos.forEach((p) => {
      for (let i = 0; i < p.cantidad; i++) unidades.push(p.precio);
      subtotal += p.precio * p.cantidad;
    });

    if (unidades.length >= 3) {
      unidades.sort((a, b) => a - b);
      descuento = unidades[0];
    }

    const total = subtotal - descuento;

    return {
      subtotal,
      descuento,
      total,
      mensaje:
        descuento > 0
          ? "¡Pagás 2 y te llevás 3 con Dúo Aromático 🕯!"
          : "Necesitás al menos 3 productos para aplicar esta promoción.",
    };
  }

  // Bienestar Total (10% OFF > $35.000)
  function calcularBienestar(productos) {
    const subtotal = productos.reduce(
      (sum, p) => sum + p.precio * p.cantidad,
      0
    );
    const descuento = subtotal > 35000 ? subtotal * 0.1 : 0;
    const total = subtotal - descuento;

    return {
      subtotal,
      descuento,
      total,
      mensaje:
        descuento > 0
          ? "¡Disfrutaste un 10% OFF con Bienestar Total 🌿!"
          : `Agregá $${formatearPrecio(
              35000 - subtotal
            )} más para alcanzar el descuento.`,
    };
  }

  // ==========================
  // MOSTRAR RESULTADOS
  // ==========================
  function mostrarResultados(resultado, productos) {
    resultadosDiv.innerHTML = `
      <h3 class="title title-modal">🧾 Resumen de tu compra</h3>

      <div class="result-details">
        ${productos
          .map(
            (p) =>
              `<p class="result-line">• ${p.nombre} x${p.cantidad} — $${formatearPrecio(
                p.precio * p.cantidad
              )}</p>`
          )
          .join("")}
      </div>

      <div class="hr--muted"></div>
      <p><strong>Subtotal sin descuento:</strong> $${formatearPrecio(resultado.subtotal)}</p>
      <p><strong>Descuento aplicado:</strong> -$${formatearPrecio(resultado.descuento)}</p>
      <p class="result-total"><strong>Total a pagar:</strong> $${formatearPrecio(resultado.total)}</p>

      <p class="promo-message">${resultado.mensaje}</p>
    `;

    resultadosDiv.style.display = "block";
    resultadosDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // ==========================
  // UTILIDADES
  // ==========================
  function formatearPrecio(precio) {
    return Math.round(precio).toLocaleString("es-AR");
  }

  function limpiarFormulario() {
    form.reset();
    checkboxes.forEach((checkbox) => {
      const productoValue = checkbox.value;
      const cantidadInput = document.getElementById("cant-" + productoValue);
      cantidadInput.disabled = true;
      cantidadInput.value = 0;
    });
    resultadosDiv.style.display = "none";
  }

  console.log("🪔 Sistema de promociones Aromanía cargado correctamente");
});