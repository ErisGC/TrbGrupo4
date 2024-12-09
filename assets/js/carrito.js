
//DOM
document.addEventListener('DOMContentLoaded', () => { 
    // Variables
    const baseDeDatos = [
        {
            id: 1,
            nombre: 'Figura de accion Luffy en pose de combate',
            precio: 250000,
            imagen: 'assets/img/img1.jpg',
            categoria: 'sombreros'
        },
        {
            id: 2,
            nombre: 'Figura de acción Luffy sonriendo',
            precio: 150000,
            imagen: 'assets/img/img2.jpg',
            categoria: 'sombreros'
        },
        {
            id: 3,
            nombre: 'Figura de acción Ironman/Tony Stark ultrarealista en pose de [Yo soy Ironman]',
            precio: 250000,
            imagen: 'assets/img/img3.jpg',
            categoria: 'sombreros'
        },
        {
            id: 4,
            nombre: 'Figura de coleccion de Zoro en la escena contra King',
            precio: 500000,
            imagen: 'assets/img/img4.jpg',
            categoria: 'mochilas'
        },
        {
            id: 5,
            nombre: 'Figura de acción Zoro preparado para la batalla',
            precio: 300000,
            imagen: 'assets/img/img5.jpg',
            categoria: 'bolsos'
        },
        {
            id: 6,
            nombre: 'FunkoZoro',
            precio: 110000,
            imagen: 'assets/img/img6.jpg',
            categoria: 'hamacas'
        },
        {
            id: 7,
            nombre: 'Conjunto figuras de accion, personajes de Kimetsu no Yaiba',
            precio: 470000,
            imagen: 'assets/img/img7.jpg',
            categoria: 'hamacas'
        }

    ];

    let carrito = [];
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const miLocalStorage = window.localStorage;
    const filtroSelect = document.getElementById("filtro");

    // Funciones
    let paginaActual = 1;
    const productosPorPagina = 6;

    function renderizarProductos() {
        DOMitems.innerHTML = "";
    const filtro = filtroSelect.value;

    // Filtrar productos por categoría
    const productosFiltrados = baseDeDatos.filter(producto => 
        filtro === "todas" || producto.categoria === filtro
    );

    // Calcular el rango de productos a mostrar
    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const productosPagina = productosFiltrados.slice(inicio, fin);

    // Renderizar los productos de la página actual
    productosPagina.forEach((info) => {
        const miNodo = document.createElement('div');
        miNodo.classList.add('card', 'col-sm-4');
        const miNodoCardBody = document.createElement('div');
        miNodoCardBody.classList.add('card-body');
        const miNodoTitle = document.createElement('h6');
        miNodoTitle.classList.add('card-title');
        miNodoTitle.textContent = info.nombre;
        const miNodoImagen = document.createElement('img');
        miNodoImagen.classList.add('img-fluid');
        miNodoImagen.setAttribute('src', info.imagen);
        const miNodoPrecio = document.createElement('p');
        miNodoPrecio.classList.add('card-text');
        miNodoPrecio.textContent = `${info.precio}${divisa}`;
        const miNodoBoton = document.createElement('button');
        miNodoBoton.classList.add('btn', 'btn-primary');
        miNodoBoton.textContent = 'Agregar';
        miNodoBoton.setAttribute('marcador', info.id);
        miNodoBoton.addEventListener('click', anadirProductoAlCarrito);
        miNodoCardBody.appendChild(miNodoImagen);
        miNodoCardBody.appendChild(miNodoTitle);
        miNodoCardBody.appendChild(miNodoPrecio);
        miNodoCardBody.appendChild(miNodoBoton);
        miNodo.appendChild(miNodoCardBody);
        DOMitems.appendChild(miNodo);
    });

    // Renderizar los controles de paginación
    renderizarControlesPaginacion(productosFiltrados.length);
    }
    function renderizarControlesPaginacion(totalProductos) {
        const contenedorPaginacion = document.querySelector('.pagination');
        contenedorPaginacion.innerHTML = "";
    
        const totalPaginas = Math.ceil(totalProductos / productosPorPagina);
    
        for (let i = 1; i <= totalPaginas; i++) {
            const botonPagina = document.createElement('li');
            botonPagina.classList.add('page-item');
            if (i === paginaActual) {
                botonPagina.classList.add('active');
            }
    
            const enlacePagina = document.createElement('a');
            enlacePagina.classList.add('page-link');
            enlacePagina.textContent = i;
            enlacePagina.href = "#";
            enlacePagina.addEventListener('click', (e) => {
                e.preventDefault();
                paginaActual = i;
                renderizarProductos();
            });
    
            botonPagina.appendChild(enlacePagina);
            contenedorPaginacion.appendChild(botonPagina);
        }
    }
    
// Obtén el contador del almacenamiento local
    let visitas = localStorage.getItem('contadorVisitas');
// Si no hay visitas almacenadas, inicializa a 0
    if (!visitas) {
        visitas = 0;
    }
// Incrementa el contador
    visitas++;
// Guarda el nuevo contador en el almacenamiento local
    localStorage.setItem('contadorVisitas', visitas);
// Muestra el contador en la página
    document.getElementById('contador').textContent = visitas;
    function anadirProductoAlCarrito(evento) {
        carrito.push(evento.target.getAttribute('marcador'));
        renderizarCarrito();
        guardarCarritoEnLocalStorage();
        handleCarritoValue(carrito.length);
    }
    function handleCarritoValue(value) {
        const carritoContainer = document.getElementById("carrito-value");
        carritoContainer.textContent = `${value}`;
    }
    function renderizarCarrito() {
        DOMcarrito.textContent = '';
        const carritoSinDuplicados = [...new Set(carrito)];
        carritoSinDuplicados.forEach((item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                return itemId === item ? total += 1 : total;
            }, 0);
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
        DOMtotal.textContent = calcularTotal();
    }
    //borra carrito
    function borrarItemCarrito(evento) {
        const id = evento.target.dataset.item;
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        renderizarCarrito();
        guardarCarritoEnLocalStorage();
        handleCarritoValue(carrito.length);
    }
    //calcular el total
    function calcularTotal() {
        return carrito.reduce((total, item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }
    //vaciar todos los elementos del carrito
    function vaciarCarrito() {
        carrito = [];
        renderizarCarrito();
        localStorage.clear();
    }
    //guardar en local el carrito
    function guardarCarritoEnLocalStorage() {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }
    //cargar del local el carriro
    function cargarCarritoDeLocalStorage() {
        if (miLocalStorage.getItem('carrito') !== null) {
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
            handleCarritoValue(carrito.length);
        }
    }
    // Eventos
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);
    filtroSelect.addEventListener('change', renderizarProductos);
    // Inicio
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
});