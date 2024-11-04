export function walkGoblinTntRed(scene) {
    scene.anims.create({
        key: 'walkGoblinTntRed',
        frames: scene.anims.generateFrameNumbers('goblinTntRed', { start: 6, end: 8 }),
        frameRate: 7,
        repeat: -1
    });
}

export function walkGoblinTorchRed(scene) {
    scene.anims.create({
        key: 'walkGoblinTorchRed',
        frames: scene.anims.generateFrameNumbers('goblinTorchRed', { start: 8, end: 10}),
        frameRate: 7,
        repeat: -1
    });
}

export function walkBarrelRed(scene) {
    scene.anims.create({
        key: 'walkBarrelRed',
        frames: scene.anims.generateFrameNumbers('barrelRed', { start: 6, end: 9}),
        frameRate: 7,
        repeat: -1
    });
}