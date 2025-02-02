// Array of quote objects
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
];

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available. Add some!";
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p><em>— ${randomQuote.category}</em></p>`;
}

// Function to add a new quote
function createAddQuoteForm() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        alert("Quote added successfully!");
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
    } else {
        alert("Please fill in both the quote and category fields.");
    }
}

// Event listener for the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Display a random quote when the page loads
window.onload = showRandomQuote;