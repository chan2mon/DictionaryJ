let dictionary = [];
const csvUrl = "https://docs.google.com/spreadsheets/d/1HiprplQ4zQmv6OvIWkssvJBJ_iYq7s4wIl2l8cayWt4/export?format=csv";

// Load CSV
fetch(csvUrl)
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n').slice(1);
        dictionary = rows.map(row => {
            const [word, pos, definition] = row.split(',');
            return { word: word.trim(), pos: pos.trim(), definition: definition.trim() };
        }).filter(i => i.word);

        displayGlossary();
    });

// Tabs
function openTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`.tab-button[onclick="openTab('${tabName}')"]`).classList.add('active');
}

// Search
function searchWord() {
    const input = document.getElementById('searchBox').value.toLowerCase();
    const resultDiv = document.getElementById('result');
    const autocompleteList = document.getElementById('autocomplete-list');

    resultDiv.innerHTML = '';
    autocompleteList.innerHTML = '';
    if (input === '') return;

    const suggestions = dictionary
        .filter(item => item.word.toLowerCase().startsWith(input))
        .slice(0, 5);

    suggestions.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.word;
        li.onclick = () => {
            document.getElementById('searchBox').value = item.word;
            displayResult(item.word);
            autocompleteList.innerHTML = '';
        };
        autocompleteList.appendChild(li);
    });

    displayResult(input);
}

function displayResult(input) {
    const resultDiv = document.getElementById('result');
    const found = dictionary.filter(item => item.word.toLowerCase() === input);

    if (found.length > 0) {
        resultDiv.innerHTML = found.map(item => `
            <div class="card result-card">
                <div class="word">${item.word}</div>
                <div class="pos">${item.pos}</div>
                <p class="definition">${item.definition}</p>
            </div>
        `).join('');
    } else {
        resultDiv.innerHTML = '<div class="card">No word found!</div>';
    }
}

// Glossary (A–Z)
function displayGlossary() {
    const glossaryDiv = document.getElementById('glossary-list');
    const navDiv = document.getElementById('alphabet-nav');
    glossaryDiv.innerHTML = '';
    navDiv.innerHTML = '';

    dictionary.sort((a, b) => a.word.localeCompare(b.word));
    const grouped = {};
    dictionary.forEach(item => {
        const letter = item.word[0].toUpperCase();
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(item);
    });

    // Create A–Z nav buttons
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    alphabet.forEach(letter => {
        const btn = document.createElement('button');
        btn.textContent = letter;
        btn.onclick = () => {
            const section = document.getElementById(`letter-${letter}`);
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        };
        navDiv.appendChild(btn);
    });

    // Render glossary sections
    alphabet.forEach(letter => {
        const items = grouped[letter];
        if (items) {
            const section = document.createElement('div');
            section.classList.add('glossary-section');
            section.id = `letter-${letter}`;
            section.innerHTML = `
                <h2 class="letter-title">${letter}</h2>
                ${items.map(i => `
                    <div class="card">
                        <div class="word">${i.word}</div>
                        <div class="pos">${i.pos}</div>
                        <p>${i.definition}</p>
                    </div>
                `).join('')}
            `;
            glossaryDiv.appendChild(section);
        }
    });
}

// Dark/Light Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('dark');
}
