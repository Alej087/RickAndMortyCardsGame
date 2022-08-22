window.addEventListener("load", async (e) => {
    const levelEasy = document.getElementById("easy");
    const levelMedium = document.getElementById("medium");
    const levelHard = document.getElementById("hard");
    const endpoint = "https://rickandmortyapi.com/api/character?page=";
    const maximunPages = 42;

    levelEasy.addEventListener("click", easyLevel);
    levelMedium.addEventListener("click", mediumLevel);
    levelHard.addEventListener("click", hardLevel);

    async function getInfoFromEndpoint(endpoint) {
        return fetch(endpoint)
            .then((response) => response.json())
            .then((response) => response);
    }

    async function getCharactersByEachPage(i) {
        return fetch(`${endpoint}${i}`)
            .then((response) => response.json())
            .then(({ results }) => results);
    }

    async function getCharactersAndEpisodesData(data) {
        const characters = data.flat();
        const episodesEndpoints = new Set(
            characters.map(({ episode }) => episode).flat()
        );
        const episodesPromises = Array.from(episodesEndpoints).map((episode) =>
            getInfoFromEndpoint(episode)
        );
        const episodesData = await Promise.all(episodesPromises);
        const episodes = episodesData.reduce(
            (adapter, episode, currentIndex, array) => {
                adapter[episode.url] = episode;
                return adapter;
            },
            {}
        );

        return characters.map((character, index) => {
            character["episode"] = character.episode.map(
                (episode) => episodes[episode]
            );
            return character;
        });
    }

    async function getCharacters() {
        const charactersEndpoints = [];
        for (let i = 0; i < maximunPages; i++) {
            charactersEndpoints.push(getCharactersByEachPage(i));
        }
        const characters = getCharactersAndEpisodesData(
            await Promise.all(charactersEndpoints)
        );
        return characters;
    }

    const characters = await getCharacters();
    const charactersCardsInfo = [];
    for (let i = 0; i < characters.length; i++) {
        charactersCardsInfo.push({
            name: characters[i].name,
            gender: characters[i].gender,
            specie: characters[i].species,
            urlImage: characters[i].image,
        });
    }
    console.log(charactersCardsInfo);

    function shuffle(characters) {
        let currentIndex = characters.length,
            randomIndex;
        while (currentIndex > 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [characters[currentIndex], characters[randomIndex]] = [
                characters[randomIndex],
                characters[currentIndex],
            ];
        }
        return characters;
    }

    function generateCards(quantityCards) {
        const panel = document.querySelector(".table");
        shuffle(charactersCardsInfo);
        if (panel.hasChildNodes() || !panel.hasChildNodes()) {
            panel.innerHTML = "";
            for (let i = 0; i < quantityCards / 2; i++) {
                for (let j = 0; j < 2; j++) {
                    let card = document.createElement("div");
                    let cardImage = document.createElement("img");
                    cardImage.setAttribute(
                        "src",
                        charactersCardsInfo[j].urlImage
                    );
                    card.appendChild(cardImage);
                    card.classList.add("table-cards");
                    let cardTittle = document.createElement("h3");
                    let tittle = document.createElement("p");
                    let infoTittle = document.createTextNode(
                        charactersCardsInfo[j].name
                    );
                    let info = document.createTextNode(
                        `${charactersCardsInfo[j].gender} - ${charactersCardsInfo[j].specie}`
                    );
                    tittle.appendChild(infoTittle);
                    card.appendChild(tittle);
                    cardTittle.appendChild(info);
                    card.appendChild(cardTittle);
                    panel.appendChild(card);
                }
            }
            //un ramdon para primero escoger las fch¿ichas -->OK , y el otro luego para el orden. Adicional hacer que salgan solo 2 tarjetas por personaje
        }
    }
    function easyLevel() {
        generateCards(4);
    }
    function mediumLevel() {
        generateCards(6);
    }
    function hardLevel() {
        generateCards(8);
    }
});
