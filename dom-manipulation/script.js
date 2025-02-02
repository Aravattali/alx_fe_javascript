let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
];

const serverUrl = "https://jsonplaceholder.typicode.com/posts";
let serverData = [];

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(serverUrl);
        if (response.ok) {
            const serverQuotes = await response.json();
            serverData = serverQuotes.map((item) => ({
                text: item.title,
                category: item.body.substring(0, 20)
            }));
            syncQuotes();
        } else {
            console.error("Failed to fetch server data.");
        }
    } catch (error) {
        console.error("Error fetching data from the server:", error);
    }
}

function syncQuotes() {
    const localQuoteText = quotes.map((quote) => quote.text);
    serverData.forEach((serverQuote) => {
        if (!localQuoteText.includes(serverQuote.text)) {
            quotes.push(serverQuote);
        }
    });
    saveQuotes();
    alert("Data synced with the server.");
}

setInterval(fetchQuotesFromServer, 30000);

async function createAddQuoteForm() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        saveQuotes();
        populateCategories();
        await postQuoteToServer(newQuote);
        alert("Quote added successfully!");
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
    } else {
        alert("Please fill in both the quote and category fields.");
    }
}

async function postQuoteToServer(newQuote) {
    try {
        const response = await fetch(serverUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: newQuote.text,
                body: newQuote.category
            })
        });
        if (!response.ok) {
            throw new Error("Failed to post the quote to the server.");
        }
    } catch (error) {
        console.error("Error posting the quote:", error);
    }
}

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

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                populateCategories();
                alert("Quotes imported successfully!");
            } else {
                alert("Invalid file format.");
            }
        } catch (error) {
            alert("Error importing file. Please check the format.");
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    const categories = [...new Set(quotes.map(quote => quote.category))];
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory);
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = "";

    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(quote => quote.category === selectedCategory);

    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes available for this category.";
        return;
    }

    filteredQuotes.forEach(quote => {
        const quoteText = document.createElement("p");
        quoteText.textContent = `"${quote.text}"`;
        const quoteCategory = document.createElement("p");
        quoteCategory.innerHTML = `<em>— ${quote.category}</em>`;
        quoteDisplay.appendChild(quoteText);
        quoteDisplay.appendChild(quoteCategory);
    });
}

document.getElementById("newQuote").addEventListener("click", filterQuotes);
document.getElementById("addQuote").addEventListener("click", createAddQuoteForm);
document.getElementById("exportQuotes").addEventListener("click", exportToJson);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

window.onload = function() {
    populateCategories();
    const savedCategory = localStorage.getItem("selectedCategory") || "all";
    document.getElementById("categoryFilter").value = savedCategory;
    filterQuotes();
    fetchQuotesFromServer();
};