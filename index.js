//Definimos la constante cookie para poder asociarle la función de hacer click más adelante

const cookie = document.querySelector("#cookie")
const autoClick = document.querySelector("#auto-click");
const autoClickTextprice = document.querySelector("#auto-click .price span");

//Definimos las variables title y score para poder modificar el texto, tanto del título en la ventana de navegación como en el propio score en el centro de la pantalla

const updateScore = cookies => {
    const title = document.querySelector("title")
    const score = document.querySelector("#score span")

    score.innerText = cookies;
    title.innerHTML = cookies + " cookies - Cookie Clicker"

    localStorage.setItem("cookies", cookies); //Almacenamos en localStorage para que guarde las cookies incluso si se cierra el navegador
}

const updatePowerupsStorage = powerup => {
    let powerups = JSON.parse(localStorage.getItem("powerups")) || [];
    powerups.push(powerup);

    localStorage.setItem("powerups", JSON.stringify(powerups));
}

const getStorage = () => {
    const cookies = localStorage.getItem("cookies") || 0; //Obtiene el número de cookies del localStorage, y si no existe (es null) lo inicializa con 0
    const powerups = JSON.parse(localStorage.getItem("powerups")) || []; //Obtiene el JSON (porque es un array y necesita JSON) de powerups y si no existe, crea un array vacío


    //Almacenamos ambas variables, cookies y powerups, dentro de una única storage como dos cadenas de texto separadas por una coma
    const storage = {
        "cookies": cookies,
        "powerups": powerups
    }

    return storage;
}

//Vamos a definir la función de hacer click en la galleta

const cookieClicked = cookies => {
    const storage = getStorage(); //Cogemos la cantidad que haya guardada en el navegador

    const score = document.querySelector("#score span"); //Le decimos que vaya al número de cookies del centro de la pantalla
    const scoreValue = cookies ? cookies : parseInt(score.innerText); //la convertimos en un Int para poder sumar números
    let newScore;

    newScore = scoreValue + 1; //newScore añade 1 al valor actual cada vez que se llama

    updateScore(newScore); //Devuelve el valor de la función updateScore con el valor newScore
}

const createParticle = (x,y) => {
    const cookieClicks = document.querySelector(".cookie-clicks");

    const offsetX = Math.random() * 40 - 20; // Aleatorio entre -20px y 20px
    const offsetY = Math.random() * 40 - 20; // Aleatorio entre -20px y 20px

    const particle = document.createElement("img");
    particle.setAttribute("src","img/cookie.png");
    particle.setAttribute("class", "cookie-particle");
    particle.style.left = (x + offsetX) + "px";
    particle.style.top = (y + offsetY) + "px";

    cookieClicks.appendChild(particle);


    setTimeout(() => {
        cookieClicks.removeChild(particle);
    }, 3000);
}

//Creamos la función para que ocurra algo cuando hacemos click
cookie.addEventListener("click", (e) => {
    createParticle(e.clientX, e.clientY);
    cookieClicked() //En este caso, ocurre la función cookieClicked
});

const autoClickCookie = () => {
    setInterval(() => {
        const score = document.querySelector("#score span");
        const scoreValue = parseInt(score.innerText);

        newScore = scoreValue + 1;

        updateScore(newScore);
    }, 1000)
}

autoClick.addEventListener("click", () => {
    const price = autoClick.getAttribute("data-price");
    const score = document.querySelector("#score span");
    const scoreValue = parseInt(score.innerText)

    if (scoreValue >= price) {
        updatePowerupsStorage("auto-click");

        const storage = getStorage();
        const quantAutoClicks = storage.powerups.filter(powerup => powerup == "auto-click").length;

        const newScore = scoreValue - price;

        updateScore(newScore)

        if (quantAutoClicks == 1) {
            autoClick.setAttribute("data-price", 100 * 2);
            autoClickTextprice.innerHTML=100 * 2;
        } else {
            autoClick.setAttribute("data-price", 100 * (quantAutoClicks + 1));
            autoClickTextprice.innerHTML=100 * (quantAutoClicks + 1);
        }

        document.querySelector(".auto-clicks").classList.remove("disable");

        document.querySelector(".auto-clicks .cursors").innerHTML += '<img src="img/cursor.png" alt="cursor" id="cursor" class="cursor auto">'

        autoClickCookie();
    }else {
        autoClick.classList.add("invalid")
        setTimeout(() => {
            autoClick.classList.remove("invalid")
        }, 300);
    }
})