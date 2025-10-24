//planets with multipliers to determine weight relative to earth
const planets = [ 
  ['Pluto', 0.06], 
  ['Neptune', 1.148], 
  ['Uranus', 0.917], 
  ['Saturn', 1.139], 
  ['Jupiter', 2.640], 
  ['Mars', 0.3895], 
  ['Moon', 0.1655], 
  ['Earth', 1], 
  ['Venus', 0.9032], 
  ['Mercury', 0.377], 
  ['Sun', 27.9] 
];

//path to images, looked up during populateWheel
const planetSprites = {
    Sun: 'planet-assets/sun.png',
    Moon: 'planet-assets/moon.png',
    Earth: 'planet-assets/earth.png',
    Pluto: 'planet-assets/pluto.png',
    Neptune: 'planet-assets/neptune.png',
    Saturn: 'planet-assets/saturn.png',
    Jupiter: 'planet-assets/jupiter.png',
    Mars: 'planet-assets/mars.png',
    Venus: 'planet-assets/venus.png',
    Mercury: 'planet-assets/mercury.png',
    Uranus: 'planet-assets/uranus.png'
}

//declaring a variable to help populate the wheel
const wheel = document.getElementById("planets");

//declaring some variables that will be used in the wheel to track rotation and animation
let selectedIndex = 0;
let currentOffset = 0;
let prevAngles = [];
const START_ANGLE = -90;

//function that actually populates the wheel
function populateWheel() {
    //splits the wheel into equal parts for each planet
  const total = planets.length;
  const angleStep = 360 / total;

  // forEach planet at index i we create an element with its name a custom sprite
  planets.forEach((planet, i) => {
    //create elements to add a planet slot, image, and label
    const planetDiv = document.createElement('div');
    planetDiv.className = 'planet';
    const img = document.createElement('img');
    img.className = 'planet-sprite';
    const label = document.createElement('div');

    //filling the label with the name of the planet
    label.textContent = planet[0];

    //sourcing the image from our sprite array with the name of each planet
    img.src = planetSprites[planet[0]];

   //inserting the image and label into their slots
    planetDiv.appendChild(img);
    planetDiv.appendChild(label);

    //you can click on each planet to instantly move to them
    planetDiv.addEventListener('click', () => {
      selectedIndex = i;
      updateWheelPositions();
    });

    //actually adding our slot with our image and label to the wheel
    wheel.appendChild(planetDiv);
  });


  //basically pauses the animation for frame so instead of loading in with the wheel up you watch it unfold
  requestAnimationFrame(() => {
    
    Array.from(wheel.children).forEach((planetDiv) => {
      planetDiv.style.transition = '';
    });
    
    updateWheelPositions();
  });
}

//lets you move the wheel with your arrow keys
function setupAnimationControls() {

//event listeners for left and right arrow key to move the wheel... e makes it listen to the keyboard
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      
      // % planets.length makes it repeatable, i had a glitch where the planet wouldnt have a shadow or scale properly without it
      selectedIndex = (selectedIndex - 1 + planets.length) % planets.length;
      updateWheelPositions();
    } else if (e.key === 'ArrowRight') {
      selectedIndex = (selectedIndex + 1) % planets.length;
      updateWheelPositions();
    }
  });
}

//function to update the position of the wheel
function updateWheelPositions() {

  //determine spacing between sections of the wheel and where the selected one sits
  const total = planets.length;
  const angleStep = 360 / total;

  //this makes sure the wheel rotates and that it does so in the shortest path (for the most part)
  const targetOffset = selectedIndex * angleStep;
  let delta = ((targetOffset - currentOffset + 540) % 360) - 180;
  currentOffset = (currentOffset + delta + 360) % 360;

  Array.from(wheel.children).forEach((planetDiv, i) => {
    //calculate new and previous angles
    const rawAngle = START_ANGLE + (i * angleStep) - currentOffset;
    // nullish operator (??) assigns a default value (rawAngle) if prevAngles[i] is null or undefined
    const prev = prevAngles[i] ?? rawAngle;
    let angle = rawAngle;

    //these two while loops make it so we can go between the beginning and end of the wheel without rotating 360deg
    while (angle - prev > 180) angle -= 360;
    while (angle - prev < -180) angle += 360;
    
    //rotating the wheel and applying a 50% increase to size on the selected planet
    const scale = (i === selectedIndex) ? 1.50 : 1;
    planetDiv.style.transform = `rotate(${angle}deg) translate(200px) rotate(${-angle}deg) scale(${scale})`;

    //store the angle for the next change
    prevAngles[i] = angle;
    
    //toggle what is selected for the input so it can be highlighted with the white shadow
    planetDiv.classList.toggle('selected', i === selectedIndex);
  });
}

//the actual calculations for the planet... FINALLY
function calculateWeight(weight, planetName) {

  //find basically goes through the array of array and matches the first value to whatever planet we have selected
  const planet = planets.find(p => p[0] === planetName);
  //now that find has found our nested array with our planet, it searches the index of [1] in that array which would be the gravity
  return planet ? weight * planet[1] : null;
}

//function to handle clicking on calculate
function handleClickEvent() {
  //defining some variables so we can check if our input is a positive number, getting our planet name for the response, and getting the output
  const userWeight = document.getElementById("user-weight").value;
  const planetName = planets[selectedIndex][0];
  const output = document.getElementById("output");

  //checking if the input exists as a number and if its negative
  if (isNaN(userWeight) || userWeight <= 0) {
    output.textContent = "Please enter a valid weight.";
    return;
  }

  //running the calculate function to get our weight on specific planet
  const result = calculateWeight(userWeight, planetName);

  //giving our html output some text to display
  output.textContent = `If you were on ${planetName}, you would weigh ${result.toFixed(2)} lbs!`;
}

//tying the calculate button to our handleClickEvent function
document.getElementById("calculate-button").addEventListener("click", handleClickEvent);

//these two just initialize our earlier functions for populating the wheel and letting you rotate with arrow keys
populateWheel();
setupAnimationControls();