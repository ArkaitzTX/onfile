const onfile = (function () {
    // Todo: Variables globales
    let union = "\n";
    let zipPromesa = Promise.resolve();
    // Todo: Funciones privadas
    function comprobarTipo(archivo) {
        return archivo.some((contenido) =>
            Array.isArray(contenido)
        );
    }

    function buscarContenido() {

    }

    function directorio(archivo) {
        
    }

    function documento(archivo) {
        return archivo.length === 1 
            // archivo entero(get) 
            ? fetch(archivo[0]).then((data) => {
                return {
                    nombre: (archivo[0].includes("/")) ? archivo[0].split("/").pop() : archivo[0],
                    blob: data.blob()
                }
            }) 
            // archivo creado(create)
            : new Promise((resultado) => {
                resultado({
                    nombre: "",
                    blob: new Blob([])
                })
            });
    }
    // Todo: Funciones publicas
    return {
        join: function (dato) {
            union = dato ?? union;
        },
        importZip: function () {
            zipPromesa = new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js';
                script.onload = resolve;
                document.head.appendChild(script);
            });
        },
        name: function (clase, funcion) {
            // busca la clase
            // le añada la funcion
        },
        create: async function (...archivos) {
            await zipPromesa;

            // variables
            let directa = (typeof archivos.slice(-1)[0] === "boolean") ? archivos.pop() : true;
            // recoge toda la informacion
            archivos = archivos.map((archivo) => {
                // tipo de archivo
                return (comprobarTipo(archivo)) ?
                    directorio(archivo) :
                    documento(archivo);

            })
            // descargar o devolver archivos
            archivos.forEach(archivo => {
                archivo.then(descargable => {
                        console.log(descargable);
                        const link = document.createElement('a');

                        link.href = window.URL.createObjectURL(descargable.blob.url);
                        link.download = descargable.nombre;
                        link.click();

                        window.URL.revokeObjectURL(url);
                    }

                );
            });
        }
    };
})();