let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
];

// Populate categories in the filter dropdown
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const categories = new Set(quotes.map(quote => quote.category)); // Extract unique categories

    // Add categories to dropdown
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const filteredQuotes = selectedCategory === "all" ?
        quotes :
        quotes.filter(quote => quote.category === selectedCategory);

    displayQuotes(filteredQuotes);
}

// Display quotes dynamically based on the filter
function displayQuotes(filteredQuotes) {
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = "";

    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes available for this category.";
        return;
    }

    filteredQuotes.forEach(quote => {
        const quoteElement = document.createElement("div");
        const quoteText = document.createElement("p");
        quoteText.textContent = `"${quote.text}"`;
        const quoteCategory = document.createElement("p");
        quoteCategory.innerHTML = `<em>— ${quote.category}</em>`;

        quoteElement.appendChild(quoteText);
        quoteElement.appendChild(quoteCategory);
        quoteDisplay.appendChild(quoteElement);
    });
}

// Save the last selected category in localStorage
function saveCategoryFilter() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("lastSelectedCategory", selectedCategory);
}

// Load the last selected category when the page loads
function loadCategoryFilter() {
    const lastCategory = localStorage.getItem("lastSelectedCategory") || "all";
    document.getElementById("categoryFilter").value = lastCategory;
    filterQuotes(); // Apply the filter immediately after loading
}

// Add a new quote and update the category filter dropdown
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        saveQuotes(); // Save to localStorage

        // Update categories in the dropdown if a new category is added
        populateCategories();
        filterQuotes(); // Reapply the current filter

        alert("Quote added successfully!");

        // Clear input fields
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
    } else {
        alert("Please fill in both the quote and category fields.");
    }
}

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Export quotes as a JSON file
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

// Import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                alert("Quotes imported successfully!");
                populateCategories();
                filterQuotes();
            } else {
                alert("Invalid file format.");
            }
        } catch (error) {
            alert("Error importing file. Please check the format.");
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Event listeners
document.getElementById("addQuote").addEventListener("click", addQuote);
document.getElementById("exportQuotes").addEventListener("click", exportToJson);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

// On page load, populate categories and apply the last selected filter
window.onload = function() {
    populateCategories();
    loadCategoryFilter();
};