Swal.fire({
    title: '¡Vamos! ¡A cumplir tus metas!',
    showClass: {
        popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
    }
});

const fecha = document.querySelector('#fecha');
const lista = document.querySelector('#lista');
const input = document.querySelector('#input');
const botonEnter = document.querySelector('#boton-enter');
const check = 'fa-check-circle';
const uncheck = 'fa-circle';
const lineThrough = 'line-through';
let id;
let LIST;

const FECHA = new Date();
fecha.innerHTML = FECHA.toLocaleDateString('es-AR', { weekday: 'long', month: 'short', day: 'numeric' });

function agregarTarea(tarea, id, realizado, eliminado) {
    if (eliminado) { return; }
    const REALIZADO = realizado ? check : uncheck;
    const LINE = realizado ? lineThrough : '';

    const elemento = `
        <li id="elemento">
        <i class="far ${REALIZADO}" data="realizado" id="${id}"></i>
        <p class="text ${LINE}">${tarea}</p>
        <i class="fas fa-trash de" data="eliminado" id="${id}"></i> 
        </li>
    `;
    lista.insertAdjacentHTML("beforeend", elemento);
}

function tareaRealizada(element) {
    const taskId = element.id;
    const task = LIST.find(item => item.id == taskId);

    if (task) {
        task.realizado = !task.realizado;
        guardarListaEnLocalStorage();
    } else {
        console.error('Error: No se encontró la tarea en la lista.');
    }

    element.classList.toggle(check);
    element.classList.toggle(uncheck);
    element.parentNode.querySelector('.text').classList.toggle(lineThrough);

    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Haz realizado tu tarea',
        showConfirmButton: false,
        timer: 1500
    });
}

function tareaEliminada(element) {
    return new Promise((resolve) => {
        Swal.fire({
            title: '¿Seguro quieres eliminar la tarea?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si'
        }).then((result) => {
            if (result.isConfirmed) {
                element.parentNode.parentNode.removeChild(element.parentNode);
                LIST[element.id].eliminado = true;
                guardarListaEnLocalStorage();
                resolve();
            }
        });
    });
}

function guardarListaEnLocalStorage() {
    try {
        localStorage.setItem('todolist', JSON.stringify(LIST));
    } catch (error) {
        console.error('Error al guardar en el almacenamiento local:', error);
    }
}

function cargarListaDesdeLocalStorage() {
    try {
        const data = localStorage.getItem('todolist');
        LIST = data ? JSON.parse(data) : [];
        id = LIST.length;
        const tareasNoEliminadas = LIST.filter(item => !item.eliminado);
        cargarLista(tareasNoEliminadas);
    } catch (error) {
        console.error('Error al cargar desde el almacenamiento local:', error);
    }
}

function cargarLista(array) {
    array.forEach(function (item) {
        agregarTarea(item.nombre, item.id, item.realizado, item.eliminado);
    });
}

botonEnter.addEventListener('click', () => {
    const tarea = input.value;
    if (tarea) {
        agregarTarea(tarea, id, false, false);
        LIST.push({
            nombre: tarea,
            id: id,
            realizado: false,
            eliminado: false
        });
        guardarListaEnLocalStorage();
        id++;
        input.value = '';
    }
});

document.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        const tarea = input.value;
        if (tarea) {
            agregarTarea(tarea, id, false, false);
            LIST.push({
                nombre: tarea,
                id: id,
                realizado: false,
                eliminado: false
            });
            guardarListaEnLocalStorage();
            id++;
            console.log(LIST);
            input.value = '';
        }
    }
});

lista.addEventListener('click', async function (event) {
    const element = event.target;
    const elementData = element.attributes.data.value;
    console.log(elementData);

    if (elementData === 'realizado') {
        tareaRealizada(element);
    } else if (elementData === 'eliminado') {
        await tareaEliminada(element);
    }
});

cargarListaDesdeLocalStorage();