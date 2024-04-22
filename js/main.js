// Obtener elementos del DOM
const contenedorProductos = document.querySelector("#productos");
const carritoVacio = document.querySelector("#carrito-vacio");
const carritoProductos = document.querySelector("#carrito-productos");
const carritoTotal = document.querySelector("#carrito-total");
const numerito = document.querySelector("#numerito");

// Función para crear un elemento de producto
function crearProductoElemento(producto) {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
        <img class="producto-img" src="${producto.img}" alt="${producto.titulo}">
        <h3>${producto.titulo}</h3>
        <p>$${producto.precio}</p>
        <button class="boton-agregar" id=${producto.id}>Agregar al carrito</button>
    `;
    
    const btn = document.createElement("button");
    btn.classList.add("producto-btn");
    btn.innerText = "Agregar al carrito";
    btn.addEventListener("click", () => {
        agregarAlCarrito(producto);
    });
    
    div.appendChild(btn);
    return div;
}

// Función para actualizar el carrito
function actualizarCarrito() {
    if (carrito.length === 0) {
        carritoVacio.classList.remove("d-none");
        carritoProductos.classList.add("d-none");
    } else {
        carritoVacio.classList.add("d-none");
        carritoProductos.classList.remove("d-none");

        carritoProductos.innerHTML = "";
        carrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");

            const subtotal = producto.precio * producto.cantidad;

            div.innerHTML = `
                <p>${producto.titulo} | Precio: $${producto.precio} | Cantidad: ${producto.cantidad} | Subtotal: $${subtotal}</p>
                <button class="carrito-producto-btn">⬇️</button>
                <button class="carrito-producto-btn">⬆️</button>
                <button class="carrito-producto-btn">✖️</button>
            `;

            div.querySelectorAll(".carrito-producto-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    if (btn.innerText === "⬇️") {
                        restarDelCarrito(producto);
                    } else if (btn.innerText === "⬆️") {
                        sumarDelCarrito(producto);
                    } else if (btn.innerText === "✖️") {
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

// Event listener para botones de agregar al carrito
contenedorProductos.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("boton-agregar")) {
        const id = e.target.id;
        const productoAsignado = productos.find(prod => prod.id === id);
        agregarAlCarrito(productoAsignado);
    }
});

// Función para agregar un producto al carrito
function agregarAlCarrito(producto) {
    const itemEncontrado = carrito.find(item => item.titulo === producto.titulo);
    if (itemEncontrado) {
        itemEncontrado.cantidad++;
    } else {
        carrito.push({...producto, cantidad: 1});
    }

    actualizarCarrito();

    Toastify({
        text: "Producto agregado al carrito.",
        gravity: "bottom", // top o bottom
        position: "right", // left, center o right
        duration: 1000
    }).showToast();
}

// Función para borrar un producto del carrito
function borrarDelCarrito(producto) {
    const idProducto = producto.id;
    const index = carrito.findIndex(item => item.id === idProducto);
    if (index !== -1) {
        carrito.splice(index, 1);
        actualizarCarrito();
    } else {
        console.error("Producto no encontrado en el carrito:", producto);
    }
}

// Función para restar la cantidad de un producto en el carrito
function restarDelCarrito(producto) {
    if (producto.cantidad !== 1) {
        producto.cantidad--;
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

// Inicialización
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const productos = [
    {
        id: "Amigurumi 1",
        titulo: "Rino",
        precio: 2000,
        img: "./img/rino.jpg",
    },
    {
        id: "Amigurumi 2",
        titulo: "Jirafi",
        precio: 2000,
        img: "./img/jirafi.jpg",
    },
    {
        id: "Amigurumi 3",
        titulo: "Koala",
        precio: 2000,
        img: "./img/koala.jpg",
    }
];

productos.forEach((producto) => {
    contenedorProductos.appendChild(crearProductoElemento(producto));
});

actualizarCarrito();

