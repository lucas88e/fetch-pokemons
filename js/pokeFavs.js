// Coded by Lucas and Adrian Giner
const backButon = document.getElementById('backBtn');
const contendorApp =document.getElementById("app");

backButon.addEventListener('click', () => {
    window.location.href = 'index.html';
})

getPokes();

function getPokes() {
    let pokes = localStorage.getItem('favs');
    pokes = JSON.parse(pokes);

    if (pokes !== "") {
        const list = document.createElement('ul');
        list.className = 'poke__list';

        contendorApp.innerHTML = ''; // Para limpiar el DOM.
        contendorApp.appendChild(list);

        pokes.forEach(poke => {
            const link = `https://pokeapi.co/api/v2/pokemon/${poke}`;
            fetch(link)
            .then((response) => {
                if (!response.ok) {
                    console.log('Error en el fetch', response.status);    
                } else {
                    return response.json();
                }
            })
            .then((data) => {
                showPokes(data);
            })
            .catch((error) => {
                console.log('error', error)
            })            
        });

        function showPokes(poke){
            const pokeCard = document.createElement('li');
            pokeCard.className = 'poke__card';

            const pokeName = document.createElement('p');
            pokeName.className = 'poke__name';

            let pokeNameText = poke.name;
            pokeName.textContent = pokeNameText.charAt(0).toUpperCase() + pokeNameText.slice(1);

            const pokeSprite = document.createElement('img');
            pokeSprite.className = 'poke__sprite';

            pokeSprite.src = poke.sprites.other.home.front_default;

            pokeCard.append(pokeName, pokeSprite);
            list.appendChild(pokeCard);

            pokeCard.addEventListener('click', () => {
                let pokes = localStorage.getItem('favs');
                pokes = JSON.parse(pokes);
    
                pokes = pokes.filter((val) => val !== poke.name);
    
                pokes = JSON.stringify(pokes);
    
                localStorage.setItem('favs', pokes);

                location.reload();
            })
        }
    }
}