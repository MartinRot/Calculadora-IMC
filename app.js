/*
IMC     Nivel de peso
18.5 -> Bajo peso
18.5 a 24.9 -> Normal
25.0 a 29.9 -> Sobrepeso
30.0 o mas -> obeso
*/

/****************************************
 *       ENTIDADES 
 ****************************************/
class Persona {

    constructor({
        nombre,
        apellido,
        edad,
        peso,
        altura,
        imc,
        categoria,
        id
    }) {

        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.peso = peso;
        this.altura = altura;
        this.imc = imc;
        this.categoria = categoria;
        this.id = id;
    }
}

/***********************************
 *           VARIABLES             *
 ***********************************/
let imcActual;
let catActual;
var textIMC;
var textCAT;

//Capturamos la lista desordenada
const lista = document.getElementById("lista");

//Muestra por pantalla todas las ideas almacenadas en localstorage

const mostrar = () => { 

    lista.innerHTML = "";
    let personas = traerPersonas();
    lista.appendChild(imprimirPersonas(personas));
    mostrarTarjetasPromedios()
}

//Devuelve un array, vacío si no existe en localstorage, sino devuelve el array guardado
const traerPersonas = () => localStorage.getItem("personas") === null ? [] : JSON.parse(localStorage.getItem("personas"));

//Genera el listado al cargar la página
const imprimirPersonas = (array) => {

    const fragmento = document.createDocumentFragment();
    let imc;

    array.forEach((element) => {
        const tr = crearTr(element);
        fragmento.appendChild(tr);
        imc += element.imc;
    });

    return fragmento;
}

//Función que devuelve un elemento tr listo para ser agregado a la lista
const crearTr = (elemento) => {

    const tr = document.createElement("tr");

    const nombre = document.createElement("td");
    nombre.textContent = elemento.nombre;
    tr.appendChild(nombre);

    const apellido = document.createElement("td");
    apellido.textContent = elemento.apellido;
    tr.appendChild(apellido);

    const edad = document.createElement("td");
    edad.textContent = elemento.edad;
    tr.appendChild(edad);

    const peso = document.createElement("td");
    peso.textContent = elemento.peso;
    tr.appendChild(peso);

    const altura = document.createElement("td");
    altura.textContent = elemento.altura;
    tr.appendChild(altura);

    const imc = document.createElement("td");
    imc.textContent = elemento.imc;
    tr.appendChild(imc);

    const categoria = document.createElement("td");
    categoria.textContent = elemento.categoria;
    tr.appendChild(categoria);

    tr.setAttribute('id', elemento.id);

    const i = document.createElement("i");
    i.classList.add("icofont-close");
    tr.appendChild(i);

    return tr;
};

//Funcion de agregar personas
const agregarPersona = () => {

    console.log("Persona guardada")

    const persona = new Persona({
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        edad: document.getElementById("edad").value,
        peso: document.getElementById("peso").value,
        altura: document.getElementById("altura").value,
        imc: calcularImc(document.getElementById("peso").value, document.getElementById("altura").value).toFixed(2),
        categoria: calcularCategoria(calcularImc(document.getElementById("peso").value, document.getElementById("altura").value).toFixed(2)),
        id: Math.random()
    })

    lista.appendChild(crearTr(persona));
    const personas = traerPersonas();
    personas.push(persona);
    guardarPersonas(personas);

    mostrarInfo(persona);
    mostrarTarjetasPromedios()

};

//Guarda las personas en localStorage
const guardarPersonas = (personas) => localStorage.setItem("personas", JSON.stringify(personas));

//Funciones de promedios
const promedioEdad = () => {

    let promEdad = 0;
    const personas = traerPersonas();

    for (let i = 0; i < personas.length; i++) {
        promEdad += Number(personas[i].edad);
    }

    promEdad = promEdad / personas.length
    promEdad = promEdad.toFixed(2);

    return promEdad;
}
const promedioAltura = () => {

    let promAltura = 0;
    const personas = traerPersonas();

    for (let i = 0; i < personas.length; i++) {
        promAltura += Number(personas[i].altura);
    }

    promAltura = promAltura / personas.length
    promAltura = promAltura.toFixed(2);

    return promAltura;
}
const promedioPeso = () => {

    let promPeso = 0;
    const personas = traerPersonas();

    for (let i = 0; i < personas.length; i++) {
        promPeso += Number(personas[i].peso);
    }

    promPeso = promPeso / personas.length
    promPeso = promPeso.toFixed(2);

    return promPeso;
}
const promedioImc = () => {

    let promImc = 0;
    const personas = traerPersonas();

    for (let i = 0; i < personas.length; i++) {
        promImc += Number(personas[i].imc);
    }

    promImc = promImc / personas.length
    promImc = promImc.toFixed(2);

    return promImc;
}

//Borrar una persona del DOM y del local storage
const borrarPersona = (e) => {

    //Aprovecho la delegación de eventos. Sólo si la etiqueta es i hago algo, sino no hago nada
    if (e.target.tagName === "I") {

        //Remuevo del DOM al padre de la etiqueta i con todo lo que haya dentro
        e.target.parentElement.remove();
        //Traigo el array de localStorage
        let personas = traerPersonas();

        //Sobreescribo a la variable 'personas' con un nuevo array sin el elemento con un id particular
        personas = personas.filter(
            (persona) => persona.id !== parseFloat(e.target.parentElement.id)
        );

        //Guardo en localStorage el array sin ese objeto
        guardarPersonas(personas);
    }

    mostrarTarjetasPromedios()
    ocultarInfo();
};

//Funcion para calcular IMC
function calcularImc(peso, altura) {
    return peso / (altura * altura);
}

//Funcion para calcular la categoria de la persona
let calcularCategoria = (imc) => {

    if (imc > 0 && imc <= 18.5) {
        return `Bajo`;
    }

    if (imc > 18.5 && imc <= 24.9) {
        return `Normal`;
    }

    if (imc > 24.9 && imc <= 29.9) {
        return `Sobrepeso`;
    }

    if (imc >= 30) {
        return `Obeso`;
    }
}

//Mostrar info del ultimo ingresado
const mostrarInfo = (persona) => {

    //Info sobre persona ingresada
    imcActual = persona.imc;
    catActual = persona.categoria;
    textIMC = "Tu IMC: " + imcActual;
    textCAT = "Tu categoría: " + catActual;

    for (let i = 0; i < $(".imcActual").length; i++) {
        $(".imcActual")[i].textContent = textIMC;
        $(".catActual")[i].textContent = textCAT;
    }

    if (imcActual > 0 && imcActual <= 18.5) {
        document.querySelector(".imcInfo").classList.add('hide');
        document.querySelector(".inferior").classList.remove('hide');
        document.querySelector(".normal").classList.add('hide');
        document.querySelector(".sobrepeso").classList.add('hide');
        document.querySelector(".obeso").classList.add('hide');
    } else if (imcActual > 18.5 && imcActual <= 24.9) {
        document.querySelector(".imcInfo").classList.add('hide');
        document.querySelector(".inferior").classList.add('hide');
        document.querySelector(".normal").classList.remove('hide');
        document.querySelector(".sobrepeso").classList.add('hide');
        document.querySelector(".obeso").classList.add('hide');
    } else if (imcActual > 24.9 && imcActual <= 29.9) {
        document.querySelector(".imcInfo").classList.add('hide');
        document.querySelector(".inferior").classList.add('hide');
        document.querySelector(".normal").classList.add('hide');
        document.querySelector(".sobrepeso").classList.remove('hide');
        document.querySelector(".obeso").classList.add('hide');
    } else if (imcActual >= 30) {
        document.querySelector(".imcInfo").classList.add('hide');
        document.querySelector(".inferior").classList.add('hide');
        document.querySelector(".normal").classList.add('hide');
        document.querySelector(".sobrepeso").classList.add('hide');
        document.querySelector(".obeso").classList.remove('hide');
    } else {
        document.querySelector(".imcInfo").classList.remove('hide');
        document.querySelector(".inferior").classList.add('hide');
        document.querySelector(".normal").classList.add('hide');
        document.querySelector(".sobrepeso").classList.add('hide');
        document.querySelector(".obeso").classList.add('hide');
    }

}

//Ocultar info del ultimo ingresado
ocultarInfo = () => {
    document.querySelector(".imcInfo").classList.remove('hide');
    document.querySelector(".inferior").classList.add('hide');
    document.querySelector(".normal").classList.add('hide');
    document.querySelector(".sobrepeso").classList.add('hide');
    document.querySelector(".obeso").classList.add('hide');
}

//Muestra la info de las tarjetas
mostrarTarjetasPromedios = () => {

    if (promedioEdad() > 0) {
        document.querySelector("#promEdad").textContent = promedioEdad();
        document.querySelector("#promPeso").textContent = promedioPeso();
        document.querySelector("#promAltura").textContent = promedioAltura();
        document.querySelector("#promImc").textContent = promedioImc();
    } else {
        document.querySelector("#promEdad").textContent = "";
        document.querySelector("#promPeso").textContent = "";
        document.querySelector("#promAltura").textContent = "";
        document.querySelector("#promImc").textContent = "";
    }

}

//Al enviar el formulario
document.getElementById("form").addEventListener("submit", validarFormulario)

//Al borrar persona
lista.addEventListener("click", borrarPersona);

function validarFormulario(e) {

    e.preventDefault();
    e.stopPropagation();

    let nombre = document.getElementById('nombre').value.trim();
    let apellido = document.getElementById('apellido').value.trim();
    let edad = document.getElementById('edad').value.trim();
    let peso = document.getElementById('peso').value.trim();
    let altura = document.getElementById('altura').value.trim();
    let check = document.getElementById('invalidCheck').checked;

    if (nombre.length > 0 && apellido.length > 0 && edad > 0 && peso > 0 && altura > 0 && check == true) {
        camposCompletos()
        agregarPersona();
    } else {
        camposIncompletos()
        return;
    }

}

//Alertify
function camposCompletos() {
    alertify.success('Persona agregada')
}

function camposIncompletos() {
    alertify.error('Campos incorrectos')
}

//Formulario
(function() {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function(form) {
            form.addEventListener('submit', function(event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()

//Iniciar el script
mostrar();