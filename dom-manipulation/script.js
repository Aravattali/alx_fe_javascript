let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
];

// Simulate the server with a mock API endpoint (JSONPlaceholder or mock server)
const serverUrl = "https://jsonplaceholder.typicode.com/posts"; // Mock API URL
let serverData = []; // To store data fetched from the server

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to fetch quotes from the server (using the fetchQuotesFromServer function)
// populateCategories , categoryFilter
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(serverUrl);
        if (response.ok) {
            const serverQuotes = await response.json();
            serverData = serverQuotes.map((item) => ({
                text: item.title, // Using title as the quote text for simplicity
                category: item.body.substring(0, 20) // Shortened body as category
            }));
            syncQuotes(); // Sync the server data with local data
        } else {
            console.error("Failed to fetch server data.");
        }
    } catch (error) {
        console.error("Error fetching data from the server:", error);
    }
}

// Function to sync local quotes with server quotes
function syncQuotes() {
    const localQuoteText = quotes.map((quote) => quote.text);
    const serverQuoteText = serverData.map((quote) => quote.text);

    // Check for differences between local and server data
    serverData.forEach((serverQuote) => {
        if (!localQuoteText.includes(serverQuote.text)) {
            // If the quote from the server doesn't exist locally, add it
            quotes.push(serverQuote);
        }
    });

    // Resolve conflicts: assume server data takes precedence
    quotes = quotes.map((localQuote) => {
        const conflictingServerQuote = serverData.find(
            (serverQuote) => serverQuote.text === localQuote.text
        );
        return conflictingServerQuote || localQuote;
    });

    saveQuotes(); // Save the updated quotes to local storage
    alert("Data synced with the server.");
}

// Periodically sync data with the server (every 30 seconds)
setInterval(fetchQuotesFromServer, 30000);

// Function to add a new quote and send it to the server
async function createAddQuoteForm() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        saveQuotes(); // Save to local storage

        // Send the new quote to the server using POST method
        await postQuoteToServer(newQuote);

        alert("Quote added successfully!");

        // Clear input fields
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
    } else {
        alert("Please fill in both the quote and category fields.");
    }
}

// Function to post a new quote to the server using POST method
async function postQuoteToServer(newQuote) {
    try {
        const response = await fetch(serverUrl, {
            method: "POST", // HTTP method
            headers: {
                "Content-Type": "application/json" // Ensure the content type is JSON
            },
            body: JSON.stringify({
                title: newQuote.text, // Server expects 'title' for the quote text
                body: newQuote.category // Server expects 'body' for the quote category
            })
        });

        if (!response.ok) {
            throw new Error("Failed to post the quote to the server.");
        }
        console.log("Quote posted to the server successfully.");
    } catch (error) {
        console.error("Error posting the quote:", error);
    }
}

// Function to export quotes as a JSON file
function exportToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                alert("Quotes synced with server!");
            } else {
                alert("Invalid file format.");
            }
        } catch (error) {
            alert("Error importing file. Please check the format.");
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Function to display a random quote
// option of displaying quotes

function selectedCategory() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = ""; // Clear previous content
    // filterQuote 
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available. Add some!";
        return;
    }

    // Get a random index using Math.random()
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Store last viewed quote in session storage
    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));

    // Create elements dynamically to display the quote
    const quoteText = document.createElement("p");
    quoteText.textContent = `"${randomQuote.text}"`;

    const quoteCategory = document.createElement("p");
    quoteCategory.innerHTML = `<em>— ${randomQuote.category}</em>`;

    // Append to display area
    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
}

// Event Listeners
document.getElementById("newQuote").addEventListener("click", selectedCategory);
document.getElementById("addQuote").addEventListener("click", createAddQuoteForm);
document.getElementById("exportQuotes").addEventListener("click", exportToJson);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

// Load last quote or display a random one when the page loads
window.onload = function() {
    selectedCategory();
    fetchQuotesFromServer(); // Fetch the server data on load
};