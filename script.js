//Get Dom Elements
const resultElement = document.getElementById("result");
const pokemonImageElement = document.getElementById("pokemonImage");
const optionsContainer = document.getElementById("options");
const pointsElement = document.getElementById("pointsValue");
const totalCount = document.getElementById("totalCount");
const mainContainer = document.getElementsByClassName("container");
const loadingContainer = document.getElementById("loadingContainer");

//Variables
let usedPokemonId = [];
let count = 0;
let points = 0;
let showLoading = false;

// Creating fetch functions
async function fetchPokemonById(id) {
    showLoading = true;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    return data;
}

// //Create test
// async function testFetch() {
//     const pokemon = await fetchPokemonById(getRandomPokemonId());
//     console.log(pokemon);
    
// }

// //test call
// testFetch();

//Load question with options
async function loadQuestionWithOptions() {
    if(showLoading) {
        showLoadingWindow();
        hidePuzzleWindow();
    }
    //fetch answer
    let pokemonId = getRandomPokemonId();

    //Check if pokemon used
    while(usedPokemonId.includes(pokemonId)){
        pokemonId = getRandomPokemonId();
    }

    //If not displayed, add to used id and set.
    usedPokemonId.push(pokemonId);
    const pokemon = await fetchPokemonById(pokemonId);

    //Create options
    const options = [pokemon.species.name];
    const optionsIds = [pokemon.id];

    //get other options for answers.
    while(options.length < 4){
        //Loop until getting 3 other unique pokemon
        let randomPokemonId = getRandomPokemonId();
        while(optionsIds.includes(randomPokemonId)){
            randomPokemonId = getRandomPokemonId();
            
        }
        optionsIds.push(randomPokemonId);

        const randomPokemon = await fetchPokemonById(randomPokemonId);
        const randomOption = randomPokemon.species.name;
        options.push(randomOption);

        console.log(options);
        console.log(optionsIds);

        //turn off loading
        if(options.length === 4) {
            showLoading = false;
        }
    }

    shuffleArray(options);

    //Clear previous result and update image
    resultElement.textContent = "Who's That Pokemon?";
    pokemonImageElement.src = pokemon.sprites.other['official-artwork'].front_default;

    //Create html elements 
    optionsContainer.innerHTML = "";
    options.forEach((option) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = (event) => checkAnswer(option === pokemon.species.name, event);
        optionsContainer.appendChild(button);
    });

    if(!showLoading) {
        hideLoadingWindow();
        showPuzzleWindow();
    }
}

loadQuestionWithOptions();

//Check Answer
function checkAnswer(isCorrect, event) {
    let old_backgroud = document.body.style.background;
    const selectedButton = document.querySelector(".selected");

    if (selectedButton) {
        return;
    }

    event.target.classList.add("selected");
    count++;
    totalCount.textContent = count;

    if(isCorrect) {
        displayResult("Correct Answer!", "correct");
        points++;
        pointsElement.textContent = points;
        event.target.classList.add("correct");
        document.body.style.background = "#5aae76";
    }else{
        displayResult("Wrong Answer...", "wrong");
        event.target.classList.add("wrong");
        document.body.style.background = "#e13e3e";
    }

    //load next question
    setTimeout(() => {
        document.body.style.background = old_backgroud;
        showLoading = true;
        loadQuestionWithOptions();
    }, 1000);
}


// --- Utility Functions ---
//Randomize pokemon id
function getRandomPokemonId() {
    return Math.floor(Math.random() * 1025) + 1;
}

//Shuffle array
function shuffleArray(array){
    return array.sort(() => Math.random() - 0.5);
}

//update result
function displayResult(result) {
    resultElement.textContent = result;
}

//hide loading
function hideLoadingWindow(){
    loadingContainer.classList.add("hide");
}

//show loading
function showLoadingWindow() {
    setTimeout(1000);
    mainContainer[0].classList.remove("show");
    loadingContainer.classList.remove("hide");
    loadingContainer.classList.add("show");
}


//show puzzle window
function showPuzzleWindow() {
    loadingContainer.classList.remove("show");
    mainContainer[0].classList.remove("hide");
    mainContainer[0].classList.add("show");
}

//hide puzzle
function hidePuzzleWindow() {
    mainContainer[0].classList.add("hide");
}