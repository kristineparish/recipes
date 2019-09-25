
var names = ["Apple", "Ape", "Appeal", "Banana"];

function suggestName() {
    console.log("enterFunction");
    var input = document.getElementById("nameInput").value;
    var suggestions = "<ul>";
    for (let i = 0; i < names.length; i++) {
        if (names[i].startsWith(input)) {
            suggestions += "<li>" + names[i] + "</li>";
        }
    }
    suggestions += "</ul>"
    document.getElementById("suggestions").innerHTML = suggestions;
}
