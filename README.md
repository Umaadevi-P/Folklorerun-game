# FOLKLORERUN 👻

FOLKLORERUN is a spooky, creature-driven interactive game where you face three legendary beings from folk tales — Baba Yaga, Banshee, and Aswang — each with their own themed UI, story bubbles, animations, and consequences for your choices.

This project was built using Kiro’s full development workflow: spec-driven development, vibe coding, property-based testing, accessibility checks, and automated hooks.

_Live Demo_: https://umaadevi-p.github.io/Folklorerun-game/


---


## **✨ What This App Does**

Kiro turns your device into a “detection scanner.”
You click **Scan**, and the app instantly analyzes sensor data (and mock image data for now) to reveal which creature is lurking nearby. Each creature comes with its own style, personality, and reactions depending on the player’s choices.

The game includes:

* Multiple creatures with unique art styles
* Different emotional stages (idle, speaking, defeated, aggressive)
* A fun storyline that changes based on your scan results
* Light animations and themed UI elements

The experience is fun, spooky, and slightly dramatic without being actually scary.

---

## **🎯 Key Features (Explained Simply)**

### **1. AI-Based Creature Classification**

The game uses a lightweight ML model to decide which paranormal entity appears after each scan.
Even though the actual environment scanning is simulated, the logic is structured like a real AI pipeline — giving players the feeling of tech-meets-mystery.

### **2. Dynamic Reactions & Story Dialogues**

Every creature responds differently depending on the stage:

* When first discovered
* When speaking to the player
* When defeated
* When the player chooses wrong
  This adds personality and emotion to each character instead of static images.

### **3. Unique Art Styles for Each Creature**

Each creature has its own theme, visual style, and speech bubble design.
The artwork is inspired by stylized anime-like fantasy aesthetics, giving the game a distinct identity.

### **4. Smooth Player Flow & Interactive Buttons**

The gameplay is designed to be quick and minimal:

* **Scan** to detect a creature
* **Learn/Listen** to see their story
* **Choose wisely** to win
* **Face consequences** if you pick wrong
  This structure keeps the game engaging without overwhelming the user.

### **5. Simple, Clean UI**

Light gradients, animated buttons, themed backgrounds, and color-coded elements create a smooth aesthetic throughout the app.
Even with a fantasy/horror theme, the design stays friendly and simple for users.

---

## **🛠 Tech Stack**

* **Frontend:** React + Vite
* **Styles:** Tailwind CSS
* **State Management:** React Hooks
* **AI Logic:** Custom classifier with weighted probability
* **Assets:** Anime-style generated art + themed UI icons

---

## **📦 Installation**

```bash
npm install
npm run dev
```

---

## **📘 Future Enhancements**

These ideas can be expanded later:

* Sound-based creature detection
* Multiplayer “hunt together” mode
* More creatures + lore expansion
* Advanced AI model integration


## **💡 Why We Built This**

This project was created as part of **Kiroween hackathon by Devpost & Kiro (AWS)**, combining creativity, AI, and storytelling.
The goal was to show how technology and imagination can blend into a fun, engaging game experience.
