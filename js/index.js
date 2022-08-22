window.addEventListener("load", (e) => {
    const levelEasy = document.getElementById("easy");
    const levelMedium = document.getElementById("medium");
    const levelHard = document.getElementById("hard");

    levelEasy.addEventListener("click", easyLevel);
    levelMedium.addEventListener("click", mediumLevel);
    levelHard.addEventListener("click", hardLevel);

    const characters = [
        "../images/britney1.jpeg",
        "../images/britney2.jpeg",
        "../images/britney1.jpeg",
        "../images/britney2.jpeg",
        "../images/britney3.jpg",
        "../images/britney3.jpg",
        "../images/britney4.jpeg",
        "../images/britney4.jpeg",
    ];

    function generateCards(quantityCards) {
        const panel = document.querySelector(".panel-images");
        if (panel.hasChildNodes() || !panel.hasChildNodes()) {
            panel.innerHTML = "";
            for (let i = 0; i < quantityCards; i++) {
                let cardImage = document.createElement("img");
                cardImage.setAttribute("src", characters[i]);
                panel.appendChild(cardImage);
            }
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
