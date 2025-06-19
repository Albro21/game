import { cosBetweenTwoPoints, sinBetweenTwoPoints } from "./utilities.js";

export class Projectile {
  constructor(x, y, targetX, targetY, context, canSplit = false, superSplit = false, aimAssist = false) {
    this.x = x;
    this.y = y;
    this.context = context;
    this.radius = 3;
    this.color = "#000000";
    this.velocity = {
      x: cosBetweenTwoPoints(targetX, targetY, x, y) * 15,
      y: sinBetweenTwoPoints(targetX, targetY, x, y) * 15,
    };;

    this.enemiesPenetrated = 0;
    this.hitEnemies = new Set();

    this.canSplit = canSplit;
    this.superSplit = superSplit;
    this.aimAssist = aimAssist;
  }

  draw() {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.context.fillStyle = this.color;
    this.context.fill();
  }

  update(enemies = []) {
    if (this.aimAssist && enemies?.length) {
      const nearest = this.getNearestEnemy(enemies, 150);
      if (nearest) {
        const dx = nearest.x - this.x;
        const dy = nearest.y - this.y;
        const angleToEnemy = Math.atan2(dy, dx);

        const currentAngle = Math.atan2(this.velocity.y, this.velocity.x);
        let angleDiff = angleToEnemy - currentAngle;

        if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

        const maxCurve = 0.3;
        const adjustedAngle = currentAngle + Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), maxCurve);

        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        this.velocity.x = Math.cos(adjustedAngle) * speed;
        this.velocity.y = Math.sin(adjustedAngle) * speed;
      }
    }

    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  split(projectilesArray) {
    const angleOffset = Math.PI / 12;
    const angle = Math.atan2(this.velocity.y, this.velocity.x);

    for (const offset of [-angleOffset, angleOffset]) {
      const newAngle = angle + offset;

      const newVelocity = {
        x: Math.cos(newAngle) * 15,
        y: Math.sin(newAngle) * 15
      };

      const canSplit = this.superSplit

      const newProjectile = new Projectile(
        this.x,
        this.y,
        this.x + newVelocity.x,
        this.y + newVelocity.y,
        this.context,
        canSplit,
        this.superSplit
      );

      newProjectile.velocity = newVelocity;
      newProjectile.hitEnemies = new Set(this.hitEnemies);
      projectilesArray.push(newProjectile);
    }
  }

  getNearestEnemy(enemies, maxRange = 100) {
    let nearest = null;
    let minDist = maxRange;

    for (const enemy of enemies) {
      const dx = enemy.x - this.x;
      const dy = enemy.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < minDist && !this.hitEnemies.has(enemy)) {
        minDist = dist;
        nearest = enemy;
      }
    }

    return nearest;
  }
}