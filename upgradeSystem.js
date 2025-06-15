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
            });
        });

        this.healthStat = document.getElementById('healthStat');
        this.fireRateStat = document.getElementById('fireRateStat');
        this.damageStat = document.getElementById('damageStat');
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
        }
    }
}
