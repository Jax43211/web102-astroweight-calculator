// Planets with multipliers to determine weight relative to Earth
const planets = [
  ['Pluto', 0.06],
  ['Neptune', 1.148],
  ['Uranus', 0.917],
  ['Saturn', 1.139],
  ['Jupiter', 2.64],
  ['Mars', 0.3895],
  ['Moon', 0.1655],
  ['Earth', 1],
  ['Venus', 0.9032],
  ['Mercury', 0.377],
  ['Sun', 27.9]
];

// Image paths for the wheel sprites
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
};

// DOM references
const planetSelect = document.getElementById('planets');      // required by tests
const wheel = document.getElementById('planet-wheel') || planetSelect;
const weightInput = document.getElementById('user-weight');
const output = document.getElementById('output');
const calculateButton = document.getElementById('calculate-button');

// Wheel state
let selectedIndex = 0;
let currentOffset = 0;
let prevAngles = [];
const START_ANGLE = -90;

// Populate the <select> so Playwright can select by label
function populateSelect() {
  if (!planetSelect) return;
  planetSelect.innerHTML = '';
  planets.forEach(([name]) => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name; // label must match test strings
    planetSelect.appendChild(option);
  });
  planetSelect.value = planets[selectedIndex][0];
}

// Populate the wheel UI
function populateWheel() {
  if (!wheel) return;

  wheel.innerHTML = '';
  const total = planets.length;
  const angleStep = 360 / total;

  planets.forEach((planet, i) => {
    const name = planet[0];

    const planetDiv = document.createElement('div');
    planetDiv.className = 'planet';

    const img = document.createElement('img');
    img.className = 'planet-sprite';
    img.src = planetSprites[name];

    const label = document.createElement('div');
    label.textContent = name;

    planetDiv.appendChild(img);
    planetDiv.appendChild(label);

    planetDiv.addEventListener('click', () => {
      selectedIndex = i;
      syncSelectFromWheel();
      updateWheelPositions();
    });

    wheel.appendChild(planetDiv);
  });

  requestAnimationFrame(() => {
    Array.from(wheel.children).forEach((planetDiv) => {
      planetDiv.style.transition = '';
    });
    updateWheelPositions();
  });
}

// Sync <select> from wheel selection
function syncSelectFromWheel() {
  if (!planetSelect) return;
  planetSelect.value = planets[selectedIndex][0];
}

// Sync wheel from <select> value (this is what tests drive)
function syncWheelFromSelect() {
  if (!planetSelect) return;
  const name = planetSelect.value;
  const idx = planets.findIndex(p => p[0] === name);
  if (idx !== -1) {
    selectedIndex = idx;
    updateWheelPositions();
  }
}

// React to changes from Playwright and from user
if (planetSelect) {
  planetSelect.addEventListener('change', syncWheelFromSelect);
}

// Arrow key controls
function setupAnimationControls() {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      selectedIndex = (selectedIndex - 1 + planets.length) % planets.length;
      syncSelectFromWheel();
      updateWheelPositions();
    } else if (e.key === 'ArrowRight') {
      selectedIndex = (selectedIndex + 1) % planets.length;
      syncSelectFromWheel();
      updateWheelPositions();
    }
  });
}

// Update wheel transforms
function updateWheelPositions() {
  if (!wheel) return;

  const total = planets.length;
  const angleStep = 360 / total;

  const targetOffset = selectedIndex * angleStep;
  let delta = ((targetOffset - currentOffset + 540) % 360) - 180;
  currentOffset = (currentOffset + delta + 360) % 360;

  Array.from(wheel.children).forEach((planetDiv, i) => {
    const rawAngle = START_ANGLE + (i * angleStep) - currentOffset;
    const prev = prevAngles[i] ?? rawAngle;
    let angle = rawAngle;

    while (angle - prev > 180) angle -= 360;
    while (angle - prev < -180) angle += 360;

    const scale = (i === selectedIndex) ? 1.5 : 1;
    planetDiv.style.transform =
      `rotate(${angle}deg) translate(200px) rotate(${-angle}deg) scale(${scale})`;

    prevAngles[i] = angle;
    planetDiv.classList.toggle('selected', i === selectedIndex);
  });
}

// Pure calculation function
function calculateWeight(weight, planetName) {
  const planet = planets.find(p => p[0] === planetName);
  return planet ? weight * planet[1] : null;
}

// Click handler for calculate button
function handleClickEvent() {
  if (!weightInput || !output) return;

  const userWeight = parseFloat(weightInput.value);
  if (isNaN(userWeight) || userWeight <= 0) {
    output.textContent = 'Please enter a valid weight.';
    return;
  }

  // Use the <select>'s current value as the source of truth
  const planetName = planetSelect ? planetSelect.value : planets[selectedIndex][0];
  const result = calculateWeight(userWeight, planetName);

  // Must match the test string exactly
  output.textContent =
    `If you were on ${planetName}, you would weigh ${result.toFixed(2)}lbs!`;
}

// Wire up calculate button
if (calculateButton) {
  calculateButton.addEventListener('click', handleClickEvent);
}

// Initialize
populateSelect();
populateWheel();
setupAnimationControls();
