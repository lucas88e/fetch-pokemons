// Coded by Lucas and Adrian Giner
const search = document.getElementById("searchBtn")
const searchBtn = document.getElementById("searchInput")
const prevBtn = document.getElementById("prevBtn")
const nextBtn = document.getElementById("nextBtn")
const resetBtn = document.getElementById("resetBtn")
const contendorApp =document.getElementById("app")
const favsBtn = document.getElementById("favsBtn");

prevBtn.addEventListener("click", ()=>{
    if( offset > 1){
        offset -= 10;
        getPokes();
    }
})

nextBtn.addEventListener("click", ()=>{
    if( offset < 1041){
        offset += 10
        getPokes()        
    }
})

resetBtn.addEventListener("click", ()=>{
    contendorApp.innerHTML=""
    location.reload()
})

search.addEventListener("click", ()=>{
    let toSearch = searchBtn.value;
    toSearch = toSearch.toLowerCase();

    if (toSearch !== ""){
        getPokes(toSearch);
    }
})

favsBtn.addEventListener('click', () => {
    window.location.href = 'pokeFavs.html';
})



let offset = 0;


setLocalStorageData();
getPokes();

function setLocalStorageData() {
    if (localStorage.getItem('favs') === null) {
        localStorage.setItem('favs', JSON.stringify([]));
    }
 
    const values = JSON.parse(localStorage.getItem('favs'));
}

function getPokes(searchValue) {
    let pokes = [];

    let link = "";
    
    if (searchValue === "" || searchValue === undefined) {
        link = `https://pokeapi.co/api/v2/pokemon/?limit=10&offset=${offset}`;
    } else {
        link = `https://pokeapi.co/api/v2/pokemon/${searchValue}`;
    }

    fetch(link)
    .then((response) => {
        if(!response.ok) {
            if (searchValue === "" || searchValue === undefined) {            
                console.log('error al buscar pokemons' + resetBtn.status);
            } else {
                contendorApp.innerHTML = `
                <div>
                    <p class='warning__text'>Pokemon "${searchValue}" no encontrado.</p>
                </div>`
            }
        } else {
            return response.json();
        }
    })
    .then((data) => {
        if(data.results) {
            pokes = data.results;
            showPokes(pokes);
        } else {
            poke = data;
            showSearchPoke(poke);
        }
    })
    .catch((error) => {
        console.log('Error en el fetch' + error);
    })
}

function showPokes(pokes) {
    const list = document.createElement('ul');
    list.className = 'poke__list';

    contendorApp.innerHTML = ''; // Para limpiar el DOM.
    contendorApp.appendChild(list);

    pokes.forEach((poke) => {
        const pokeCard = document.createElement('li');
        pokeCard.className = 'poke__card';

        checkFavs(poke, pokeCard);

        const pokeName = document.createElement('p');
        pokeName.className = 'poke__name';

        getPokeSprites(poke, pokeCard);

        let pokeNameText = poke.name;
        pokeNameText = pokeNameText.charAt(0).toUpperCase() + pokeNameText.slice(1); // Para poner en mayuscula la primera letra del nombre
        pokeName.textContent = pokeNameText;

        pokeCard.appendChild(pokeName);
        list.appendChild(pokeCard);
    })
}

function getPokeSprites(pokes, domCard) {
    const pokeSprite = document.createElement('img');
    pokeSprite.className = 'poke__sprite';

    fetch(pokes.url)
    .then((response) => {
        if(!response.ok) {
            console.log('error al buscar dentro del pokemon' + response.status)
        } else {
            return response.json();
        }
    })
    .then((data) => {
        const imagen = data.sprites.other.home.front_default;
        pokeSprite.src = imagen;
        domCard.append(pokeSprite);
    })
}

function showSearchPoke(poke) {
    const list = document.createElement('ul');
    list.className = 'poke__list';

    const pokeCard = document.createElement('li');
    pokeCard.className = 'poke__card';

    contendorApp.innerHTML = ''; // Para limpiar el DOM.
    contendorApp.appendChild(list);

    checkFavs(poke, pokeCard);

    const pokeName = document.createElement('p');
    pokeName.className = 'poke__name';

    let pokeNameText = poke.name;
    pokeName.textContent = pokeNameText.charAt(0).toUpperCase() + pokeNameText.slice(1);

    const pokeSprite = document.createElement('img');
    pokeSprite.className = 'poke__sprite';

    pokeSprite.src = poke.sprites.other.home.front_default;

    pokeCard.append(pokeName, pokeSprite);
    list.appendChild(pokeCard);
}

function info(){
    const modal = document.querySelector("#modal");
    modal.innerHTML =pokeSprite
    modal.show()
    
}

function checkFavs(poke, DOMref) {
    let pokeFav;

    let favs = localStorage.getItem('favs');
    favs = JSON.parse(favs);

    if (favs.includes(poke.name)) {
        pokeFav = true;
        DOMref.style.border = '2px solid goldenrod';
    } else {
        pokeFav = false;
    }

    DOMref.addEventListener('click', () => {
        if(!pokeFav) {
            DOMref.style.border = '2px solid goldenrod';

            let favs = localStorage.getItem('favs');
            favs = JSON.parse(favs);

            let newFavs = [...favs, poke.name];

            newFavs = JSON.stringify(newFavs);
            localStorage.setItem('favs', newFavs);

            pokeFav = true;
        } else {
            DOMref.style.border = '2px solid gray';

            let favs = localStorage.getItem('favs');
            favs = JSON.parse(favs);

            favs = favs.filter((val) => val !== poke.name);

            favs = JSON.stringify(favs);

            localStorage.setItem('favs', favs);

            pokeFav = false;
        }
    })
}
