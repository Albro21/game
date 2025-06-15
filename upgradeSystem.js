import { ShotgunWeapon } from "./weapon.js";

const upgrades = {
    fireRate: '🔥 Double Fire Rate',
    damage: '💥 1.5X More Damage',
    heal: '💖 Restore Health',
    movementSpeed: '🏃 Double Movement Speed',
    shotgun: '🔫 Shotgun Mode: 6 Bullets, 1s Fire Rate',
    penetration: '🛡️ Bullets Penetrate +1 Enemy',
    regen: '🌱 Regen +1',
    maxHealth: '❤️ 1.5X Max Health',
};

export class UpgradeSystem {
    constructor(weapon, player, animateCallback, spawnEnemiesCallback) {
        this.weapon = weapon;
        this.player = player;
        this.animateCallback = animateCallback;
        this.spawnEnemiesCallback = spawnEnemiesCallback;

        this.nextUpgradeAt = 5000;
        this.previousUpgradeAt = 0;

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
        this.maxHealthStat = document.getElementById('maxHealthStat');
        this.regenStat = document.getElementById('regenStat');
        this.fireRateStat = document.getElementById('fireRateStat');
        this.damageStat = document.getElementById('damageStat');
        this.movementSpeedStat = document.getElementById('movementSpeedStat');
        this.penetrationStat = document.getElementById('penetrationStat');

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
            this.previousUpgradeAt = this.nextUpgradeAt;
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
            this.player.currentHealth = this.player.maxHealth;
            this.healthStat.innerText = this.player.currentHealth;
        } else if (type === 'movementSpeed') {
            this.player.velocity *= 2;
            this.movementSpeedStat.innerText = this.player.velocity;
        } else if (type === 'shotgun') {
            this.weapon.onMouseUp();
            this.weapon = new ShotgunWeapon(1000, 1, max(1, this.weapon.penetrate));
            this.player.setWeapon(this.weapon);
            this.fireRateStat.innerText = this.weapon.fireRate;
            this.damageStat.innerText = this.weapon.damage;
            delete upgrades['shotgun'];
        } else if (type === 'penetration') {
            this.weapon.penetrate += 1;
            this.player.setWeapon(this.weapon);
            this.penetrationStat.innerText = this.weapon.penetrate;
        } else if (type === 'regen') {
            this.player.regen += 1;
            this.regenStat.innerText = this.player.regen;
        } else if (type === 'maxHealth') {
            this.player.maxHealth *= 1.5;
            this.maxHealthStat.innerText = this.player.maxHealth;
        }
    }
}
