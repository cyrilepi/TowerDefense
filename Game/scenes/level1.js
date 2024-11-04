import { WaveManager } from '../enemy.js'
import { TowerPurple, TowerBlue, SlowTower } from '../tower.js';
import { PlayerHealth } from '../playerHP.js';
import { extractPath } from '../utils.js';
import { PlayerGold } from '../playerGold.js';
export class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1' });
        this.currentTower = null;
        this.occupiedTiles = null;
        this.playerHealth = null;
        this.playerGold = null;
        this.towers = [];
        this.towerCost = null;
        this.enemies = [];
        this.waveManager = null;
    }

    preload() {
        this.load.tilemapTiledJSON('map', '../../Assets/Map/PremiereMap.tmj');
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        const tilesetArbre = map.addTilesetImage('Tree', 'tree');
        const tilesetEau = map.addTilesetImage('Water', 'water');
        const tilesetGrosRocher = map.addTilesetImage('GrosCaillou', 'bigRock');
        const tilesetMaisonJaune = map.addTilesetImage('House_Yellow', 'yellowHouse');
        const tilesetMaisonEnConstruction = map.addTilesetImage('House_Construction', 'houseUnderConstruction');
        const tilesetMoyenRocher = map.addTilesetImage('MoyenCaillou', 'mediumRock');
        const tilesetMouton = map.addTilesetImage('HappySheep_Idle', 'sheep');
        const tilesetMurEtEscalier = map.addTilesetImage('Tilemap_Elevation', 'wallAndStair');
        const tilesetPetitRocher = map.addTilesetImage('PetitCaillou', 'smallRock');
        const tilesetPetitePlante = map.addTilesetImage('PetitHerbe', 'smallPlant');
        const tilesetPont = map.addTilesetImage('Bridge_All', 'bridge');
        const tilesetSableEtHerbe = map.addTilesetImage('Tilemap_Flat', 'sandAndGrass');
        const tilesetCasePlacement = map.addTilesetImage('1-bit 16px icons part-1', 'towerPlacementCase');
        const tilesetPanneauFleche = map.addTilesetImage('PanneauFleche', 'directionPanel');
        map.createLayer('water', tilesetEau);
        map.createLayer('sand', tilesetSableEtHerbe);
        map.createLayer('grass', tilesetSableEtHerbe);
        map.createLayer('enemyPath', tilesetMurEtEscalier);
        map.createLayer('wall', tilesetMurEtEscalier);
        map.createLayer('stair', tilesetMurEtEscalier);
        map.createLayer('tree', tilesetArbre);
        map.createLayer('yellowHouse', tilesetMaisonJaune);
        map.createLayer('houseUnderConstruction', tilesetMaisonEnConstruction);
        map.createLayer('plant', tilesetPetitePlante);
        map.createLayer('directionPanel', tilesetPanneauFleche);
        map.createLayer('sheep', tilesetMouton);
        map.createLayer('rock4', tilesetPetitRocher);
        map.createLayer('rock3', tilesetMoyenRocher);
        map.createLayer('rock2', tilesetGrosRocher);
        map.createLayer('rock1', tilesetGrosRocher);
        map.createLayer('bridge', tilesetPont);
        const layerCasePlacement = map.createLayer('towerPlacementCase', tilesetCasePlacement);

        this.occupiedTiles = new Set();
        this.playerHealth = new PlayerHealth(this);
        this.playerGold = new PlayerGold(this, 20);
        layerCasePlacement.forEachTile(tile => tile.setAlpha(0));

        //TOWER
        const towerIconPurple = this.add.image(50, this.scale.height - 75, 'towerPurple').setInteractive().setScale(0.5);
        const pricePurpleTower = this.add.text(30, this.scale.height - 150, '10', { 
            fontSize: '32px',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 2
        })
        towerIconPurple.on('pointerdown', () => {
            this.towerCost = 10;
            if (this.currentTower) {
                this.currentTower.rangeCircle.clear();
                this.currentTower.destroy();
            };
            if (this.playerGold.checkGold(this.towerCost)) {
                this.currentTower = new TowerPurple(this, this.input.activePointer.worldX, this.input.activePointer.worldY - 25, 'towerPurple', layerCasePlacement, this.occupiedTiles, 100, 1, 2000, 300);
            } else {
                this.playerGold.NotEnoughGoldMessage();
            }
        });

        const towerIconChain = this.add.image(120, this.scale.height - 75, 'towerBlue').setInteractive().setScale(0.5);
        const priceChainLightningTower = this.add.text(100, this.scale.height - 150, '10', { 
            fontSize: '32px',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 2
        })
        towerIconChain.on('pointerdown', () => {
            this.towerCost = 10;
            if (this.currentTower) {
                this.currentTower.rangeCircle.clear();
                this.currentTower.destroy();
            };
            if (this.playerGold.checkGold(this.towerCost)) {
                this.currentTower = new TowerBlue(this, this.input.activePointer.worldX, this.input.activePointer.worldY - 25, 'towerBlue', layerCasePlacement, this.occupiedTiles, 100, 1, 7000, 200);
            } else {
                this.playerGold.NotEnoughGoldMessage();
            }
        });

        const slowTowerIcon = this.add.image(190, this.scale.height - 75, 'towerRed').setInteractive().setScale(0.5);
        const priceSlowTower = this.add.text(170, this.scale.height - 150, '10', { 
            fontSize: '32px',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 2
        })
        slowTowerIcon.on('pointerdown', () => {
            this.towerCost = 10;
            if (this.currentTower) {
                this.currentTower.rangeCircle.clear();
                this.currentTower.destroy();
            };
            if (this.playerGold.checkGold(this.towerCost)) {
                this.currentTower = new SlowTower(this, this.input.activePointer.worldX, this.input.activePointer.worldY - 25, 'towerRed', 150, layerCasePlacement, this.occupiedTiles);
            } else {
                this.playerGold.NotEnoughGoldMessage();
            }
        });

        this.input.on('pointermove', (pointer) => {
            if (this.currentTower) {
                this.currentTower.updatePosition(pointer);
            }
        });

        this.input.on('pointerdown', (pointer) => {
            if (this.currentTower) {
                if (this.currentTower.place(pointer)) {
                    this.towers.push(this.currentTower);
                    this.playerGold.spendGold(this.towerCost);
                    this.currentTower = null;
                }
            }
        });

        //ENEMIS

        const final_path = extractPath(map, 'enemyPathObject');
        this.waveManager = new WaveManager(this, final_path);
        this.waveManager.addWave('walkGoblinTntRed', 1, 1000, 0.5, 1);
        // this.waveManager.addWave('walkGoblinTntRed', 15, 1000, 0.5, 1);
        // this.waveManager.addWave('walkGoblinTorchRed', 15, 1000, 0.06, 1);
        // this.waveManager.addWave('walkBarrelRed', 20, 1000, 0.04, 2);
        // this.waveManager.addWave('walkGoblinTorchRed', 20, 1000, 0.06, 2);
        // this.waveManager.addWave('walkGoblinTntRed', 20, 1000, 0.05, 4);
        // this.waveManager.addWave('walkBarrelRed', 20, 1000, 0.04, 6);
        this.waveManager.startWaveCountdown();
    }

    update(time, delta) {
        this.enemies.forEach((enemy, index) => {
            enemy.update(time, delta);
            if (enemy.hp <= 0 || enemy.follower >= 1) {
                this.enemies.splice(index, 1);
                enemy.destroy();
                this.waveManager.enemyDestroyed();
            }
        });
        this.towers.forEach(tower => {
            tower.update(time, this.enemies);
        });
        if (this.checkIfLevelComplete()) {
            let victoryText = this.add.text(300, 100, 'Victoire !', {
                fontSize: '64px',
                fill: '#fff',
                fontFamily: 'Arial',
                stroke: '#000000',
                strokeThickness: 2
            })
            let lastLevelText = this.add.text(300, 200, 'Niveau suivant ->', {
                fontSize: '32px',
                fill: '#fff',
                fontFamily: 'Arial',
                stroke: '#000000',
                strokeThickness: 2
            }).setInteractive().on('pointerdown', () => {
                this.scene.pause('Level1')
                this.cache.tilemap.remove('map');
                this.scene.start('Level2');
            })
        }
    }

    checkIfLevelComplete() {
        return this.waveManager.allWavesCompleted();
    }
}