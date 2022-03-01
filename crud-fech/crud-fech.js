// This api reads the data from a jsom file, and renders it to the html . can be edited and deleted.

// Selecting the DOM elements
const d = document,
    $table = d.querySelector(".crud-table"),
    $form = d.querySelector(".crud-form"),
    $title = d.querySelector(".crud-title"),
    $template = d.getElementById("crud-template").content,
    $fragmet = d.createDocumentFragment();


// asynchronously reading data from json file
const getAll = async() => {
    try {
        let res = await fetch("http://localhost:5000/santos"),
            json = await res.json();
        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        console.log(json);

        json.forEach(el => {
            $template.querySelector(".name").textContent = el.nombre;
            $template.querySelector(".constellation").textContent = el.constelacion;
            $template.querySelector(".edit").dataset.id = el.id;
            $template.querySelector(".edit").dataset.name = el.nombre;
            $template.querySelector(".edit").dataset.constellation = el.constelacion;
            $template.querySelector(".delete").dataset.id = el.id;

            let $clone = d.importNode($template, true);
            $fragmet.appendChild($clone)
        });
        $table.querySelector("tbody").appendChild($fragmet)

    } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
    }
}

d.addEventListener("DOMContentLoaded", getAll);

//Assigning the listener to the document and delegating the event to the element is very useful.
d.addEventListener("submit", async e => {
    if (e.target === $form) {
        e.preventDefault();

        if (!e.target.id.value) {
            //Create POST
            try {
                let options = {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json; charset=utf-8"
                        },
                        body: JSON.stringify({
                            nombre: e.target.nombre.value,
                            constelacion: e.target.constelacion.value
                        })
                    },
                    res = await fetch("http://localhost:5000/santos", options),
                    json = await res.json();

                if (!res.ok) throw { status: res.status, statusText: res.statusText };

                location.reload();

            } catch (err) {

                let message = err.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
            }
        } else {
            //Update PUT
            try {
                let options = {
                        method: "PUT",
                        headers: {
                            "Content-type": "application/json; charset=utf-8"
                        },
                        body: JSON.stringify({
                            nombre: e.target.nombre.value,
                            constelacion: e.target.constelacion.value
                        })
                    },
                    res = await fetch(`http://localhost:5000/santos/${e.target.id.value}`, options),
                    json = await res.json();

                location.reload();
                if (!res.ok) throw { status: res.status, statusText: res.statusText };

            } catch (err) {

                let message = err.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
            }
        }
    }
})

//function that adds the elements to the form to edit it
d.addEventListener("click", async e => {
    if (e.target.matches(".edit")) {
        $title.textContent = "Editar Santos";
        $form.nombre.value = e.target.dataset.name;
        $form.constelacion.value = e.target.dataset.constellation;
        $form.id.value = e.target.dataset.id;
    };

    //function that is responsible for eliminating the elements
    if (e.target.matches(".delete")) {
        let isDelete = confirm(`Quieres eliminar el id ${e.target.dataset.id} ?`);

        if (isDelete) {
            //Delete- DELETE
            try {
                let options = {
                        method: "DELETE",
                        headers: {
                            "Content-type": "application/json; charset=utf-8"
                        }
                    },
                    res = await fetch(`http://localhost:5000/santos/${e.target.dataset.id}`, options),
                    json = await res.json();


                if (!res.ok) throw { status: res.status, statusText: res.statusText };
                location.reload();

            } catch (err) {

                let message = err.statusText || "Ocurrió un error";
                alert(`${err.status}: ${message}`);
            }
        }
    };
});