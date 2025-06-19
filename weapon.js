import { Projectile } from "./projectile.js";

class Weapon {
    constructor(fireRate = 500, damage = 10, penetrate = 0, split = false, superSplit = false, aimAssist = false, fireBullet = false) {
        this.fireRate = fireRate;
        this.damage = damage;
        this.penetrate = penetrate;
        this.split = split;
        this.superSplit = superSplit;
        this.aimAssist = aimAssist;
        this.fireBullet = fireBullet;

        this.holdInterval = null;
        this.canShoot = true;
    }

    fire(player, targetX, targetY, context, projectiles) {
        const shootSound = new Audio('./sounds/shoot.mp3');
        shootSound.play();
        projectiles.push(new Projectile(player.x, player.y, targetX, targetY, context, this.split, this.superSplit, this.aimAssist));
    }

    shoot(player, targetX, targetY, context, projectiles) {
        if (!this.canShoot) return;

        this.fire(player, targetX, targetY, context, projectiles);
        this.canShoot = false;
        setTimeout(() => {
            this.canShoot = true;
        }, this.fireRate);
    }

    autoShoot(player, context, projectiles) {
        if (!this.holdInterval) {
            this.shoot(player, player.cursorPosition.x, player.cursorPosition.y, context, projectiles);
            this.holdInterval = setInterval(() => {
                this.fire(player, player.cursorPosition.x, player.cursorPosition.y, context, projectiles);
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

class ShotgunWeapon extends Weapon {
    constructor(fireRate = 1000, damage = 1, penetrate = 1, split = false, superSplit = false, aimAssist = false, fireBullet = false) {
        super(fireRate, damage, penetrate, split, superSplit, aimAssist, fireBullet);
    }

    fire(player, targetX, targetY, context, projectiles) {
        const shootSound = new Audio('./sounds/shoot.mp3');
        shootSound.play();
        
        const angle = Math.atan2(targetY - player.y, targetX - player.x);
        const spread = 0.5;
        const pellets = 6;

        for (let i = 0; i < pellets; i++) {
            const offset = (Math.random() - 0.5) * spread;
            const spreadAngle = angle + offset;
            const dx = Math.cos(spreadAngle);
            const dy = Math.sin(spreadAngle);
            const spreadTargetX = player.x + dx * 100;
            const spreadTargetY = player.y + dy * 100;

            projectiles.push(new Projectile(player.x, player.y, spreadTargetX, spreadTargetY, context, this.split, this.superSplit, this.aimAssist));
        }
    }
}

export { Weapon, ShotgunWeapon };