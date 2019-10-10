// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  }
  else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  }
  else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

// Parse input and covert to json
function getJson() {

  // Get user input
  var ingredients = document.getElementById("ingredients").value;
  var recipeYield = document.getElementById("yield").value;

  // Split up ingredients by line break
  var ingredientsArray = ingredients.split("\n");
  console.log(ingredientsArray);

  // Convert into json format
  var jsonString = "{\n \"yield\": \"" + recipeYield + "\",\n";
  jsonString += "\"ingr\": [\n";
  for (let i = 0; i < (ingredientsArray.length - 1); i++) {
    jsonString += "\t\"" + ingredientsArray[i] + "\",\n";
    console.log(jsonString);
  }
  jsonString += "\"" + ingredientsArray[ingredientsArray.length - 1] + "\"\n";
  jsonString += " ]\n}";
  console.log(jsonString);
  return jsonString;
}

// Make the actual CORS request.
function makeCorsRequest() {
  console.log("here");
  let app_id = "09c4ffa3";
  let app_key = "e0753762f0aeccf2a8ac436055088771";

  /*let recipe = document.getElementById('recipe').value;*/
  let recipe = getJson();
  let loadingIndicator = document.getElementById('loading');

  var url = 'https://api.edamam.com/api/nutrition-details?app_id=' + app_id + '&app_key=' + app_key;

  var xhr = createCORSRequest('POST', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var nutritionData = xhr.response;
    //pre.innerHTML = text;
    console.log(nutritionData);
    fillNutritionTable(nutritionData);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  loadingIndicator.innerHTML = 'Loading...';
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.responseType = 'json';
  xhr.send(recipe);
  loadingIndicator.innerHTML = '';
}

function numberPerServing(number, yield) {
  // Divide by the number of servings
  number /= yield;

  // Round to the nearest tenth
  number *= 10;
  number = Math.round(number);
  number /= 10;
  return number;
}

// Fill an element with a given id in the Nutrition Facts Table with data from API
function fillNutritionElement(elementID, nutritionData, dataID, type, unit) {
  var yield = nutritionData.yield;
  try {
    var dataToPrint;
    if (type == "nutrition") {
      dataToPrint = numberPerServing(nutritionData.totalNutrients[dataID].quantity, yield);
      if (nutritionData.totalNutrients[dataID].unit !== undefined) {
        dataToPrint += " " + nutritionData.totalNutrients[dataID].unit;
      }
    }
    else if (type == "daily") {
      dataToPrint = numberPerServing(nutritionData.totalDaily[dataID].quantity, yield) + "%";
    }
    else {
      dataToPrint = numberPerServing(nutritionData[dataID], yield);
      if (unit !== undefined) {
        dataToPrint += " " + unit;
      }
    }
    document.getElementById(elementID).innerHTML = dataToPrint;
  }
  catch (err) {
    console.log(elementID + " not found.");
  }
}

// Fill Nutrition Facts Table with data from API
function fillNutritionTable(nutritionData) {
  var yield = nutritionData.yield;
  
  if (nutritionData.error) {
    console.log("API ERROR: " + nutritionData.error);
    alert("Please check that you typed the recipe information in correctly!");
    return;
  }

  fillNutritionElement("amps", nutritionData, "totalWeight", null, "g");
  fillNutritionElement("cals", nutritionData, "calories", null);

  fillNutritionElement("totFat", nutritionData, "FAT", "nutrition");
  fillNutritionElement("totFatP", nutritionData, "FAT", "daily");

  fillNutritionElement("satFat", nutritionData, "FASAT", "nutrition");
  fillNutritionElement("satFatP", nutritionData, "FASAT", "daily");

  fillNutritionElement("transFat", nutritionData, "FATRN", "nutrition");

  fillNutritionElement("cholesterol", nutritionData, "CHOLE", "nutrition");
  fillNutritionElement("cholesterolP", nutritionData, "CHOLE", "daily");

  fillNutritionElement("sodium", nutritionData, "NA", "nutrition");
  fillNutritionElement("sodiumP", nutritionData, "NA", "daily");

  fillNutritionElement("totCarbs", nutritionData, "CHOCDF", "nutrition");
  fillNutritionElement("totCarbsP", nutritionData, "CHOCDF", "daily");

  fillNutritionElement("fiber", nutritionData, "FIBTG", "nutrition");
  fillNutritionElement("fiberP", nutritionData, "FIBTG", "daily");

  fillNutritionElement("sugar", nutritionData, "SUGAR", "nutrition");

  fillNutritionElement("protein", nutritionData, "PROCNT", "nutrition");
  fillNutritionElement("proteinP", nutritionData, "PROCNT", "daily");

  fillNutritionElement("vitD", nutritionData, "VITD", "nutrition");
  fillNutritionElement("vitDP", nutritionData, "VITD", "daily");

  fillNutritionElement("calcium", nutritionData, "CA", "nutrition");
  fillNutritionElement("calciumP", nutritionData, "CA", "daily");

  fillNutritionElement("iron", nutritionData, "FE", "nutrition");
  fillNutritionElement("ironP", nutritionData, "FE", "daily");

  fillNutritionElement("potassium", nutritionData, "K", "nutrition");
  fillNutritionElement("potassiumP", nutritionData, "K", "daily");
}
