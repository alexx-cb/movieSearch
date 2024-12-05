var peticionEnCurso = false;
var pagina =1;
var busqueda ="";
var tipo ="";
var peliculasArray = [];
var btnInforme = "";

window.onload = () => {
    const btnBuscar = document.getElementById("btnBuscador");
    const lista = document.getElementById("buscadas");
    const result = document.getElementById("resultados");
    btnInforme = document.getElementById("informe");
    window.cargando = document.querySelector(".cargando");

    //Buscar pelicula
    btnBuscar.addEventListener("click", () => {
        busqueda = document.getElementById("buscador").value.trim();
        tipo = document.getElementById("tipo").value;
        pagina = 1; 
        lista.innerHTML = ""; 
        result.innerHTML = "";
        peticionModerna();
    });


    // Inicialmente ocultamos el botón de informe
    btnInforme.style.display = "none";
    btnInforme.disabled = true;


     // Petición al presionar Enter en el input o al hacer hover/focus y pulsar Enter
     document.getElementById("buscador").addEventListener("keydown", (e) => {
        if ((e.key === "Enter") && (document.getElementById("buscador") === document.activeElement || e.target.matches(":hover"))) {
            e.preventDefault();
            btnBuscar.click();
        }
    });


    btnInforme.addEventListener("click",informe);

    //Scroll infinito
    window.addEventListener("scroll", () => {
        const endOfPage = window.innerHeight + window.scrollY >= document.body.offsetHeight - 550;
        if (endOfPage && !peticionEnCurso) {
            peticionModerna();
        }
    });


    // Si se hace click fuera
    document.body.addEventListener("click", (e) => {
        if (e.target.classList.contains("cerrar")) {
            const contenedor = e.target.closest(".contenedor");
            if (contenedor){
                contenedor.remove();
            } 
        }
    });

};

function peticionModerna() {
    if (peticionEnCurso || !busqueda) return; // Evita peticiones múltiples o vacías
    peticionEnCurso = true;

    window.cargando.style.display="flex";

    fetch("http://www.omdbapi.com/?apikey=74542ddb&s=" + busqueda + "&page=" + pagina + "&type="+tipo, { method: "GET" })
        .then((res) => res.json())
        .then((datosRecibidos) => {
            pagina++;

            peliculasArray.push(datosRecibidos);
            
            console.log(datosRecibidos);

            const result = document.getElementById("resultados");
            result.innerText = "Resultados encontrados de '" +  busqueda.toLocaleUpperCase() + "' : " + datosRecibidos.totalResults;

            const lista = document.getElementById("buscadas");
            datosRecibidos.Search.forEach((item) => {
                
                // Contenedor principal para la película
                let contenedorPelicula = document.createElement("div");
                contenedorPelicula.className = "contenedorPelicula";

                // Contenedor para la imagen
                let contenedorImagen = document.createElement("div");
                contenedorImagen.className = "contenedorImagen";

                let imagen = document.createElement("img");
                imagen.src = item.Poster;
                imagen.alt = item.Title;

                // Imagen por defecto si no se encuentra la normal
                imagen.addEventListener("error", (e) => {
                    e.target.src = "img/imagenError.jpg";
                });

                imagen.idPelicula = item.imdbID;

                // Mostrar más detalles al hacer click en la imagen
                imagen.addEventListener("click", masDatos);

                let contenedorTexto = document.createElement("div");
                contenedorTexto.className = "contenedorTexto";

                // Título y año de la película
                let tituloAnio = document.createElement("p");
                tituloAnio.className = "titulo";
                tituloAnio.innerText = item.Title+ " - "+item.Year;

                contenedorImagen.appendChild(imagen);
                contenedorPelicula.appendChild(contenedorImagen);

                contenedorTexto.appendChild(tituloAnio);

                contenedorPelicula.appendChild(contenedorTexto);

                lista.appendChild(contenedorPelicula);
            });


            btnInforme.style.display = "block";
            btnInforme.disabled = false;

            peticionEnCurso = false;
            window.cargando.style.display ="none";
        })
        .catch((err) => {
            console.error("Error en la solicitud:", err);
            peticionEnCurso = false;
            cargando.style.display ="none";
        });
}


function masDatos(e) {
    e.target.idPelicula;
    window.cargando.style.display="flex";
    url = "http://www.omdbapi.com/?apikey=74542ddb&i=" + e.target.idPelicula;

    fetch(url, { method: "GET" })
        .then((res) => res.json())
        .then((datosRecibidos) => {
            console.log(datosRecibidos);

            const overlay = document.createElement("div");
            overlay.className = "overlay";

            const contenedor = document.createElement("div");
            contenedor.className = "contenedor";

            const titulo = document.createElement("p");
            titulo.className = "tituloDatos";
            titulo.innerText = "Title: " + datosRecibidos.Title;

            const autor = document.createElement("p");
            autor.className = "autor";
            autor.innerText = "Director: " + datosRecibidos.Director;

            const genero = document.createElement("p");
            genero.className ="genero";
            genero.innerText = "Genre: " + datosRecibidos.Genre;

            const fecha = document.createElement("p");
            fecha.className = "fecha";
            fecha.innerText = "Released date: " + datosRecibidos.Released;

            const duracion = document.createElement("p");
            duracion.className = "duracion";
            duracion.innerText = "Run time: " + datosRecibidos.Runtime;

            const ingresos = document.createElement("p");
            ingresos.className = "ingresos";
            ingresos.innerText = "Earnings: " + datosRecibidos.BoxOffice;

            const descripcion = document.createElement("p");
            descripcion.className = "descripcion";
            descripcion.innerText = "Plot: " + datosRecibidos.Plot;

            const imagenDatos = document.createElement("img");
            imagenDatos.className = "imagenDatos";
            imagenDatos.src = datosRecibidos.Poster;

            const cerrar = document.createElement("button");
            cerrar.className = "cerrar";
            cerrar.innerText = "X";

            cerrar.addEventListener("click", () => {
                overlay.remove();
                document.body.style.overflow = ""; // Habilitar scroll de la página principal
            });

            overlay.addEventListener("click", (event) => {
                if (!contenedor.contains(event.target)) {
                    overlay.remove();
                    document.body.style.overflow = ""; // Habilitar scroll de la página principal
                }
            });

            contenedor.appendChild(imagenDatos);
            contenedor.appendChild(titulo);
            contenedor.appendChild(autor);
            contenedor.appendChild(genero);
            contenedor.appendChild(fecha);
            contenedor.appendChild(duracion);
            contenedor.appendChild(descripcion);
            contenedor.appendChild(ingresos);
            contenedor.appendChild(cerrar);

            overlay.appendChild(contenedor);
            document.body.appendChild(overlay);

            // Deshabilitar scroll de la página principal
            document.body.style.overflow = "hidden";
            
            window.cargando.style.display="none";
        })
        .catch((err) => console.error("Error:", err));
        window.cargando.style.display="none";
}

function informe() {
    // Crear el overlay
    const overlay = document.createElement("div");
    overlay.className = "overlay";

    const contenedorInforme = document.createElement("div");
    contenedorInforme.className = "contenedorInforme";

    // Subcontenedor para las películas
    const subcontenedorPeliculas = document.createElement("div");
    subcontenedorPeliculas.className = "subcontenedorPeliculas";
    contenedorInforme.appendChild(subcontenedorPeliculas);

    const tituloInforme = document.createElement("h2");
    tituloInforme.innerText = "Top 5 Películas por Rating";
    subcontenedorPeliculas.appendChild(tituloInforme);

    // Array para almacenar las películas detalladas
    const mejoresPeliculas = [];

    // Procesar directamente el contenido de peliculasArray
    peliculasArray.forEach((pagina) => {
        if (pagina.Search) {
            pagina.Search.forEach((pelicula) => {
                // Solicitar detalles completos de cada película
                fetch("http://www.omdbapi.com/?apikey=74542ddb&i=" + pelicula.imdbID)
                    .then((res) => res.json())
                    .then((detalle) => {
                        if (detalle.imdbRating) {
                            mejoresPeliculas.push({
                                Title: detalle.Title,
                                imdbRating: detalle.imdbRating,
                            });

                            // Ordenar y mostrar las 5 mejores películas después de recibir los detalles
                            mejoresPeliculas.sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating));
                            const top5 = mejoresPeliculas.slice(0, 5);

                            // Limpiar contenido existente y agregar las mejores películas
                            subcontenedorPeliculas.querySelectorAll(".peliculaInforme").forEach((nodo) => nodo.remove());
                            top5.forEach((pelicula) => {
                                const peliculaDiv = document.createElement("div");
                                peliculaDiv.className = "peliculaInforme";

                                const titulo = document.createElement("p");
                                titulo.className = "titulo";
                                titulo.innerText = "Título: " + pelicula.Title;

                                const rating = document.createElement("p");
                                rating.className = "rating";
                                rating.innerText = "Rating: " + pelicula.imdbRating;

                                peliculaDiv.appendChild(titulo);
                                peliculaDiv.appendChild(rating);

                                subcontenedorPeliculas.appendChild(peliculaDiv);
                            });

                            // Actualizar el gráfico con los nombres y ratings
                            const data = google.visualization.arrayToDataTable([
                                ["Película", "Rating", { role: "style" }],
                                ...top5.map(pelicula => [pelicula.Title, parseFloat(pelicula.imdbRating), "color: #348e91"]) // Asignar colores a las barras
                            ]);

                            var options = {
                                title: "Top 5 Películas por Rating",
                                width: '100%',
                                height: 400,
                                bar: { groupWidth: "95%" },
                                legend: { position: "none" },
                            };

                            var chart = new google.visualization.ColumnChart(contenedorGrafico);
                            chart.draw(data, options);
                        }
                    })
                    .catch((err) => console.error("Error al obtener detalles de película:", err));
            });
        }
    });

    // Botón para cerrar el informe
    const cerrar = document.createElement("button");
    cerrar.className = "cerrar";
    cerrar.innerText = "X";

    cerrar.addEventListener("click", () => {
        overlay.remove();
        document.body.style.overflow = ""; // Habilitar scroll de la página principal
    });

    overlay.addEventListener("click", (event) => {
        if (!contenedorInforme.contains(event.target)) {
            overlay.remove();
            document.body.style.overflow = ""; // Habilitar scroll de la página principal
        }
    });

    contenedorInforme.appendChild(cerrar);

    // Contenedor para el gráfico
    const contenedorGrafico = document.createElement("div");
    contenedorGrafico.className = "contenedorGrafico";
    contenedorInforme.appendChild(contenedorGrafico);

    overlay.appendChild(contenedorInforme);
    document.body.appendChild(overlay);

    // Deshabilitar scroll de la página principal
    document.body.style.overflow = "hidden";

    // Carga del gráfico
    const scriptGoogleCharts = document.createElement("script");
    scriptGoogleCharts.type = "text/javascript";
    scriptGoogleCharts.src = "https://www.gstatic.com/charts/loader.js";
    document.body.appendChild(scriptGoogleCharts);

    scriptGoogleCharts.onload = () => {
        google.charts.load("current", { packages: ["corechart"] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            // El gráfico se actualizará con los valores de las mejores películas (de las 5 mejores)
            const data = google.visualization.arrayToDataTable([
                ["Película", "Rating", { role: "style" }],
                ...mejoresPeliculas.slice(0, 5).map(pelicula => [pelicula.Title, parseFloat(pelicula.imdbRating), "color: #76A7FA"])
            ]);

            var options = {
                title: "Top 5 Películas por Rating",
                width: '100%',
                height: 400,
                bar: { groupWidth: "95%" },
                legend: { position: "none" },
            };

            var chart = new google.visualization.ColumnChart(contenedorGrafico);
            chart.draw(data, options);
        }
    };
}