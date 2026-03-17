// Shared UI Elements
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Theme Logic
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const newTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// AI Animal Face Test Logic
const AI_URL = "./my_model/";
let aiModel, webcam, labelContainer, maxPredictions;

async function initAI() {
    const startBtn = document.getElementById('start-ai-btn');
    startBtn.textContent = "Loading Model...";
    startBtn.disabled = true;

    try {
        const modelURL = AI_URL + "model.json";
        const metadataURL = AI_URL + "metadata.json";

        aiModel = await tmImage.load(modelURL, metadataURL);
        maxPredictions = aiModel.getTotalClasses();

        const flip = true;
        webcam = new tmImage.Webcam(250, 250, flip);
        await webcam.setup();
        await webcam.play();
        window.requestAnimationFrame(aiLoop);

        document.getElementById("webcam-container").innerHTML = ''; // Clear loading
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        
        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = '';
        for (let i = 0; i < maxPredictions; i++) {
            const barContainer = document.createElement("div");
            barContainer.classList.add("prediction-bar-container");
            barContainer.innerHTML = `
                <div class="prediction-label"></div>
                <div class="prediction-bar-outer">
                    <div class="prediction-bar-inner" style="width: 0%"></div>
                </div>
            `;
            labelContainer.appendChild(barContainer);
        }
        startBtn.style.display = 'none';
    } catch (error) {
        console.error("AI Init Error:", error);
        startBtn.textContent = "Error: Upload model files to /my_model/";
        startBtn.disabled = false;
    }
}

async function aiLoop() {
    webcam.update();
    await predictAI();
    window.requestAnimationFrame(aiLoop);
}

async function predictAI() {
    const prediction = await aiModel.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const percentage = (prediction[i].probability * 100).toFixed(0);
        const container = labelContainer.childNodes[i];
        container.querySelector('.prediction-label').textContent = `${prediction[i].className}: ${percentage}%`;
        container.querySelector('.prediction-bar-inner').style.width = `${percentage}%`;
    }
}

// Lotto Logic
const generateBtn = document.getElementById('generate-btn');
const lottoNumbersContainer = document.getElementById('lotto-numbers');

generateBtn.addEventListener('click', () => {
    lottoNumbersContainer.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    sortedNumbers.forEach((number, index) => {
        setTimeout(() => {
            const numberElement = document.createElement('div');
            numberElement.classList.add('lotto-number');
            numberElement.textContent = number;
            lottoNumbersContainer.appendChild(numberElement);
        }, index * 100);
    });
});
