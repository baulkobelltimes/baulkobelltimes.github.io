// Core quotes that are always available
const CORE_QUOTES = [
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { text: "Learn from yesterday, live for today, hope for tomorrow.", author: "Albert Einstein" },
    { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
    { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
    { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
    { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
    { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
    { text: "The mind is everything. What you think you become.", author: "Buddha" },
    { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
    { text: "The best revenge is massive success.", author: "Frank Sinatra" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "Everything has beauty, but not everyone sees it.", author: "Confucius" },
    { text: "Life is 10% what happens to you and 90% how you react to it.", author: "Charles R. Swindoll" },
    { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
    { text: "The harder I work, the luckier I get.", author: "Samuel Goldwyn" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
    { text: "If you want to achieve greatness stop asking for permission.", author: "Anonymous" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "All progress takes place outside the comfort zone.", author: "Michael John Bobak" },
    { text: "Success is liking yourself, liking what you do, and liking how you do it.", author: "Maya Angelou" },
    { text: "What seems to us as bitter trials are often blessings in disguise.", author: "Oscar Wilde" },
    { text: "The distance between insanity and genius is measured only by success.", author: "Bruce Feirstein" },
    { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
    { text: "If you can't explain it simply, you don't understand it well enough.", author: "Albert Einstein" },
    { text: "There are no shortcuts to any place worth going.", author: "Beverly Sills" },
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Anonymous" },
    { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
    { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi" },
    { text: "The future starts today, not tomorrow.", author: "Pope John Paul II" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
    { text: "You learn more from failure than from success.", author: "Anonymous" },
    { text: "It's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln" },
    { text: "Either you run the day, or the day runs you.", author: "Jim Rohn" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "If you're going through hell, keep going.", author: "Winston Churchill" },
    { text: "Knowledge speaks, but wisdom listens.", author: "Jimi Hendrix" },
    { text: "Never let your memories be greater than your dreams.", author: "Doug Ivester" },
    { text: "Try not to become a person of success, but rather try to become a person of value.", author: "Albert Einstein" },
    { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
    { text: "If you don't build your dream, someone else will hire you to help them build theirs.", author: "Dhirubhai Ambani" },
    { text: "Study while others are sleeping; work while others are loafing; prepare while others are playing; and dream while others are wishing.", author: "William Arthur Ward" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
    { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
    { text: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.", author: "Abigail Adams" },
    { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
    { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
    { text: "The difference between try and triumph is just a little umph!", author: "Marvin Phillips" },
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "There are no shortcuts to any place worth going.", author: "Beverly Sills" },
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon" },
    { text: "Don't wish it were easier; wish you were better.", author: "Jim Rohn" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "The best preparation for tomorrow is doing your best today.", author: "H. Jackson Brown Jr." },
    { text: "Excellence is not a skill. It's an attitude.", author: "Ralph Marston" },
    { text: "Focus on your goal. Don't look in any direction but ahead.", author: "Unknown" },
    { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { text: "The secret of success is to do the common things uncommonly well.", author: "John D. Rockefeller" },
    { text: "Procrastination makes easy things hard, hard things harder.", author: "Mason Cooley" },
    { text: "The earlier you start working on something, the earlier you will see results.", author: "Unknown" },
    { text: "The pain of discipline is far less than the pain of regret.", author: "Unknown" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "The best way to predict your future is to create it.", author: "Abraham Lincoln" },
    { text: "Don't let what you cannot do interfere with what you can do.", author: "John Wooden" },
    { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
    { text: "Success consists of going from failure to failure without loss of enthusiasm.", author: "Winston Churchill" },
    { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
    { text: "There is no substitute for hard work.", author: "Thomas Edison" },
    { text: "Push yourself because no one else is going to do it for you.", author: "Unknown" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Your attitude determines your direction.", author: "Ralph Waldo Emerson" },
    { text: "The only person you should try to be better than is the person you were yesterday.", author: "Unknown" },
    { text: "It's not about perfect. It's about effort.", author: "Jillian Michaels" },
    { text: "Excellence is not an exception, it should be a prevailing attitude.", author: "Unknown" },
    { text: "The expert in anything was once a beginner.", author: "Unknown" },
    { text: "Dream big, work hard, stay focused.", author: "Unknown" },
    { text: "Every accomplishment starts with the decision to try.", author: "Unknown" },
    { text: "The future belongs to those who prepare for it today.", author: "Malcolm X" },
    { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
    { text: "The harder you work, the luckier you get.", author: "Gary Player" },
    { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
    { text: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson" },
    { text: "Strive for progress, not perfection.", author: "Unknown" },
    { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "Success is built on daily habits.", author: "Unknown" },
    { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
    { text: "The road to success is always under construction.", author: "Lily Tomlin" },
    { text: "Don't wait for opportunity. Create it.", author: "Unknown" },
    { text: "Great things never came from comfort zones.", author: "Unknown" },
    { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
    { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "The best view comes after the hardest climb.", author: "Unknown" },
    { text: "A goal without a plan is just a wish.", author: "Antoine de Saint-Exupéry" },
    { text: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon" },
    { text: "Make each day your masterpiece.", author: "John Wooden" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "The harder you work, the harder it is to surrender.", author: "Vince Lombardi" },
    { text: "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing.", author: "Pelé" },
    { text: "The best preparation for tomorrow is doing your best today.", author: "H. Jackson Brown Jr." },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer" },
    { text: "The difference between the impossible and the possible lies in determination.", author: "Tommy Lasorda" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Success is not in what you have, but who you are.", author: "Bo Bennett" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "The only person you should try to be better than is the person you were yesterday.", author: "Unknown" },
    { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
    { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
    { text: "Success is stumbling from failure to failure with no loss of enthusiasm.", author: "Winston S. Churchill" },
    { text: "The only way to achieve the impossible is to believe it is possible.", author: "Charles Kingsleigh" },
    { text: "Your attitude determines your direction.", author: "Unknown" },
    { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The best revenge is massive success.", author: "Frank Sinatra" },
    { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "The future starts today, not tomorrow.", author: "Pope John Paul II" },
    { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
    { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
    { text: "You learn more from failure than from success.", author: "Unknown" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "If you're going through hell, keep going.", author: "Winston Churchill" },
    { text: "Knowledge speaks, but wisdom listens.", author: "Jimi Hendrix" },
    { text: "Never let your memories be greater than your dreams.", author: "Doug Ivester" },
    { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
    { text: "If you don't build your dream, someone else will hire you to help them build theirs.", author: "Dhirubhai Ambani" },
    { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
    { text: "Teachers open the door, but you must enter by yourself.", author: "Chinese Proverb" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
    { text: "The more you learn, the more you earn.", author: "Warren Buffett" },
    { text: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "Knowledge is power. Information is liberating. Education is the premise of progress.", author: "Kofi Annan" },
    { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
    { text: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
    { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
    { text: "Intelligence plus character—that is the goal of true education.", author: "Martin Luther King Jr." },
    { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
    { text: "The function of education is to teach one to think intensively and to think critically.", author: "Martin Luther King Jr." },
    { text: "Study without desire spoils the memory, and it retains nothing that it takes in.", author: "Leonardo da Vinci" },
    { text: "The more I read, the more I acquire, the more certain I am that I know nothing.", author: "Voltaire" },
    { text: "Education is not just about going to school and getting a degree. It's about widening your knowledge and absorbing the truth about life.", author: "Shakuntala Devi" },
    { text: "The purpose of education is to replace an empty mind with an open one.", author: "Malcolm Forbes" },
    { text: "You can teach a student a lesson for a day; but if you can teach him to learn by creating curiosity, he will continue the learning process as long as he lives.", author: "Clay P. Bedford" },
    { text: "The whole purpose of education is to turn mirrors into windows.", author: "Sydney J. Harris" },
    { text: "Education breeds confidence. Confidence breeds hope. Hope breeds peace.", author: "Confucius" },
    { text: "The highest result of education is tolerance.", author: "Helen Keller" },
    { text: "Education is the key to unlocking the world, a passport to freedom.", author: "Oprah Winfrey" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "Education is the movement from darkness to light.", author: "Allan Bloom" },
    { text: "The goal of education is not to increase the amount of knowledge but to create the possibilities for a child to invent and discover.", author: "Jean Piaget" },
    { text: "Learning is not a spectator sport.", author: "D. Blocher" },
    { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
    { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
    { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "Genius is 1% inspiration and 99% perspiration.", author: "Thomas Edison" },
    { text: "The future belongs to those who learn more skills and combine them in creative ways.", author: "Robert Greene" },
    { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
    { text: "The only person who is educated is the one who has learned how to learn and change.", author: "Carl Rogers" },
    { text: "Education is not received. It is achieved.", author: "Albert Einstein" },
    { text: "Knowledge speaks, but wisdom listens.", author: "Jimi Hendrix" },
    { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
    { text: "Education is the foundation upon which we build our future.", author: "Christine Gregoire" },
    { text: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb" },
    { text: "The difference between school and life? In school, you're taught a lesson and then given a test. In life, you're given a test that teaches you a lesson.", author: "Tom Bodett" },
    { text: "Education's purpose is to replace an empty mind with an open one.", author: "Malcolm Forbes" },
    { text: "The best teachers are those who show you where to look but don't tell you what to see.", author: "Alexandra K. Trenfor" },
    { text: "Change is the end result of all true learning.", author: "Leo Buscaglia" },
    { text: "Education is what survives when what has been learned has been forgotten.", author: "B.F. Skinner" },
    { text: "The only way to learn mathematics is to do mathematics.", author: "Paul Halmos" },
    { text: "You don't understand anything until you learn it more than one way.", author: "Marvin Minsky" },
    { text: "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.", author: "Richard Feynman" },
    { text: "The art of teaching is the art of assisting discovery.", author: "Mark Van Doren" },
    { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
    { text: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.", author: "Abigail Adams" },
    { text: "The cure for boredom is curiosity. There is no cure for curiosity.", author: "Dorothy Parker" },
    { text: "Education is the ability to listen to almost anything without losing your temper or self-confidence.", author: "Robert Frost" },
    { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
    { text: "The more you learn, the more you realize how much you don't know.", author: "Anonymous" },
    { text: "Education is not just preparation for life; education is life itself.", author: "John Dewey" }
];

// API endpoints for additional quotes
const QUOTE_APIS = [
    {
        url: 'https://api.quotable.io/random',
        transform: (data) => ({ text: data.content, author: data.author })
    },
    {
        url: 'https://api.goprogram.ai/inspiration',
        transform: (data) => ({ text: data.quote, author: data.author })
    },
    {
        url: 'https://zenquotes.io/api/random',
        transform: (data) => ({ text: data[0].q, author: data[0].a })
    }
];

// Function to get a quote from APIs
async function getQuoteFromAPI() {
    // Randomly select an API endpoint
    const api = QUOTE_APIS[Math.floor(Math.random() * QUOTE_APIS.length)];
    
    try {
        const response = await fetch(api.url);
        const data = await response.json();
        return api.transform(data);
    } catch (error) {
        console.log('Error fetching quote from API:', error);
        return null;
    }
}

// Function to get a random quote
async function getRandomQuote() {
    // 20% chance to use core quotes, 80% chance to try API
    if (Math.random() < 0.2) {
        return CORE_QUOTES[Math.floor(Math.random() * CORE_QUOTES.length)];
    }

    // Try to get quote from API
    const apiQuote = await getQuoteFromAPI();
    if (apiQuote) {
        return apiQuote;
    }

    // Fallback to core quotes if API fails
    return CORE_QUOTES[Math.floor(Math.random() * CORE_QUOTES.length)];
}

// Update fetchQuote function in the global scope
window.fetchQuote = async function() {
    const quoteContent = document.querySelector('.quote-content');
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');

    // Add loading state
    quoteContent.classList.add('loading');

    try {
        const quote = await getRandomQuote();
        quoteText.textContent = quote.text;
        quoteAuthor.textContent = quote.author;
    } catch (error) {
        console.error('Error fetching quote:', error);
        // Use a fallback quote from core quotes if everything fails
        const fallbackQuote = CORE_QUOTES[Math.floor(Math.random() * CORE_QUOTES.length)];
        quoteText.textContent = fallbackQuote.text;
        quoteAuthor.textContent = fallbackQuote.author;
    } finally {
        quoteContent.classList.remove('loading');
    }
}; 