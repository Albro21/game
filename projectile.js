import { cosBetweenTwoPoints, sinBetweenTwoPoints } from "./utilities.js";

export class Projectile {
  constructor(x, y, targetX, targetY, context, split) {
    this.x = x;
    this.y = y;
    this.context = context;
    this.radius = 3;
    this.color = "#810000";
    this.velocity = {
      x: cosBetweenTwoPoints(targetX, targetY, x, y) * 15,
      y: sinBetweenTwoPoints(targetX, targetY, x, y) * 15,
    };;
    this.enemiesPenetrated = 0;
  }

  draw() {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.context.fillStyle = this.color;
    this.context.fill();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  split(projectilesArray) {
    const angleOffset = Math.PI / 2;

    const angle = Math.atan2(this.velocity.y, this.velocity.x);

    for (const offset of [-angleOffset, angleOffset]) {
      const newAngle = angle + offset;

      const newVelocity = {
        x: Math.cos(newAngle) * 15,
        y: Math.sin(newAngle) * 15
      };

      const newProjectile = new Projectile(
        this.x,
        this.y,
        this.x + newVelocity.x,
        this.y + newVelocity.y,
        this.context,
        false
      );

      newProjectile.velocity = newVelocity;
      projectilesArray.push(newProjectile);
    }
  }
}