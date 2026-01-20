# Omikuji App 🔮

A simple and fun fortune-telling web application. With gradient backgrounds and animations, it makes the fortune-telling experience more engaging.

## Overview 📖

This application reimagines the traditional Japanese Omikuji (fortune slip) using modern web technologies. With just a click of a button, you can receive a random result from 6 fortune types, and view your history of past results.

## Features ✨

- **Random Fortune**: Get your fortune with a single button click
- **6 Fortune Types**: Displays results ranging from Daikichi (Great Blessing) to Kyo (Misfortune)
- **Shake Animation**: Creates anticipation with a shake effect when drawing your fortune
- **History Feature**: Records and displays the last 10 results with timestamps
- **Modern UI**: Beautiful gradient background and card design for an intuitive interface

## File Structure 📁

```
app07/
├── index.html   # Main HTML file
├── script.js    # Fortune logic and animations
├── style.css    # Stylesheet
└── README.md    # This file
```

## Usage 🚀

### Installation

No special installation required. Follow these steps:

```bash
# Clone the repository
git clone https://github.com/Sunwood-AI-OSS-Hub/claude-glm-actions-lab-sandbox.git

# Navigate to the directory
cd claude-glm-actions-lab-sandbox/example/app07
```

### Running

1. Open `index.html` in your web browser
2. Click the "おみくじを引く" (Draw Fortune) button
3. Your result will be displayed after the shake animation
4. View past results in the "過去の結果" (Past Results) section

## Fortune Probabilities 📊

Using weighted random selection, fortunes are determined with the following probabilities:

| Fortune | Probability |
|---------|-------------|
| Daikichi (Great Blessing) | 5% |
| Chukichi (Middle Blessing) | 20% |
| Shokichi (Small Blessing) | 25% |
| Kichi (Blessing) | 25% |
| Suekichi (Future Blessing) | 15% |
| Kyo (Misfortune) | 10% |

## Tech Stack 💻

- HTML5
- CSS3 (Gradients, Animations)
- Vanilla JavaScript (No frameworks)

## License

MIT License

---

Made with ☕ by Claude & Sunwood-AI-OSS-Hub
