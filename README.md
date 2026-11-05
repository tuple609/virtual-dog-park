# Virtual Dog Park

A dog encyclopedia and virtual pet website built for a first-year programming lab.
The site uses only HTML, CSS and plain JavaScript: no framework, no backend and no
external images.

## Features

- Dog Encyclopedia: Beagle, Golden Retriever and Poodle, each with its own SVG
  illustration and short notes on size, personality and everyday care.
- Adopt one dog: choose a breed, type a name of up to 20 characters, then adopt.
  Spaces at both ends are removed, and an empty name is rejected.
- Feed and Play: each click adds 10 happiness, and happiness never goes above 100.
- Next Day: moves the dog one day forward and drops happiness by 5, never below 0.
- Growth: Day 1 is a Puppy, Days 2 and 3 a Young Dog, and Day 4 onward an Adult Dog.
  The stage is shown as words, as a growth bar, and as the size of the picture.
- Saved progress: the dog is stored in the browser, so a refresh brings it back.
- Start Over: asks for confirmation, then deletes the saved dog.

## How to preview the site

The page uses browser storage, so open it through a local server instead of
double-clicking the file.

1. Open the `virtual-dog-park` folder in VS Code.
2. Install the **Live Server** extension by Ritwick Dey.
3. Right-click `index.html` and choose **Open with Live Server**.
4. The page opens at an address such as `http://127.0.0.1:5500`.

Keep to the same browser and the same address while testing, because saved progress
belongs to one browser on one device.

## Rules

- A new dog starts on Day 1, at the Puppy stage, with happiness 50.
- Feed and Play add 10 happiness each. The maximum is 100.
- Next Day adds 1 day and subtracts 5 happiness. The minimum is 0.
- Day 1 is Puppy, Days 2 and 3 are Young Dog, and Day 4 onward is Adult Dog.

## Where the data lives

Pet progress is saved with `localStorage` under the key `virtualDogParkPetV1`.
It stays inside the browser on this computer. It is not an online account, it is not
sent anywhere, and Git does not upload it. Clearing the browser data, or opening the
page in a different browser or on another device, means an empty park.

## Manual testing checklist

- [ ] Three breeds and three illustrations appear, with no broken image.
- [ ] An empty name is rejected, and a name with spaces at both ends is cleaned up.
- [ ] A name longer than 20 characters cannot be typed, and `<` `>` appear as text.
- [ ] Feed and Play raise happiness by 10 and stop at 100.
- [ ] Next Day turns Day 2 into Young Dog and Day 4 into Adult Dog, and happiness
      never drops below 0.
- [ ] Refreshing restores the same name, breed, day and happiness.
- [ ] Start Over: Cancel keeps the dog, Confirm deletes it and returns to the form.
- [ ] The page stays readable in a narrow window, with no sideways scrolling.

## Illustrations

The three drawings in `assets/` are simple SVG illustrations made for this project.
They are not photographs, and they do not come from another website.
