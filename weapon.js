import { Projectile } from "./projectile.js";

class Weapon {
    constructor(fireRate, damage) {
        this.fireRate = fireRate;
        this.damage = damage;
        this.holdInterval = null;
    }

    shoot(player, targetX, targetY, context, projectiles) {
        projectiles.push(new Projectile(player.x, player.y, targetX, targetY, context));
    }

    autoShoot(player, context, projectiles) {
        if (!this.holdInterval) {
            this.shoot(player, player.cursorPosition.x, player.cursorPosition.y, context, projectiles);
            this.holdInterval = setInterval(() => {
                this.shoot(player, player.cursorPosition.x, player.cursorPosition.y, context, projectiles);
            }, this.fireRate);
        }
    }

    onMouseDown(player, _targetX, _targetY, context, projectiles) {
        this.autoShoot(player, context, projectiles);
    }

    onMouseUp() {
        if (this.holdInterval) {
            clearInterval(this.holdInterval);
            this.holdInterval = null;
        }
    }
}

export { Weapon };