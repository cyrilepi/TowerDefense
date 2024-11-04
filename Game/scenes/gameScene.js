import { Level1 } from './level1.js';
import { Level2 } from './level2.js';
import { Level3 } from './level3.js';
import { walkGoblinTntRed, walkGoblinTorchRed, walkBarrelRed } from '../animation.js';


export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        //Tileset
        this.load.image('tree', '../../Assets/Tileset/Tiny Swords/Tiny Swords (Update 010)/Resources/Trees/Tree.png');
        this.load.image('water', '../../Assets/Tileset/Tiny Swords/Tiny Swords (Update 010)/Terrain/Water/Water.png');
        this.load.image('bigRock', '../../Assets/Tileset/Tiny Swords/Tiny Swords (Update 010)/Deco/GrosCaillou.png');
        this.load.image('yellowHouse', '../../Assets/Tileset/Tiny Swords/Tiny Swords (Update 010)/Factions/Knights/Buildings/House/House_Yellow.png');
        this.load.image('houseUnderConstruction', '../../Assets/Tileset/Tiny Swords/Tiny Swords (Update 010)/Factions/Knights/Buildings/House/House_Construction.png');
        this.load.image('mediumRock', '../../Assets/Tileset/Tiny Swords/Tiny Swords (Update 010)/Deco/MoyenCaillou.png');
        this.load.image('sheep', '../../Assets/Tileset/Tiny Swords/Tiny Swords (Update 010)/Resources/Sheep/HappySheep_Idle.png')
        this.load.image('wallAndStair', '../../Assets/Tileset/Tiny Swords/Tiny Swords (Update 010)/Terrain/Ground/Tilemap_Elevation.png');
        this.load.image('directionPanel', '../../Assets/Tileset/Tiny Swords/Tiny Swords (Update 010)/Deco/PanneauFleche.png');
        this.load.image('smallRock', '../../Assets/Tileset/Tiny Swords/Tiny Swords (Update 010)/Deco/PetitCaillou.png');
        this.load.image('smallPlant', '../../Assets/Tileset/Tiny Swords/Tiny Swords (Update 010)/Deco/PetitHerbe.png');
        this.load.image('bridge', '../../Assets/Tileset/Tiny Swords/Tiny Swords (Update 010)/Terrain/Bridge/Bridge_All.png');
        this.load.image('sandAndGrass', '../../Assets/Tileset/Tiny Swords/Tiny Swords (Update 010)/Terrain/Ground/Tilemap_Flat.png');
        this.load.image('towerPlacementCase', '../../Assets/Tileset/1-bit 16px icons part-1.png');
        this.load.image('castlePurple', '../../Assets/Tileset/Tiny Swords/Tiny Swords (Update 010)/Factions/Knights/Buildings/Castle/Castle_Purple.png');

        //Enemy
        this.load.spritesheet('goblinTorchRed', '../../Assets/Tileset/Tiny Swords/Tiny Swords (Update 010)/Factions/Goblins/Troops/Torch/Red/Torch_Red.png', {
            frameWidth: 195,
            frameHeight: 195,
        })
        this.load.spritesheet('goblinTntRed', '../../Assets/Tileset/Tiny Swords/Tiny Swords (Update 010)/Factions/Goblins/Troops/TNT/Red/TNT_Red.png', {
            frameWidth: 195,
            frameHeight: 195,
        });
        this.load.spritesheet('barrelRed', '../../Assets/Tileset/Tiny Swords/Tiny Swords (Update 010)/Factions/Goblins/Troops/Barrel/Red/Barrel_Red.png', {
            frameWidth: 125,
            frameHeight: 125,
        })

        //Tower
        this.load.image('towerPurple', '../../Assets/Tileset/Tiny Swords/Tiny Swords (Update 010)/Factions/Knights/Buildings/Tower/Tower_Purple.png');
        this.load.image('towerBlue', '../../Assets/Tileset/Tiny Swords/Tiny Swords (Update 010)/Factions/Knights/Buildings/Tower/Tower_Blue.png');
        this.load.image('towerRed', '../../Assets/Tileset/Tiny Swords/Tiny Swords (Update 010)/Factions/Knights/Buildings/Tower/Tower_Red.png');
    }

    create() {
        walkGoblinTntRed(this);
        walkBarrelRed(this);
        walkGoblinTorchRed(this);
        this.scene.add('Level1', Level1, false);
        this.scene.start('Level1');
        this.scene.add('Level2', Level2, false);
        this.scene.add('Level3', Level3, false);
    }
}
