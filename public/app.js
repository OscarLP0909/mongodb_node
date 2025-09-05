const verLibrosBtn = document.getElementById('verLibros');
const crearLibroBtn = document.getElementById('crearLibro');
const actualizarLibroBtn = document.getElementById('actualizarLibro');
const librosDiv = document.getElementById('libros');
const formulario = document.getElementById('formularioLibro');
const cancelarBtn = document.getElementById('cancelar');

verLibrosBtn.onclick = async () => {
    librosDiv.innerHTML = '<em>Cargando...</em>';
    formulario.style.display = 'none';
    try {
        const res = await fetch('/libros');
        const libros = await res.json();
        if (libros.length === 0) {
            librosDiv.innerHTML = '<p>No hay libros en la librería.</p>';
        } else {
            librosDiv.innerHTML = '<ul>' + libros.map(l => `<li><strong>${l.titulo}</strong> de ${l.autor} (${l.año})</li>`).join('') + '</ul>';
        }
    } catch (err) {
        librosDiv.innerHTML = '<p>Error al cargar los libros.</p>';
    }
};

crearLibroBtn.onclick = () => {
    formulario.style.display = 'block';
    librosDiv.innerHTML = '';
};

cancelarBtn.onclick = () => {
    formulario.style.display = 'none';
};

formulario.onsubmit = async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(formulario));
    try {
        const res = await fetch('/libros/crear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        if (res.ok) {
            formulario.style.display = 'none';
            verLibrosBtn.click();
        } else {
            alert('Error al crear el libro');
        }
    } catch (err) {
        alert('Error de red');
    }
};

const formularioActualizar = document.getElementById('formularioActualizar');
const cancelarActualizarBtn = document.getElementById('cancelarActualizar');
const selectLibro = document.getElementById('selectLibro');
const tituloActualizar = document.getElementById('tituloActualizar');
const autorActualizar = document.getElementById('autorActualizar');
const añoActualizar = document.getElementById('añoActualizar');

actualizarLibroBtn.onclick = async () => {
    formularioActualizar.style.display = 'block';
    formulario.style.display = 'none';
    librosDiv.innerHTML = '';
    // Cargar libros en el select
    selectLibro.innerHTML = '<option value="">Cargando...</option>';
    try {
        const res = await fetch('/libros');
        const libros = await res.json();
        if (libros.length === 0) {
            selectLibro.innerHTML = '<option value="">No hay libros</option>';
        } else {
            selectLibro.innerHTML = libros.map(l => `<option value="${l._id}">${l.titulo} - ${l.autor} (${l.año})</option>`).join('');
            // Rellenar datos del primero por defecto
            const primero = libros[0];
            if (primero) {
                tituloActualizar.value = primero.titulo || '';
                autorActualizar.value = primero.autor || '';
                añoActualizar.value = primero.año || '';
            }
            selectLibro.onchange = () => {
                const libro = libros.find(l => l._id === selectLibro.value);
                if (libro) {
                    tituloActualizar.value = libro.titulo || '';
                    autorActualizar.value = libro.autor || '';
                    añoActualizar.value = libro.año || '';
                }
            };
        }
    } catch (err) {
        selectLibro.innerHTML = '<option value="">Error al cargar</option>';
    }
};

cancelarActualizarBtn.onclick = () => {
    formularioActualizar.style.display = 'none';
};

formularioActualizar.onsubmit = async (e) => {
    e.preventDefault();
    const id = selectLibro.value;
    const datos = {
        titulo: tituloActualizar.value,
        autor: autorActualizar.value,
        año: añoActualizar.value
    };
    // Elimina campos vacíos
    Object.keys(datos).forEach(k => { if (!datos[k]) delete datos[k]; });
    try {
        const res = await fetch(`/libros/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        if (res.ok) {
            formularioActualizar.style.display = 'none';
            verLibrosBtn.click();
        } else {
            alert('Error al actualizar el libro');
        }
    } catch (err) {
        alert('Error de red');
    }
};