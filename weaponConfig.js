import { Weapon } from './weapon.js';

export const pistol = new Weapon('Pistol', 300, 10, 'semi');
export const smg = new Weapon('SMG', 100, 5, 'auto');

export const weapons = {
    pistol,
    smg
};
