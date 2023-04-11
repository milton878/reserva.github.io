
//para la base de datos 
let DB;
//declaro variables con sus input del html

const clienteInput = document.querySelector('#cliente');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const descripcionInput = document.querySelector('#descripcion');

//UI
const formulario = document.querySelector('#nueva-cita');

//aca van las nuevas citas q voy agregando
const contenedorCitas = document.querySelector('#citas');

//boton de editar
let editando;
//------CLASES:
class Reservas{
    constructor(){
        this.reservas = [];
    }
    agregarReserva (reserva){
        //--------------[copia de la reserva, reserva actual]
        this.reservas = [...this.reservas, reserva];
       
    }
    //agrego metodo para eliminar reserva
    eliminarResv(id){
        this.reservas = this.reservas.filter(reservas => reservas.id !== id)
    }
    editarReserva(reservaActualizada){
        this.reservas = this.reservas.map( reservas =>reservas.id === reservaActualizada.id ? reservaActualizada : reservas);
    }
}

class UI {
    //defino metodo imprimirAlerta para cd hay inputs vacios
    imprimirAlerta(mensaje, tipo){
    //creo el div
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
        
    //aagregar clase de bootstrap  de acuerdo al tipo de error
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');

        }
        //Mensaje de error
        divMensaje.textContent = mensaje;
        //agregar mensaje al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        //quitar alerta desp de 5 segundos
        setTimeout (() =>{
            divMensaje.remove();
        }, 1000);
       }
        
       //llamo al metodo y hago destructuring del objeto
       imprimirReservas(){
            
            this.limpiarHTML();

            //leer el contenido de la base de datos
            const objectStore = DB.transaction('reservas').objectStore('reservas');

            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result;
                if(cursor){
                     
               const{ cliente, telefono, fecha, hora, descripcion, id } = cursor.value; 

               //creo un div para la reserva
               const divReser = document.createElement('div');
               divReser.classList.add('reserva', 'p-3');
               divReser.dataset.id = id;

               //scripting de los elementos de la reserva
               const clienteParrafo = document.createElement('h2');
               clienteParrafo.classList.add('card-title', 'font-weight-bolder');
               clienteParrafo.textContent = cliente;

               const telefonoParrafo = document.createElement('p');
               telefonoParrafo.innerHTML = `
                        <span class="font-weight-bolder">Telefono</span> ${telefono}
               `;
                const fechaParrafo = document.createElement('p');
                fechaParrafo.innerHTML = `
                        <span class="font-weight-bolder">Fecha</span> ${fecha}
               `;
                const horaParrafo = document.createElement('p');
                horaParrafo.innerHTML = `
                        <span class="font-weight-bolder">Hora</span> ${hora}
               `;
                const descripcionParrafo = document.createElement('p');
                descripcionParrafo.innerHTML = `
                        <span class="font-weight-bolder">Descripcion</span> ${descripcion}
               `;
               //BOTON PARA ELIMINAR RESERVA
               const btnEliminar = document.createElement('button');
               btnEliminar.classList.add('btn','btn-danger', 'mr-2');
               btnEliminar.innerHTML=`Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
                `;
               btnEliminar.onclick = () =>eliminarResv(id);

               //boton EDITAR reserva:
               const btnEditar = document.createElement('button');
               const reserva = cursor.value;
               btnEditar.onclick = () => cargarEdicion(reserva);
               btnEditar.classList.add('btn', 'btn-info','ml-5');
               btnEditar.innerHTML = ` Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
               <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
               </svg>

                `;
                btnEditar.onclick = () => cargarEdicion(reserva);
               //agregar los parrafos al divReser
               divReser.appendChild(clienteParrafo);
               divReser.appendChild(telefonoParrafo);
               divReser.appendChild(fechaParrafo);
               divReser.appendChild(horaParrafo);
               divReser.appendChild(descripcionParrafo);
               divReser.appendChild(btnEliminar);
               divReser.appendChild(btnEditar);



               //agregar la reservas al  html
               contenedorCitas.appendChild(divReser);

               //Para q figuren todos los elementos sino muestra uno solo
               cursor.continue();

            
                }
            }
          
       }
       
       limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }
       }
}

//INTANCIAR  CLASES DE FORMA GLOBAL
const ui = new UI();

const admResrvas = new Reservas();


//crear ventana para: base de datos

window.onload = () =>{
eventListeners();
createDB();

}
//-----Registrar EVENTOS
//FUNCIONES PARA CADA UNO DE LOS INPUTeventListeners();
function eventListeners(){
    clienteInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    descripcionInput.addEventListener('input', datosCita);

    //agregao evento para cd apreto el boton
    formulario.addEventListener('submit', nuevaReserva );

}
//OBJETO CON INFO DE LA RESERVA
//creo el objeto: para q cd escribo los datos se llenen en el objeto
const reservaObj = {
    cliente:'',
    telefono:'',
    fecha:'',
    hora:'',
    descripcion:''
}

//FUNCION QUE LEE EL OBJETO reservaObj
//funcion q va a leer lo que el usuario esta escribiendo
function datosCita(e){
    reservaObj[e.target.name] = e.target.value;
    console.log(reservaObj);
}

//valida y agrega una nueva reserva a la clase Reserva.
function nuevaReserva(e){
    e.preventDefault();
    
    //extraer la info del objeto reservaObj
    const{ cliente, telefono, fecha, hora, descripcion } = reservaObj;

    //validar
    //valido q los campos no esten vacios
    if( cliente === '' || telefono === '' || fecha ==='' || hora ==='' || descripcion === ''){
        ui.imprimirAlerta('todos los campos son obligatorios', 'error');
        return;
    }
    if(editando){
        //pasar la reserva a edicion
        admResrvas.editarReserva({...reservaObj})

        //edita en IndexDB
        const transaction = DB.transaction(['reservas'], 'readwrite');
        const objectStore = transaction.objectStore('reservas');

        objectStore.put(reservaObj);
        transaction.oncomplete = () => {
        ui.imprimirAlerta('Se agrego correctamente');
        
        //regresar el texto del boton a su estado original
        formulario.querySelector('button[type="submit"]').textContent = "Crear Reserva";
        //quitar  modo edicion
        editando = false;
        }
        transaction.onerror = () =>{
            console.log('hubo un error');
        }


        

        
     

    }else{
        //generar un id unico
        reservaObj.id = Date.now();
        //creando una nueva reserva
        //- ----------------------------es una copia del objeto
        admResrvas.agregarReserva({...reservaObj});
        
        //insertar registro en INDEX DB
        const transaction = DB.transaction(['reservas'], 'readwrite');
        //habilitar el objetstore
        const objectStore = transaction.objectStore('reservas');
        //insetar en la base de datos
        objectStore.add(reservaObj);

        transaction.oncomplete = function(){
            console.log('cita agregada');
        //mensaje de agregado correctamente
        ui.imprimirAlerta('Se agrego correctamente');
        }


    }
    

    //Reinicio el objeto para la validacion:
    reiciarObjeto();

    //reseteo el formulario
    formulario.reset();

    //mostar en el html las reservas
    ui.imprimirReservas();
}

//reinicio el objeto:
function reiciarObjeto(){
    reservaObj.cliente = '';
    reservaObj.telefono = '';
    reservaObj.fecha = '';
    reservaObj.hora = '';
    reservaObj.descripcion = '';
}

function eliminarResv(id){
    //eliminar de IndexDB
    const transaction = DB.transaction(['reservas'], 'readwrite');
    const objectStore = transaction.objectStore('reservas');
    objectStore.delete(id);

    transaction.oncomplete = () =>{
        console.log(`Reserva ${id} eliminada..`)
        ui.imprimirReservas();
        
    }
    transaction.onerror = () =>{
        console.log('hubo un error')
    }
    //muestre la reserva
        ui.imprimirAlerta('la reserva se elimino correctamente');

   

    }

//CARGAR los datos y modo de edicion:
function cargarEdicion (reserva){
    const{ cliente, telefono, fecha, hora, descripcion, id } = reserva; 
   
    //llenar los input
    clienteInput.value = cliente;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    descripcionInput.value = descripcion;

    //cargar el objeto
    reservaObj.cliente = cliente;
    reservaObj.telefono = telefono;
    reservaObj.fecha = fecha;
    reservaObj.hora = hora;
    reservaObj.descripcion = descripcion;
    reservaObj.id = id;

    //cambiar el texto del boton
    formulario.querySelector('button[type="submit"]').textContent = "Guardar Cambios";
    
    editando = true;
}
//cuando la ventana esta lista  creamos la base de datos
function createDB (){
     //crear la base de datos 1.0
     const createDB = window.indexedDB.open('reservas', 1);

     //si hay error
     createDB.onerror = function(){
        console.log('hubo un error');
     }

     //si todo esta bien
     createDB.onsuccess = function (){
        console.log('bd creada');
        DB = createDB.result;
        //mostarr reserva al cargar (pero Index DB YA ESTA LISTO)
        ui.imprimirReservas();

     }
     //DEFINIR EL SCHEMA
     createDB.onupgradeneeded = function(e){
        const db = e.target.result;
        const objectStore = db.createObjectStore('reservas',{
            keyPath: 'id',
            autoIncrement: true
        });
        //definir todas las columnas
        objectStore.createIndex('clientes', 'cliente', {unique: false});
        objectStore.createIndex('telefono', 'telefono', {unique: false});
        objectStore.createIndex('fecha', 'fecha', {unique: false});
        objectStore.createIndex('hora', 'hora', {unique: false});
        objectStore.createIndex('descripcion', 'descripcion', {unique: false});
        objectStore.createIndex('id', 'id', {unique: true});

        console.log('bd creada y lista');

     }
}
