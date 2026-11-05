// Virtual Dog Park - script
// Round 2: adopt one dog, then keep it happy with Feed and Play.

// ---- Rules and fixed values ----
const MAX_HAPPINESS = 100;
const START_HAPPINESS = 50;
const HAPPINESS_STEP = 10;
const NAME_MAX_LENGTH = 20;

// One entry per breed. The picture is a local file in the assets folder.
const BREEDS = {
  "beagle": { name: "Beagle", picture: "assets/beagle.svg" },
  "golden-retriever": { name: "Golden Retriever", picture: "assets/golden-retriever.svg" },
  "poodle": { name: "Poodle", picture: "assets/poodle.svg" }
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
const happinessTrack = document.getElementById("happiness-track");
const happinessFill = document.getElementById("happiness-fill");

const feedButton = document.getElementById("feed-button");
const playButton = document.getElementById("play-button");

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

// Write one short sentence under the form. textContent keeps it as text.
function showMessage(text) {
  formMessage.textContent = text;
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
    stage: "Puppy",
    happiness: START_HAPPINESS
  };

  showMessage("");
  render();
}

// Feed and Play share the same happiness rule, so they share this function.
function changeHappiness(amount) {
  if (dog === null) {
    return;
  }
  dog.happiness = clampHappiness(dog.happiness + amount);
  render();
}

function feedDog() {
  changeHappiness(HAPPINESS_STEP);
}

function playDog() {
  changeHappiness(HAPPINESS_STEP);
}

// ---- Drawing the page ----

function render() {
  if (dog === null) {
    adoptForm.hidden = false;
    dogCard.hidden = true;
    return;
  }

  const breed = BREEDS[dog.breed];

  adoptForm.hidden = true;
  dogCard.hidden = false;

  dogPicture.src = breed.picture;
  dogPicture.alt = "Illustration of your adopted " + breed.name;

  // textContent, not innerHTML: a name like <b>Buddy</b> stays plain text.
  dogNameDisplay.textContent = dog.name;
  dogBreedDisplay.textContent = breed.name;
  dogDayDisplay.textContent = String(dog.day);
  dogStageDisplay.textContent = dog.stage;
  dogHappinessDisplay.textContent = dog.happiness + " / 100";

  happinessFill.style.width = dog.happiness + "%";
  happinessTrack.setAttribute("aria-valuenow", String(dog.happiness));
}

// ---- Wire the page up ----
adoptForm.addEventListener("submit", adoptDog);
feedButton.addEventListener("click", feedDog);
playButton.addEventListener("click", playDog);

render();
