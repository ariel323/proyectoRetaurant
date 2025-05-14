// =====================
// INICIO DEL PANEL DE ADMINISTRACIÓN
// =====================
window.addEventListener("DOMContentLoaded", iniciarPanel);

async function iniciarPanel() {
  await mostrarRolUsuarioYControlarVista();
  cargarMesas();
}

// =====================
// MOSTRAR ROL Y CONTROLAR VISTA
// =====================
async function mostrarRolUsuarioYControlarVista() {
  try {
    const res = await fetch("/api/usuarios/rol", { credentials: "include" });
    const data = await res.json();
    document.getElementById("infoRol").textContent = "Rol actual: " + data.rol;

    const adminSection = document.getElementById("adminSection");
    if (adminSection) {
      adminSection.style.display = data.rol === "ADMIN" ? "block" : "none";
      document.getElementById("noAdminMsg").style.display =
        data.rol === "ADMIN" ? "none" : "block";
    }

    if (data.rol === "ADMIN") {
      cargarMenu();
      cargarListaMesas();
      cargarPedidos();
    }
  } catch (err) {
    document.getElementById("infoRol").textContent = "Rol actual: ADMIN";
    if (document.getElementById("adminSection")) {
      document.getElementById("adminSection").style.display = "none";
    }
  }
}

// =====================
// MENSAJES AL USUARIO
// =====================
function mostrarMensaje(texto, exito = true, id = "mensaje") {
  const mensaje = document.getElementById(id);
  if (!mensaje) return;
  mensaje.textContent = texto;
  mensaje.style.color = exito ? "green" : "red";
  setTimeout(() => (mensaje.textContent = ""), 3000);
}

// =====================
// AGREGAR PRODUCTO AL MENÚ
// =====================
document.getElementById("formAgregarProducto").onsubmit = async function (e) {
  e.preventDefault();
  const nombre = document.getElementById("nombreProducto").value;
  const categoria = document.getElementById("categoriaProducto").value;
  const precio = parseFloat(document.getElementById("precioProducto").value);

  const producto = { nombre, categoria, precio };

  try {
    const res = await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
    });
    if (res.ok) {
      mostrarMensaje("¡Producto agregado!", true, "mensajeProducto");
      document.getElementById("formAgregarProducto").reset();
      cargarMenu();
    } else {
      const error = await res.text();
      mostrarMensaje(
        "Error al agregar producto: " + error,
        false,
        "mensajeProducto"
      );
    }
  } catch (err) {
    mostrarMensaje(
      "Error de red al agregar producto.",
      false,
      "mensajeProducto"
    );
  }
};

// =====================
// AGREGAR MESA
// =====================
document.getElementById("formAgregarMesa").onsubmit = async function (e) {
  e.preventDefault();
  const numero = parseInt(document.getElementById("numeroMesa").value);

  const mesa = { numero, estado: "LIBRE" };

  try {
    const res = await fetch("/api/mesas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mesa),
    });
    if (res.ok) {
      mostrarMensaje("¡Mesa agregada!", true, "mensajeMesa");
      document.getElementById("formAgregarMesa").reset();
      cargarListaMesas();
    } else {
      const error = await res.text();
      mostrarMensaje("Error al agregar mesa: " + error, false, "mensajeMesa");
    }
  } catch (err) {
    mostrarMensaje("Error de red al agregar mesa.", false, "mensajeMesa");
  }
};

// =====================
// CARGAR MENÚ DEL RESTAURANTE (con editar/eliminar)
// =====================
async function cargarMenu() {
  const res = await fetch("/api/menu");
  const menu = await res.json();
  const lista = document.getElementById("listaMenu");
  lista.innerHTML = "";
  menu.forEach((item) => {
    lista.innerHTML += `
      <li>
        <b>${item.nombre}</b> (ID: ${item.id}) - $${item.precio.toFixed(2)}
        <button onclick="editarProducto(${item.id}, '${item.nombre}', '${
      item.categoria
    }', ${item.precio})">Editar</button>
        <button onclick="eliminarProducto(${
          item.id
        })" style="color:red;">Eliminar</button>
      </li>
    `;
  });
}

// =====================
// ELIMINAR PRODUCTO
// =====================
async function eliminarProducto(id) {
  if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
  try {
    const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
    if (res.ok) {
      mostrarMensaje("Producto eliminado.", true, "mensajeProducto");
      cargarMenu();
    } else {
      mostrarMensaje(
        "Error al eliminar el producto.",
        false,
        "mensajeProducto"
      );
    }
  } catch (err) {
    mostrarMensaje(
      "Error de red al eliminar el producto.",
      false,
      "mensajeProducto"
    );
  }
}
window.eliminarProducto = eliminarProducto;

// =====================
// EDITAR PRODUCTO
// =====================
function editarProducto(id, nombreActual, categoriaActual, precioActual) {
  const nuevoNombre = prompt("Nuevo nombre:", nombreActual);
  if (nuevoNombre === null) return;
  const nuevaCategoria = prompt("Nueva categoría:", categoriaActual);
  if (nuevaCategoria === null) return;
  const nuevoPrecio = prompt("Nuevo precio:", precioActual);
  if (nuevoPrecio === null) return;

  const producto = {
    nombre: nuevoNombre,
    categoria: nuevaCategoria,
    precio: parseFloat(nuevoPrecio),
  };

  fetch(`/api/menu/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  })
    .then((res) => {
      if (res.ok) {
        mostrarMensaje("Producto actualizado.", true, "mensajeProducto");
        cargarMenu();
      } else {
        mostrarMensaje(
          "Error al actualizar el producto.",
          false,
          "mensajeProducto"
        );
      }
    })
    .catch(() =>
      mostrarMensaje(
        "Error de red al actualizar el producto.",
        false,
        "mensajeProducto"
      )
    );
}
window.editarProducto = editarProducto;

// =====================
// CARGAR LISTA DE MESAS (con editar/eliminar)
// =====================
async function cargarListaMesas() {
  const res = await fetch("/api/mesas");
  const mesas = await res.json();
  const lista = document.getElementById("listaMesas");
  lista.innerHTML = "";
  mesas.forEach((mesa) => {
    lista.innerHTML += `
      <li>
        Mesa ${mesa.numero} (${mesa.estado})
        <button onclick="editarMesa(${mesa.id}, ${mesa.numero}, '${mesa.estado}')">Editar</button>
        <button onclick="eliminarMesa(${mesa.id})" style="color:red;">Eliminar</button>
      </li>
    `;
  });
}

// =====================
// ELIMINAR MESA
// =====================
async function eliminarMesa(id) {
  if (!confirm("¿Seguro que deseas eliminar esta mesa?")) return;
  try {
    const res = await fetch(`/api/mesas/${id}`, { method: "DELETE" });
    if (res.ok) {
      mostrarMensaje("Mesa eliminada.", true, "mensajeMesa");
      cargarListaMesas();
    } else {
      mostrarMensaje("Error al eliminar la mesa.", false, "mensajeMesa");
    }
  } catch (err) {
    mostrarMensaje("Error de red al eliminar la mesa.", false, "mensajeMesa");
  }
}
window.eliminarMesa = eliminarMesa;

// =====================
// EDITAR MESA
// =====================
function editarMesa(id, numeroActual, estadoActual) {
  const nuevoNumero = prompt("Nuevo número de mesa:", numeroActual);
  if (nuevoNumero === null) return;
  const nuevoEstado = prompt(
    "Nuevo estado (LIBRE, OCUPADA, RESERVADA):",
    estadoActual
  );
  if (nuevoEstado === null) return;

  const mesa = { numero: parseInt(nuevoNumero), estado: nuevoEstado };

  fetch(`/api/mesas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mesa),
  })
    .then((res) => {
      if (res.ok) {
        mostrarMensaje("Mesa actualizada.", true, "mensajeMesa");
        cargarListaMesas();
      } else {
        mostrarMensaje("Error al actualizar la mesa.", false, "mensajeMesa");
      }
    })
    .catch(() =>
      mostrarMensaje(
        "Error de red al actualizar la mesa.",
        false,
        "mensajeMesa"
      )
    );
}
window.editarMesa = editarMesa;

// =====================
// CARGAR PEDIDOS REALIZADOS
// =====================
async function cargarPedidos() {
  const res = await fetch("/api/pedidos");
  const pedidos = await res.json();
  const lista = document.getElementById("listaPedidos");
  if (!lista) return;
  lista.innerHTML = "";
  pedidos.forEach((p) => {
    let itemsTexto = "";
    if (p.items && p.items.length > 0) {
      itemsTexto = p.items
        .map((item) => (item.nombre ? item.nombre : "ID:" + item.id))
        .join(", ");
    }
    lista.innerHTML += `
      <li>
        Pedido #${p.id} - Mesa: ${p.mesa.numero} - Total: $${
      p.total ? p.total.toFixed(2) : "0.00"
    }<br>
        Items: ${itemsTexto}
      </li>
    `;
  });
}

// =====================
// CARGAR MESAS LIBRES
// =====================
async function cargarMesas() {
  const res = await fetch("/api/mesas/libres");
  const mesas = await res.json();
  const select = document.getElementById("mesaId");
  select.innerHTML = "";
  mesas.forEach((mesa) => {
    select.innerHTML += `<option value="${mesa.id}">Mesa ${mesa.numero}</option>`;
  });
}
