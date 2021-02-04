const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const messageOne = document.querySelector("#messageOne");
const messageTwo = document.querySelector("#messageTwo");

function update(updateOne = "", updateTwo = "") {
    messageOne.textContent = updateOne;
    messageTwo.textContent = updateTwo;
}

weatherForm.addEventListener("submit", (e) => {
    e.preventDefault();       // keeps the page from refreshing on submission
    const location = search.value;  
    update("Fetching data....");
    fetch("/weather?address=" + location).then((response) => {
        response.json().then((data) => {
            if (data.error) { update(data.error); }
            else { update(data.location, data.forecast); };
        })
    })
})