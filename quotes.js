// Core quotes that are always available
const CORE_QUOTES = [
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" }
];

let QUOTES_FROM_JSON = [];
let JSON_LOADED = false;
let INITIAL_LOAD_COMPLETE = false;

// Function to get stored quote from localStorage
function getStoredQuote() {
    const storedData = localStorage.getItem('dailyQuote');
    if (storedData) {
        try {
            const data = JSON.parse(storedData);
            const now = new Date().getTime();
            const storedTime = data.timestamp;
            const hoursSinceLastUpdate = (now - storedTime) / (1000 * 60 * 60);
            
            console.log('Hours since last quote update:', hoursSinceLastUpdate);
            
            // If it's been less than 24 hours, return the stored quote
            if (hoursSinceLastUpdate < 24) {
                console.log('Using stored quote (less than 24 hours old)');
                return data.quote;
            } else {
                console.log('Stored quote is older than 24 hours, will fetch new one');
                return null;
            }
        } catch (e) {
            console.error('Error parsing stored quote:', e);
            return null;
        }
    }
    return null;
}

// Function to store quote in localStorage
function storeQuote(quote) {
    try {
        const data = {
            quote: quote,
            timestamp: new Date().getTime()
        };
        localStorage.setItem('dailyQuote', JSON.stringify(data));
        console.log('Quote stored in localStorage with timestamp:', data);
    } catch (e) {
        console.error('Error storing quote:', e);
    }
}

// Function to load quotes from JSON file
async function loadQuotesFromJSON() {
    // If JSON is already loaded, return true
    if (JSON_LOADED) {
        console.log('JSON already loaded, skipping load');
        return true;
    }

    console.log('Attempting to load quotes from JSON file...');
    
    try {
        const response = await fetch('quotes.json');
        console.log('JSON fetch response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonData = await response.json();
        console.log('JSON content loaded');
        
        if (!jsonData || !Array.isArray(jsonData)) {
            throw new Error('Invalid JSON format - expected an array');
        }
        
        // Process each quote in the JSON array
        for (const quote of jsonData) {
            if (quote.quote && quote.author) {
                QUOTES_FROM_JSON.push({ text: quote.quote, author: quote.author });
            }
        }
        
        if (QUOTES_FROM_JSON.length === 0) {
            console.error('No valid quotes found in JSON file');
            return false;
        }
        
        console.log('Successfully loaded quotes from JSON file:', QUOTES_FROM_JSON.length);
        JSON_LOADED = true;
        return true;
    } catch (error) {
        console.error('Error loading quotes from JSON:', error);
        return false;
    }
}

// Function to get a random quote
function getRandomQuote() {
    // Always try to use JSON quotes first if they're loaded
    if (JSON_LOADED && QUOTES_FROM_JSON.length > 0) {
        console.log('Using quote from JSON file');
        return QUOTES_FROM_JSON[Math.floor(Math.random() * QUOTES_FROM_JSON.length)];
    }

    // Only fallback to core quotes if JSON quotes are not available
    console.log('No JSON quotes available, using core quote');
    return CORE_QUOTES[Math.floor(Math.random() * CORE_QUOTES.length)];
}

// Update fetchQuote function in the global scope
window.fetchQuote = async function(forceNew = false) {
    console.log('Fetching new quote...');
    const quoteContent = document.querySelector('.quote-content');
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');

    // Add loading state
    quoteContent.classList.add('loading');
    console.log('Added loading state');

    try {
        // Check if we have a stored quote and we're not forcing a new one
        const storedQuote = !forceNew ? getStoredQuote() : null;
        if (storedQuote) {
            console.log('Using stored quote:', storedQuote);
            quoteText.textContent = storedQuote.text;
            quoteAuthor.textContent = storedQuote.author;
            return;
        }

        // If JSON isn't loaded yet, try to load it
        if (!JSON_LOADED) {
            console.log('JSON not loaded yet, attempting to load...');
            await loadQuotesFromJSON();
        }

        const quote = getRandomQuote();
        console.log('Selected new quote:', quote);
        quoteText.textContent = quote.text;
        quoteAuthor.textContent = quote.author;
        storeQuote(quote);
        console.log('Quote displayed and stored successfully');
    } catch (error) {
        console.error('Error in fetchQuote:', error);
        // Use a fallback quote from core quotes if everything fails
        const fallbackQuote = CORE_QUOTES[Math.floor(Math.random() * CORE_QUOTES.length)];
        console.log('Using fallback quote due to error:', fallbackQuote);
        quoteText.textContent = fallbackQuote.text;
        quoteAuthor.textContent = fallbackQuote.author;
        storeQuote(fallbackQuote);
    } finally {
        quoteContent.classList.remove('loading');
        console.log('Removed loading state');
        INITIAL_LOAD_COMPLETE = true;
    }
}; 

// Initialize quotes system
console.log('Initializing quotes system...');
// Load quotes from JSON when the script loads and fetch initial quote
(async function initialize() {
    await loadQuotesFromJSON();
    console.log('Initial JSON load completed:', JSON_LOADED ? 'Success' : 'Failed');
    await window.fetchQuote(false); // false means don't force a new quote
})(); 