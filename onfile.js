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
    async function crearContenido(contenido) {
        const val = /^(?:\/?[a-zA-Z0-9_-]+)+\.[a-zA-Z]{2,}$/gm;
        contenido = await Promise.all(contenido.map((elemento) => 
            (val.test(elemento)) 
                ? fetch(elemento).then(response => response.text())
                : Promise.resolve(elemento)
        ));

        //! Terminar la promesa
        return [contenido.join(union)];
    }
    function directorio(archivo) {
        
    }
    async function documento(archivo) {
        return archivo.length === 1 
            // archivo entero(get) 
            ? {
                nombre: (archivo[0].includes("/")) ? archivo[0].split("/").pop() : archivo[0],
                url: archivo[0]
            }
            // archivo creado(create)
            : (() => {
                const[nombre, ...contenido] = archivo;
                return crearContenido(contenido).then((resultado) => ({
                    nombre: nombre,
                    url: window.URL.createObjectURL(new Blob(resultado)),
                }));
            })();
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
            archivos = Promise.all( archivos.map((archivo) => {
                // tipo de archivo
                return (comprobarTipo(archivo)) ?
                    directorio(archivo) :
                    documento(archivo);

            }))
            if (directa) {
                archivos.then((archivos) => {
                    archivos.forEach(descargable => {
                        // descarga el link
                        const link = document.createElement('a');
        
                        link.href = descargable.url;
                        link.download = descargable.nombre;
                        link.click();
        
                        window.URL.revokeObjectURL(descargable.url);
                    })
                });
                return;
            }

            return archivos;
        }
    };
})();