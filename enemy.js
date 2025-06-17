import { Particle } from "./particle.js";
import { sinBetweenTwoPoints, cosBetweenTwoPoints } from "./utilities.js";

const enemies = {
  enemy_1: {
    imageSrc: "./img/enemy_1.png",
    health: 10,
    easySpawnRate: 60,
    difficultSpawnRate: 1,
  },
  enemy_3: {
    imageSrc: "./img/enemy_3.png",
    health: 30,
    easySpawnRate: 20,
    difficultSpawnRate: 1,
  },
  enemy_5: {
    imageSrc: "./img/enemy_5.png",
    health: 50,
    easySpawnRate: 10,
    difficultSpawnRate: 3,
  },
  enemy_7: {
    imageSrc: "./img/enemy_7.png",
    health: 70,
    easySpawnRate: 5,
    difficultSpawnRate: 5,
  },
  enemy_10: {
    imageSrc: "./img/enemy_10.png",
    health: 100,
    easySpawnRate: 3,
    difficultSpawnRate: 10,
  },
  enemy_20: {
    imageSrc: "./img/enemy_20.png",
    health: 200,
    easySpawnRate: 1,
    difficultSpawnRate: 55,
  },
  enemy_50: {
    imageSrc: "./img/enemy_50.png",
    health: 500,
    easySpawnRate: 0.01,
    difficultSpawnRate: 5,
  },
};

export class Enemy {
  constructor(canvasWidth, canvasHeight, context, player, difficultyConstant = 0) {
    this.context = context;
    this.player = player;

    this.radius = 15;
    if (Math.random() < 0.5) {
      this.x = Math.random() < 0.5 ? 0 - this.radius : canvasWidth + this.radius;
      this.y = Math.random() * canvasHeight;
    } else {
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() < 0.5 ? 0 - this.radius : canvasHeight + this.radius;
    }

    const spawnWeights = {};
    for (const [key, enemyData] of Object.entries(enemies)) {
      const easy = enemyData.easySpawnRate;
      const hard = enemyData.difficultSpawnRate;
      spawnWeights[key] = easy * (1 - difficultyConstant) + hard * difficultyConstant;
    }

    const totalWeight = Object.values(spawnWeights).reduce((sum, val) => sum + val, 0);
    for (let key in spawnWeights) {
      spawnWeights[key] /= totalWeight;
    }

    let rand = Math.random();
    let accum = 0;
    let chosenType = "enemy_1";
    for (const [type, weight] of Object.entries(spawnWeights)) {
      accum += weight;
      if (rand <= accum) {
        chosenType = type;
        break;
      }
    }

    const enemyData = enemies[chosenType];
    this.type = chosenType;
    this.image = new Image();
    this.image.src = enemyData.imageSrc;
    if (this.type === "enemy_50") {
      this.imageWidth = 100;
      this.imageHeight = 120;
    } else {
      this.imageWidth = 50;
      this.imageHeight = 60;
    }
    this.radius = 15;
    this.imageTick = 0;
    this.health = enemyData.health;
    this.maxHealth = this.health;

    const minSpeed = 2;
    const maxSpeed = 4;
    this.speed = minSpeed + difficultyConstant * (maxSpeed - minSpeed);
  }

  drawHealthBar() {
    if (this.health >= this.maxHealth) return;

    const barWidth = 40;
    const barHeight = 5;
    const x = this.x - barWidth / 2;
    const y = this.y - this.imageHeight / 2 - 10;

    this.context.fillStyle = 'gray';
    this.context.fillRect(x, y, barWidth, barHeight);

    const healthWidth = (this.health / this.maxHealth) * barWidth;
    this.context.fillStyle = 'red';
    this.context.fillRect(x, y, healthWidth, barHeight);

    this.context.strokeStyle = 'black';
    this.context.strokeRect(x, y, barWidth, barHeight);
  }

  drawImg() {
    const imageTickLimit = 18;
    const subX = this.imageTick > imageTickLimit ? this.imageWidth : 0;
    this.imageTick++;
    if (this.imageTick > imageTickLimit * 2) {
      this.imageTick = 0;
    }

    this.context.drawImage(
      this.image,
      subX,
      0,
      this.imageWidth,
      this.imageHeight,
      this.x - this.imageWidth / 2,
      this.y - this.imageHeight / 2,
      this.imageWidth,
      this.imageHeight);
  }

  draw() {
    this.context.save();
    let angle = Math.atan2(this.player.y - this.y, this.player.x - this.x);
    this.context.translate(this.x, this.y);
    this.context.rotate(angle + Math.PI / 2);
    this.context.translate(-this.x, -this.y);
    this.drawImg()
    this.context.restore();
    this.drawHealthBar();
  }

  update() {
    this.draw();
    this.velocity = {
      x: cosBetweenTwoPoints(this.player.x, this.player.y, this.x, this.y) * this.speed,
      y: sinBetweenTwoPoints(this.player.x, this.player.y, this.x, this.y) * this.speed,
    };
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  createExplosion(particles) {
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle(
        this.x,
        this.y,
        this.context
      ))
    }
  }
}