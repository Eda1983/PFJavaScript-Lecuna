// Obtener elementos del DOM
const contenedorProductos = document.querySelector("#productos");
const carritoVacio = document.querySelector("#carrito-vacio");
const carritoProductos = document.querySelector("#carrito");
const carritoTotal = document.querySelector("#carrito-total");
const numerito = document.querySelector("#numerito");

// Inicialización del carrito
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Definición de productos
const productos = [
    {
        id: "Amigurumi1",
        titulo: "Rino",
        precio: 2000,
        img: "./img/rino.jpg",
    },
    {
        id: "Amigurumi2",
        titulo: "Jirafa",
        precio: 2000,
        img: "./img/jirafi.jpg",
    },
    {
        id: "Amigurumi3",
        titulo: "Koala",
        precio: 2000,
        img: "./img/koala.jpg",
    }
];

// Función para crear un elemento de producto
function crearProductoElemento(producto) {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
        <img class="producto-img" src="${producto.img}" alt="${producto.titulo}">
        <h3>${producto.titulo}</h3>
        <p>$${producto.precio}</p>
        <button class="producto-btn" data-id="${producto.id}">Agregar al carrito</button>
    `;

    div.querySelector(".producto-btn").addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const productoAsignado = productos.find(prod => prod.id === id);
        agregarAlCarrito(productoAsignado);
    });

    return div;
}

// Función para actualizar el carrito
function actualizarCarrito() {
    carritoProductos.innerHTML = ""; // Limpiar el contenido del carrito

    if (carrito.length === 0) {
        carritoVacio.classList.remove("d-none");
        carritoProductos.classList.add("d-none"); // Ocultar el contenedor de productos del carrito
    } else {
        carritoVacio.classList.add("d-none");
        carritoProductos.classList.remove("d-none"); // Mostrar el contenedor de productos del carrito
        carrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");

            const subtotal = producto.precio * producto.cantidad;

            div.innerHTML = `
                <p>${producto.titulo} | Precio: $${producto.precio} | Cantidad: ${producto.cantidad} | Subtotal: $${subtotal}</p>
                <button class="carrito-producto-btn" data-action="restar">⬇️</button>
                <button class="carrito-producto-btn" data-action="sumar">⬆️</button>
                <button class="carrito-producto-btn" data-action="borrar">✖️</button>
            `;

            div.querySelectorAll(".carrito-producto-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const action = btn.dataset.action;
                    if (action === "restar") {
                        restarDelCarrito(producto);
                    } else if (action === "sumar") {
                        sumarDelCarrito(producto);
                    } else if (action === "borrar") {
                        borrarDelCarrito(producto);
                    }
                });
            });

            carritoProductos.append(div);
        });
    }
    calcularNumerito();
    actualizarTotal();
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para agregar un producto al carrito
function agregarAlCarrito(producto) {
    const itemEncontrado = carrito.find(item => item.id === producto.id);
    if (itemEncontrado) {
        if (itemEncontrado.cantidad < 1000) { // Límite máximo de 1000 artículos en el carrito
            itemEncontrado.cantidad++;
        } else {
            // Mostrar un mensaje de advertencia si se alcanza el límite máximo
            Toastify({
                text: "Se ha alcanzado el límite máximo de artículos en el carrito (1000).",
                gravity: "bottom",
                position: "right",
                duration: 3000
            }).showToast();
        }
    } else {
        carrito.push({...producto, cantidad: 1});
    }

    actualizarCarrito(); // Llamar a actualizarCarrito() después de agregar un producto

    // Mostrar notificación de producto agregado al carrito
    Toastify({
        text: "Producto agregado al carrito.",
        gravity: "bottom",
        position: "right",
        duration: 1000
    }).showToast();
}


// Función para borrar un producto del carrito
function borrarDelCarrito(producto) {
    carrito = carrito.filter(item => item.id !== producto.id);
    actualizarCarrito();
}

// Función para restar la cantidad de un producto en el carrito
function restarDelCarrito(producto) {
    if (producto.cantidad > 1) {
        producto.cantidad--;
    } else {
        borrarDelCarrito(producto);
    }
    actualizarCarrito();
}

// Función para sumar la cantidad de un producto en el carrito
function sumarDelCarrito(producto) {
    producto.cantidad++;
    actualizarCarrito();
}

// Función para actualizar el total del carrito
function actualizarTotal() {
    const total = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
    carritoTotal.innerText = `$${total}`;
}

// Función para calcular el número total de productos en el carrito
function calcularNumerito() {
    const numeritoTotal = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    numerito.innerText = numeritoTotal;
}

// Función para manejar el evento de clic en el botón "Finalizar compra"
document.getElementById("finalizar-compra").addEventListener("click", () => {
    // Aquí va el código para mostrar la alerta de SweetAlert
    Swal.fire({
        title: '¡Gracias por tu compra!',
        text: '¡Esperamos verte de nuevo pronto!',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
});


// Inicialización de la página
productos.forEach((producto) => {
    contenedorProductos.appendChild(crearProductoElemento(producto));
});

actualizarCarrito();


fetch('data/productos.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('No se pudo cargar el archivo productos.json');
    }
    return response.json();
  })
  .then(data => {
    // Aquí puedes trabajar con los datos cargados, como mostrarlos en tu tienda en línea
    console.log(data); // Solo para verificar en la consola que los datos se hayan cargado correctamente
    
    // Iterar sobre el array de productos
    data.forEach(producto => {
        // Crear un elemento div para el producto
        const productoElemento = document.createElement("div");
        productoElemento.classList.add("producto");

        // Construir el contenido HTML del producto
        productoElemento.innerHTML = `
            <img class="producto-img" src="${producto.img}" alt="${producto.titulo}">
            <h3>${producto.titulo}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>${producto.descripcion}</p>
            <button class="producto-btn" data-id="${producto.id}">Agregar al carrito</button>
        `;

        // Agregar un evento click al botón de agregar al carrito
        const botonAgregar = productoElemento.querySelector(".producto-btn");
        botonAgregar.addEventListener("click", () => {
            // Aquí puedes agregar la lógica para agregar el producto al carrito
            agregarAlCarrito(producto);
        });

        // Agregar el elemento del producto al contenedor de productos
        contenedorProductos.appendChild(productoElemento);
    });
  })
  .catch(error => {
    console.error('Error al cargar los datos:', error);
  });



