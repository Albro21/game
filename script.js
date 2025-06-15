import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
import { distanceBetweenTwoPoints } from "./utilities.js";
import { Weapon } from "./weapon.js";
import { UpgradeSystem } from './upgradeSystem.js';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

const scoreEl = document.querySelector('#score');
const wastedElement = document.querySelector('.wasted');

let player;
let upgradeSystem;
let weapon = new Weapon(500, 1);
const projectiles = [];
let enemies = [];
let particles = [];
let score = 0;
let animationId;
let countIntervalId;
let spawnIntervalId;

const startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', () => {
  startBtn.classList.add('d-none');
  init();
  animate();
  spawnEnemies();
});

function init() {
  const movementLimits = {
    minX: 0,
    maxX: canvas.width,
    minY: 0,
    maxY: canvas.height,
  };

  player = new Player(canvas.width / 2, canvas.height / 2, context, movementLimits, weapon);

  window.addEventListener("mousedown", () => {
    player.shoot(null, null, context, projectiles);
  });

  window.addEventListener("mouseup", () => {
    player.stopShooting();
  });

  window.addEventListener("mouseleave", () => {
    player.stopShooting();
  });

  window.addEventListener("mousemove", (e) => {
    player.cursorPosition.x = e.clientX;
    player.cursorPosition.y = e.clientY;
  });

  upgradeSystem = new UpgradeSystem(
    weapon,
    player,
    animate,
    spawnEnemies
  );
}

function spawnEnemies() {
  let countOfSpawnEnemies = 1;

  countIntervalId = setInterval(() => countOfSpawnEnemies++, 30000);
  spawnIntervalId = setInterval(() => spawnCountEnemies(countOfSpawnEnemies), 1000);

  spawnCountEnemies(countOfSpawnEnemies)
}

function spawnCountEnemies(count) {
  for (let i = 0; i < count; i++) {
    enemies.push(new Enemy(canvas.width, canvas.height, context, player));
  }
}

function animate() {
  animationId = requestAnimationFrame(animate);
  context.clearRect(0, 0, canvas.width, canvas.height);

  particles = particles.filter(particle => particle.alpha > 0);
  projectiles.splice(0, projectiles.length, ...projectiles.filter(projectileInsideWindow));
  enemies.forEach(enemy => checkHittingEnemy(enemy));
  enemies = enemies.filter(enemy => enemy.health > 0);
  const isGameOver = enemies.some(checkHittingPlayer);
  if (isGameOver) {
    wastedElement.style.display = "block";
    clearInterval(countIntervalId);
    clearInterval(spawnIntervalId);
    cancelAnimationFrame(animationId);
  }

  particles.forEach(particle => particle.update());
  projectiles.forEach(projectile => projectile.update());
  player.update();
  enemies.forEach(enemy => enemy.update());
}

function projectileInsideWindow(projectile) {
  return projectile.x + projectile.radius > 0 &&
    projectile.x - projectile.radius < canvas.width &&
    projectile.y + projectile.radius > 0 &&
    projectile.y - projectile.radius < canvas.height
}

function checkHittingPlayer(enemy) {
  const distance = distanceBetweenTwoPoints(player.x, player.y, enemy.x, enemy.y);
  return distance - enemy.radius - player.radius < 0;
}

function checkHittingEnemy(enemy) {
  projectiles.some((projectile, index) => {
    const distance = distanceBetweenTwoPoints(projectile.x, projectile.y, enemy.x, enemy.y);
    if (distance - enemy.radius - projectile.radius > 0) return false;

    enemy.health -= player.weapon.damage;

    if (enemy.health < 1) {
      increaseScore();
      enemy.createExplosion(particles);
    }

    if (projectile.enemiesPenetrated < player.weapon.penetrate) {
      projectile.enemiesPenetrated++;
    } else {
      removeProjectileByIndex(index);
    }

    return true;
  });
}

function removeProjectileByIndex(index) {
  projectiles.splice(index, 1);
}

function increaseScore() {
  score += 250;
  scoreEl.innerHTML = score;

  const progressEl = document.getElementById('score-progress');
  const progress = score - upgradeSystem.previousUpgradeAt;
  const needed = upgradeSystem.nextUpgradeAt - upgradeSystem.previousUpgradeAt;
  const percent = Math.min((progress / needed) * 100, 100);

  progressEl.style.width = `${percent}%`;
  progressEl.textContent = `${Math.floor(percent)}%`;

  if (upgradeSystem.checkForUpgrade(score)) {
    cancelAnimationFrame(animationId);
    clearInterval(spawnIntervalId);
  }
}
