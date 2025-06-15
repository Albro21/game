import { ShotgunWeapon } from "./weapon.js";

const upgrades = {
    fireRate: '🔥 Double Fire Rate',
    damage: '💥 1.5× More Damage',
    heal: '💖 Restore Health',
    movementSpeed: '🏃 Double Movement Speed',
    shotgun: '🔫 Shotgun Mode: 6 Bullets, 1s Fire Rate',
    penetration: '🛡️ Bullets Penetrate +1 Enemy',
};

export class UpgradeSystem {
    constructor(weapon, player, animateCallback, spawnEnemiesCallback) {
        this.weapon = weapon;
        this.player = player;
        this.animateCallback = animateCallback;
        this.spawnEnemiesCallback = spawnEnemiesCallback;

        this.nextUpgradeAt = 5000;

        this.overlay = document.getElementById('upgrade-overlay');
        this.overlay.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                this.applyUpgrade(btn.dataset.upgrade);
                this.hideOverlay();
                this.animateCallback();
                this.spawnEnemiesCallback();
                this.setRandomUpgrades();
            });
        });

        this.healthStat = document.getElementById('healthStat');
        this.fireRateStat = document.getElementById('fireRateStat');
        this.damageStat = document.getElementById('damageStat');

        this.setRandomUpgrades();
    }

    setRandomUpgrades() {
        const upgradeKeys = Object.keys(upgrades);
        const chosen = [];

        while (chosen.length < 3) {
            const random = upgradeKeys[Math.floor(Math.random() * upgradeKeys.length)];
            if (!chosen.includes(random)) {
                chosen.push(random);
            }
        }

        const buttons = this.overlay.querySelectorAll('button');
        buttons.forEach((btn, index) => {
            const key = chosen[index];
            btn.dataset.upgrade = key;
            btn.innerHTML = upgrades[key];
        });
    }

    showOverlay() {
        this.overlay.classList.replace('d-none', 'd-flex');
    }

    hideOverlay() {
        this.overlay.classList.replace('d-flex', 'd-none');
    }

    checkForUpgrade(score) {
        if (score >= this.nextUpgradeAt) {
            this.nextUpgradeAt *= 1.75;
            this.showOverlay();
            return true;
        }
        return false;
    }

    applyUpgrade(type) {
        if (type === 'fireRate') {
            this.weapon.fireRate = Math.max(1, this.weapon.fireRate * 0.5);
            this.fireRateStat.innerText = this.weapon.fireRate;
        } else if (type === 'damage') {
            this.weapon.damage += 1;
            this.damageStat.innerText = this.weapon.damage;
        } else if (type === 'heal') {
            this.player.health = Math.min(this.player.maxHealth || 10, (this.player.health || 5) + 2);
            this.healthStat.innerText = this.player.health;
        } else if (type === 'movementSpeed') {
            this.player.velocity *= 2;
        } else if (type === 'shotgun') {
            this.weapon.onMouseUp();
            this.weapon = new ShotgunWeapon();
            this.player.setWeapon(this.weapon);
            this.fireRateStat.innerText = this.weapon.fireRate;
            this.damageStat.innerText = this.weapon.damage;
            delete upgrades['shotgun'];
        } else if (type === 'penetration') {
            this.weapon.penetrate += 1;
            this.player.setWeapon(this.weapon);
        }
    }
}
