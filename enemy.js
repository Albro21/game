import { Particle } from "./particle.js";
import { sinBetweenTwoPoints, cosBetweenTwoPoints } from "./utilities.js";

const enemies = {
  enemy_1: {
    imageSrc: "./img/enemy_1.png",
    health: 1
  },
  enemy_3: {
    imageSrc: "./img/enemy_3.png",
    health: 3
  },
  enemy_5: {
    imageSrc: "./img/enemy_5.png",
    health: 5
  },
};

export class Enemy {
  constructor(canvasWidth, canvasHeight, context, player, hardnessConstant = 0) {
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

    const rand = Math.random();

    const thresholds = {
      enemy_5: 0.9 - hardnessConstant * 0.5,
      enemy_3: 0.6 - hardnessConstant * 0.3,
      enemy_1: 0,
    };

    let chosenType;
    if (rand > thresholds.enemy_5) {
      chosenType = "enemy_5";
    } else if (rand > thresholds.enemy_3) {
      chosenType = "enemy_3";
    } else {
      chosenType = "enemy_1";
    }

    const enemyData = enemies[chosenType];
    this.image = new Image();
    this.image.src = enemyData.imageSrc;
    this.imageWidth = 50;
    this.imageHeight = 60;
    this.radius = 15;
    this.imageTick = 0;
    this.health = enemyData.health;
    this.maxHealth = this.health;
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
      x: cosBetweenTwoPoints(this.player.x, this.player.y, this.x, this.y) * 2,
      y: sinBetweenTwoPoints(this.player.x, this.player.y, this.x, this.y) * 2,
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