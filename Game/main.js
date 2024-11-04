// import { MenuScene } from './scenes/menuScene.js';
import { GameScene } from './scenes/gameScene.js';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [GameScene],
    physics: {
        defaut: 'arcade',
        arcade: {
            debug: true
        }
    },
};

const game = new Phaser.Game(config);
