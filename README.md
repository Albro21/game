# Rogue Shooter (Based on GTA2 by YuraKoch)

This is a school project based on the [GTA2 browser game by YuraKoch](https://github.com/YuraKoch/gta2). The original version featured two types of enemies and a simple shooting mechanic to increase your score.

I chose this game as the foundation for my project because it offered a solid starting point with potential for deep improvements. My goal was to turn it into a **roguelike shooter** with rich gameplay mechanics, player progression, and a challenging difficulty curve.

> **Credits**: Huge thanks to [YuraKoch](https://github.com/YuraKoch) for the original version of the game.

---

## 🚀 What's New

I've added a ton of features and transformed the game into a dynamic, fast-paced roguelike. Here's what’s included:

### 🔫 Weapon System
- Created a `Weapon` class to support automatic fire, customizable:
  - **Fire rate**
  - **Damage**
  - **Bullet penetration**
  - **Upgrade modifiers**
- Added `ShotgunWeapon` subclass:
  - Fires **6 bullets** in a **random spread**
  - Unique stats (e.g., fixed fire rate, no bullet splitting)

### 💎 Upgrade System
- When you score enough points, **choose from 3 upgrade cards**.
- There are **12 unique upgrades**:
  - 🔥 `fireRate`: Double Fire Rate  
  - 💥 `damage`: 2X More Damage  
  - 💖 `heal`: Restore Health  
  - 🏃 `movementSpeed`: Double Movement Speed  
  - 🔫 `shotgun`: Shotgun Mode  
  - 🛡️ `penetration`: Bullets Penetrate +1 Enemy  
  - 🌱 `regen`: Regenerate +1 HP  
  - ❤️ `maxHealth`: 2X Max Health  
  - 👫 `split`: Bullets Split on Hit  
  - 🎯 `aimAssist`: Aim Assist  
  - 🔥 `fire`: Set Enemies on Fire  

> Some upgrades do not stack (e.g., Shotgun + Split). Others unlock sequentially (e.g., Split → Super Split).

- **Upgrade cost increases** over time (multiplies by 1.25x each time).

---

## 🎮 Difficulty System

A global `difficultyConstant` increases by **+0.1** with every upgrade, dynamically making the game harder. It affects:

- **Enemy Spawn Rate**  
  - From 1s → 0.2s between spawns
- **Enemy Speed**  
  - From 2 → 6 (Player speed is 3)
- **Enemy Variety**  
  - 8 different enemy types (10–500 HP)
  - Spawn chances scale with difficulty  
  - Boss-type enemy (500 HP) has 0.01%–5% spawn rate depending on difficulty

> Score rewards also scale with enemy strength: from **100** to **5000** points per kill.

---

## 🧠 UX & Visual Improvements

- Player and enemy **health bars**
- **Floating damage numbers** (hit & regen)
- **Stats panel** (top-right): Fire Rate, Damage, Speed, etc.
- **Sound effects** for shooting, damage, death, upgrades
- **Background music**
- **Start Game** and **Play Again** buttons
- **Improved Game Over screen** with random GIFs ("because the music hits hard XD")
- **Disabled browser zoom scaling** to prevent exploits

---

## 💡 Balance Philosophy

I've tried to make this game **challenging but fair**. Some upgrades can become broken (e.g., stacking fire rate), but that’s part of the fun. If you manage to become unstoppable — you’ve earned it!

The game is **playable online** via GitHub Pages. You can also fork it and build your own upgrades or add new features!

---

## 🕹️ Play It Now

> [🌐 Open the Game on GitHub Pages](https://albro21.github.io/game/)  

---

## 🙌 Contributions

Feel free to fork, improve, or remix this game. I’d love to see what you come up with!
