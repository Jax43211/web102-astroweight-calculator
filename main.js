var planets = [ 
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

        // 1. Populate the dropdown element with the data found in the planets array. 
        // The value of each option should be the planet's name. 
        // Use the following built-in methods: 
        // `.forEach` `document.createElement` `document.getElementById` `.appendChild` 
    const planetSelect = document.getElementById("planets");
planets.forEach(function(planet) {
    var option = document.createElement("option");
    option.value = planet[0];
    option.textContent = planet[0];
    planetSelect.appendChild(option);
});
    function calculateWeight(weight, planetName) { 
        // 2. Write the code to return the correct weight 
        for (var i = 0; i < planets.length; i++) {
        if (planets[i][0] === planetName) {
            var gravity = planets[i][1];
            return weight * gravity;
        }
    }
    return null;
}
     
    function handleClickEvent(e) {
        // Get user's weight
    var userWeight = document.getElementById("user-weight").value;
    // Get selected planet name
    var planetName = planetSelect.value;
    // Calculate new weight
    var result = calculateWeight(userWeight, planetName);
    // Display result message
    var output = document.getElementById("output");
    output.textContent = `If you were on ${planetName}, you would weigh ${result.toFixed(2)}lbs!`;
}

        // 7. Set the #calculate-button element's onclick method to use the handleClickEvent function.
        document.getElementById("calculate-button").onclick = handleClickEvent;
        // 8. Make it look nice by attaching  a style.css file to your index.html and writing some basic styling, 
        // feel free to add classes and id's to the HTML elements as you need, 
        // import.a google font and use it for some or all of the text on your page. 


        // Bonus Challenges 
        // 8. Reverse the drop down order so that the sun is first.