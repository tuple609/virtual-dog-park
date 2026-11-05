// Virtual Dog Park - script
// Round 3: the dog now grows over time and its progress is saved in the browser.

// ---- Rules and fixed values ----
const MAX_HAPPINESS = 100;
const START_HAPPINESS = 50;
const HAPPINESS_STEP = 10;
const DAY_HAPPINESS_DROP = 5;
const NAME_MAX_LENGTH = 20;

// Key used to store the dog in this browser. Save and load must use the same key.
const STORAGE_KEY = "virtualDogParkPetV1";

// One entry per breed. The picture is a local file in the assets folder.
const BREEDS = {
  "beagle": { name: "Beagle", picture: "assets/beagle.svg" },
  "golden-retriever": { name: "Golden Retriever", picture: "assets/golden-retriever.svg" },
  "poodle": { name: "Poodle", picture: "assets/poodle.svg" }
};

// How full the growth bar is at each stage.
const GROWTH_WIDTH = {
  "Puppy": 33,
  "Young Dog": 66,
  "Adult Dog": 100
};

// The adopted dog. It stays null until the visitor adopts one.
let dog = null;

// ---- Elements from index.html ----
const adoptForm = document.getElementById("adopt-form");
const breedInput = document.getElementById("breed");
const nameInput = document.getElementById("dog-name");
const formMessage = document.getElementById("form-message");

const dogCard = document.getElementById("dog-card");
const dogPicture = document.getElementById("dog-picture");
const dogNameDisplay = document.getElementById("dog-name-display");
const dogBreedDisplay = document.getElementById("dog-breed");
const dogDayDisplay = document.getElementById("dog-day");
const dogStageDisplay = document.getElementById("dog-stage");
const dogHappinessDisplay = document.getElementById("dog-happiness");
const growthTrack = document.getElementById("growth-track");
const growthFill = document.getElementById("growth-fill");
const happinessTrack = document.getElementById("happiness-track");
const happinessFill = document.getElementById("happiness-fill");

const feedButton = document.getElementById("feed-button");
const playButton = document.getElementById("play-button");
const nextDayButton = document.getElementById("next-day-button");
const startOverButton = document.getElementById("start-over-button");

// ---- Small helpers ----

// Keep happiness inside the allowed range, 0 to 100.
function clampHappiness(value) {
  if (value > MAX_HAPPINESS) {
    return MAX_HAPPINESS;
  }
  if (value < 0) {
    return 0;
  }
  return value;
}

// One rule for the whole page, so the day and the stage can never disagree.
function stageFor(day) {
  if (day <= 1) {
    return "Puppy";
  }
  if (day <= 3) {
    return "Young Dog";
  }
  return "Adult Dog";
}

// Write one short sentence under the form. textContent keeps it as text.
function showMessage(text) {
  formMessage.textContent = text;
}

// ---- Saving and loading ----
// The dog lives in this browser only. GitHub never receives it.

function saveDog() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dog));
  } catch (error) {
    console.warn("The dog could not be saved in this browser.", error);
  }
}

function loadDog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return null;
    }

    const saved = JSON.parse(raw);

    // Ignore anything that is not a dog we recognise.
    if (saved === null || typeof saved.name !== "string" || BREEDS[saved.breed] === undefined) {
      return null;
    }

    return {
      name: saved.name,
      breed: saved.breed,
      day: Number(saved.day) || 1,
      happiness: clampHappiness(Number(saved.happiness) || 0)
    };
  } catch (error) {
    return null;
  }
}

// ---- Actions ----

function adoptDog(event) {
  event.preventDefault();

  const name = nameInput.value.trim(); // trim() drops spaces at both ends

  if (name === "") {
    showMessage("Please enter a name for your dog.");
    nameInput.focus();
    return;
  }

  if (name.length > NAME_MAX_LENGTH) {
    showMessage("Please use 20 characters or fewer.");
    return;
  }

  dog = {
    name: name,
    breed: breedInput.value,
    day: 1,
    happiness: START_HAPPINESS
  };

  showMessage("");
  saveDog();
  render();
}

// Feed and Play share the same happiness rule, so they share this function.
function changeHappiness(amount) {
  if (dog === null) {
    return;
  }
  dog.happiness = clampHappiness(dog.happiness + amount);
  saveDog();
  render();
}

function feedDog() {
  changeHappiness(HAPPINESS_STEP);
}

function playDog() {
  changeHappiness(HAPPINESS_STEP);
}

// One day passes: the dog grows, but it also gets a little less happy.
function nextDay() {
  if (dog === null) {
    return;
  }
  dog.day = dog.day + 1;
  dog.happiness = clampHappiness(dog.happiness - DAY_HAPPINESS_DROP);
  saveDog();
  render();
}

function startOver() {
  const answer = window.confirm("Start over? This deletes your saved dog.");

  if (answer === false) {
    return; // Cancel keeps the dog exactly as it was.
  }

  dog = null;
  localStorage.removeItem(STORAGE_KEY);
  adoptForm.reset();
  showMessage("");
  render();
}

// ---- Drawing the page ----

function render() {
  if (dog === null) {
    adoptForm.hidden = false;
    dogCard.hidden = true;
    dogCard.removeAttribute("data-stage");
    return;
  }

  const breed = BREEDS[dog.breed];
  const stage = stageFor(dog.day);

  adoptForm.hidden = true;
  dogCard.hidden = false;

  dogPicture.src = breed.picture;
  dogPicture.alt = "Illustration of your adopted " + breed.name;

  // textContent, not innerHTML: a name like <b>Buddy</b> stays plain text.
  dogNameDisplay.textContent = dog.name;
  dogBreedDisplay.textContent = breed.name;
  dogDayDisplay.textContent = String(dog.day);
  dogStageDisplay.textContent = stage;
  dogHappinessDisplay.textContent = dog.happiness + " / 100";

  // The stage is shown three ways: as words, as a bar, and as the dog's size.
  dogCard.setAttribute("data-stage", stage);
  growthFill.style.width = GROWTH_WIDTH[stage] + "%";
  growthTrack.setAttribute("aria-valuenow", String(GROWTH_WIDTH[stage]));

  happinessFill.style.width = dog.happiness + "%";
  happinessTrack.setAttribute("aria-valuenow", String(dog.happiness));
}

// ---- Wire the page up ----
adoptForm.addEventListener("submit", adoptDog);
feedButton.addEventListener("click", feedDog);
playButton.addEventListener("click", playDog);
nextDayButton.addEventListener("click", nextDay);
startOverButton.addEventListener("click", startOver);

// On every page load, bring back the dog saved in this browser.
dog = loadDog();
render();
