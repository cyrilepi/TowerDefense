export class TowerPurple {
    constructor(scene, x, y, texture, layerCasePlacement, occupiedTiles, range, damage, attackCooldown, animationSpeed) {
        this.scene = scene;
        this.sprite = this.scene.add.sprite(x, y, texture).setScale(0.4).setAlpha(0.5);
        this.layerCasePlacement = layerCasePlacement;
        this.occupiedTiles = occupiedTiles;
        this.range = range;
        this.damage = damage;
        this.attackCooldown = attackCooldown;
        this.lastAttackTime = 0;
        this.animationSpeed = animationSpeed;
        this.selected = false;
        this.infoTowerContainer = null;
        this.tileIndice = null;
        this.rangeCircle = this.scene.add.graphics({ lineStyle: { width: 2, color: 0xff0000 } });
        this.rangeCircle.clear();
        this.rangeCircle.strokeCircle(x, y, this.range);
        this.rangeCircle.lineStyle(2, 0xff0000);
        this.sellButton = null;
        this.sprite.on('pointerdown', () => {
            if (!this.scene.currentTower) {
                this.selected = !this.selected
                if (this.selected) {
                    this.showDetails(this.sprite.x, this.sprite.y);
                    this.sellButton = this.scene.add.text(10, 80, 'Vendre', {
                        font: '20px Arial', fill: '#ff0000', stroke: '#000000',
                        strokeThickness: 2
                    })
                        .setInteractive()
                        .on('pointerdown', () => {
                            this.sellTower();
                        });
                } else {
                    this.sellButton.destroy();
                    this.hideDetails();
                }
            }
        });
    }

    showDetails(x, y) {
        this.rangeCircle.strokeCircle(x, y, this.range);
        const attackPerSecond = (1000 / this.attackCooldown).toFixed(2);
        this.infoTowerContainer = this.scene.add.container(x, y - 50);
        const infoTowerGraphic = this.scene.add.graphics();
        const infoTowerText = this.scene.add.text(-45, -20,
            `Fire Ball\nDégâts: ${this.damage}\nVitesse: ${attackPerSecond}\nPortée: ${this.range}`,
            { font: '14px Arial', fill: '#ffffff' }
        );
        infoTowerGraphic.fillStyle(0x000000, 0.5);
        infoTowerGraphic.fillRoundedRect(-55, -30, 115, 82, 10);
        this.infoTowerContainer.add(infoTowerGraphic);
        this.infoTowerContainer.add(infoTowerText);
    }

    hideDetails() {
        this.rangeCircle.clear();
        this.infoTowerContainer.destroy();
        if (this.infoTowerContainer) {
        }
    }

    getTilesAround(X, Y) {
        return [
            this.layerCasePlacement.getTileAt(X, Y),
            this.layerCasePlacement.getTileAt(X + 1, Y),
            this.layerCasePlacement.getTileAt(X + 1, Y + 1),
            this.layerCasePlacement.getTileAt(X, Y + 1),
            this.layerCasePlacement.getTileAt(X - 1, Y + 1),
            this.layerCasePlacement.getTileAt(X - 1, Y),
            this.layerCasePlacement.getTileAt(X - 1, Y - 1),
            this.layerCasePlacement.getTileAt(X, Y - 1),
            this.layerCasePlacement.getTileAt(X + 1, Y - 1),
        ];
    }

    updatePosition(pointer) {
        this.layerCasePlacement.forEachTile(tile => {
            tile.setAlpha(0);
        });
        const worldPoint = pointer.positionToCamera(this.scene.cameras.main);
        const tileX = this.layerCasePlacement.worldToTileX(worldPoint.x);
        const tileY = this.layerCasePlacement.worldToTileY(worldPoint.y);
        this.sprite.setPosition(pointer.worldX, pointer.worldY - 25);
        this.rangeCircle.clear();
        this.rangeCircle.strokeCircle(pointer.worldX, pointer.worldY - 25, this.range);
        const tilesAround = this.getTilesAround(tileX, tileY);
        tilesAround.forEach(tile => {
            if (tile && tile.properties.TP) {
                tile.setAlpha(1);
            }
        });
    }

    place(pointer) {
        this.layerCasePlacement.forEachTile(tile => {
            tile.setAlpha(0);
        });
        const worldPoint = pointer.positionToCamera(this.scene.cameras.main);
        const tileX = this.layerCasePlacement.worldToTileX(worldPoint.x);
        const tileY = this.layerCasePlacement.worldToTileY(worldPoint.y);
        const tile = this.layerCasePlacement.getTileAt(tileX, tileY);
        if (!tile) return false;
        const centerX = tile.getCenterX();
        const centerY = tile.getCenterY();
        const tilesAround = this.getTilesAround(tileX, tileY);
        this.tileIndice = tilesAround.map(t => `${t.x},${t.y}`);
        if (tilesAround.every(tile => tile != null) && !this.tileIndice.some(index => this.occupiedTiles.has(index))) {
            this.sprite.setPosition(centerX, centerY - 25);
            this.sprite.setInteractive();
            this.tileIndice.forEach(index => this.occupiedTiles.add(index));
            this.sprite.setAlpha(1);
            this.rangeCircle.clear();
            return true;
        }
        return false;
    }

    update(time, enemies) {
        const target = this.getEnemyInRange(enemies);
        if (time > this.lastAttackTime + this.attackCooldown && target) {
            this.attack(target);
            this.lastAttackTime = time;
        }
    }

    getEnemyInRange(enemies) {
        for (let enemy of enemies) {
            const distance = Phaser.Math.Distance.Between(
                this.sprite.x,
                this.sprite.y,
                enemy.x,
                enemy.y
            );
            if (distance <= this.range) {
                return enemy;
            }
        }
        return null;
    }

    attack(enemy) {
        const fireball = this.scene.add.graphics();
        fireball.fillStyle(0xff4500, 1);
        fireball.fillCircle(0, 0, 10);
        fireball.setPosition(this.sprite.x, this.sprite.y);
        const distance = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, enemy.x, enemy.y);
        const duration = distance / this.animationSpeed * 1000;
        this.scene.tweens.add({
            targets: fireball,
            x: enemy.x,
            y: enemy.y,
            duration: duration,
            onComplete: () => {
                enemy.takeDamage(this.damage);
                fireball.destroy();
            }
        });
    }

    sellTower() {
        const refundAmount = Math.floor(this.scene.towerCost / 2);
        this.scene.playerGold.addGold(refundAmount);
        this.tileIndice.forEach(index => this.occupiedTiles.delete(index));
        let index = this.scene.towers.indexOf(this);
        this.scene.towers.splice(index, 1);
        this.destroy();
        this.hideDetails();
        this.sellButton.destroy();
    }

    destroy() {
        this.sprite.destroy();
    }
}

export class TowerBlue {
    constructor(scene, x, y, texture, layerCasePlacement, occupiedTiles, range, damage, attackCooldown, chainRange) {
        this.scene = scene;
        this.sprite = this.scene.add.sprite(x, y, texture).setScale(0.4).setAlpha(0.5);
        this.layerCasePlacement = layerCasePlacement;
        this.occupiedTiles = occupiedTiles;
        this.range = range;
        this.tileIndice = null;
        this.chainRange = chainRange;
        this.damage = damage;
        this.attackCooldown = attackCooldown;
        this.lastAttackTime = 0; this
        this.selected = false;
        this.infoTowerContainer = null;
        this.rangeCircle = this.scene.add.graphics({ lineStyle: { width: 2, color: 0xff0000 } });
        this.rangeCircle.clear();
        this.rangeCircle.strokeCircle(x, y, this.range);
        this.rangeCircle.lineStyle(2, 0xff0000);
        this.sprite.on('pointerdown', () => {
            if (!this.scene.currentTower) {
                this.selected = !this.selected
                if (this.selected) {
                    this.showDetails(this.sprite.x, this.sprite.y);
                    this.sellButton = this.scene.add.text(10, 80, 'Vendre', {
                        font: '20px Arial', fill: '#ff0000', stroke: '#000000',
                        strokeThickness: 2
                    })
                        .setInteractive()
                        .on('pointerdown', () => {
                            this.sellTower();
                        });
                } else {
                    this.sellButton.destroy();
                    this.hideDetails();
                }
            }
        });
    }

    showDetails(x, y) {
        this.rangeCircle.strokeCircle(x, y, this.range);
        const attackPerSecond = (1000 / this.attackCooldown).toFixed(2);
        this.infoTowerContainer = this.scene.add.container(x, y - 50);
        const infoTowerGraphic = this.scene.add.graphics();
        const infoTowerText = this.scene.add.text(-45, -20,
            `Chain Lightning\nDégâts: ${this.damage}\nVitesse: ${attackPerSecond}\nPortée: ${this.range}`,
            { font: '14px Arial', fill: '#ffffff' }
        );
        infoTowerGraphic.fillStyle(0x000000, 0.5);
        infoTowerGraphic.fillRoundedRect(-55, -30, 115, 82, 10);
        this.infoTowerContainer.add(infoTowerGraphic);
        this.infoTowerContainer.add(infoTowerText);
    }

    hideDetails() {
        this.rangeCircle.clear();
        if (this.infoTowerContainer) {
            this.infoTowerContainer.destroy();
        }
    }

    getTilesAround(X, Y) {
        return [
            this.layerCasePlacement.getTileAt(X, Y),
            this.layerCasePlacement.getTileAt(X + 1, Y),
            this.layerCasePlacement.getTileAt(X + 1, Y + 1),
            this.layerCasePlacement.getTileAt(X, Y + 1),
            this.layerCasePlacement.getTileAt(X - 1, Y + 1),
            this.layerCasePlacement.getTileAt(X - 1, Y),
            this.layerCasePlacement.getTileAt(X - 1, Y - 1),
            this.layerCasePlacement.getTileAt(X, Y - 1),
            this.layerCasePlacement.getTileAt(X + 1, Y - 1),
        ];
    }

    updatePosition(pointer) {
        this.layerCasePlacement.forEachTile(tile => {
            tile.setAlpha(0);
        });
        const worldPoint = pointer.positionToCamera(this.scene.cameras.main);
        const tileX = this.layerCasePlacement.worldToTileX(worldPoint.x);
        const tileY = this.layerCasePlacement.worldToTileY(worldPoint.y);
        this.sprite.setPosition(pointer.worldX, pointer.worldY - 25);
        this.rangeCircle.clear();
        this.rangeCircle.strokeCircle(pointer.worldX, pointer.worldY - 25, this.range);
        const tilesAround = this.getTilesAround(tileX, tileY);
        tilesAround.forEach(tile => {
            if (tile && tile.properties.TP) {
                tile.setAlpha(1);
            }
        });
    }

    place(pointer) {
        this.layerCasePlacement.forEachTile(tile => {
            tile.setAlpha(0);
        });
        const worldPoint = pointer.positionToCamera(this.scene.cameras.main);
        const tileX = this.layerCasePlacement.worldToTileX(worldPoint.x);
        const tileY = this.layerCasePlacement.worldToTileY(worldPoint.y);
        const tile = this.layerCasePlacement.getTileAt(tileX, tileY);
        if (!tile) return false;
        const centerX = tile.getCenterX();
        const centerY = tile.getCenterY();
        const tilesAround = this.getTilesAround(tileX, tileY);
        this.tileIndice = tilesAround.map(t => `${t.x},${t.y}`);
        if (tilesAround.every(tile => tile != null) && !this.tileIndice.some(index => this.occupiedTiles.has(index))) {
            this.sprite.setPosition(centerX, centerY - 25);
            this.sprite.setInteractive();
            this.tileIndice.forEach(index => this.occupiedTiles.add(index));
            this.sprite.setAlpha(1);
            this.rangeCircle.clear();
            return true;
        }
        return false;
    }

    update(time, enemies) {
        const target = this.getEnemyInRange(enemies);
        if (time > this.lastAttackTime + this.attackCooldown && target) {
            this.attack(target, enemies);
            this.lastAttackTime = time;
        }
    }

    getEnemyInRange(enemies) {
        for (let enemy of enemies) {
            const distance = Phaser.Math.Distance.Between(
                this.sprite.x,
                this.sprite.y,
                enemy.x,
                enemy.y
            );
            if (distance <= this.range) {
                return enemy;
            }
        }
        return null;
    }

    attack(target, enemies) {
        let lightning = this.scene.add.graphics();
        lightning.lineStyle(2, 0x00ffff, 1);
        this.drawLightning(this.sprite.x, this.sprite.y, target.x, target.y, lightning);
        this.scene.tweens.add({
            targets: lightning,
            onComplete: () => {
                target.takeDamage(this.damage);
                this.chainLightning(target, enemies);
                this.scene.time.delayedCall(10, () => {
                    lightning.destroy();
                });
            }
        });
    }

    drawLightning(x1, y1, x2, y2, graphics) {
        const segments = 5;
        const amplitude = 20;
        graphics.beginPath();
        graphics.moveTo(x1, y1);
        for (let i = 1; i <= segments; i++) {
            let t = i / segments;
            let midX = Phaser.Math.Interpolation.Linear([x1, x2], t);
            let midY = Phaser.Math.Interpolation.Linear([y1, y2], t) + Phaser.Math.Between(-amplitude, amplitude);
            graphics.lineTo(midX, midY);
        }

        graphics.lineTo(x2, y2);
        graphics.strokePath();
    }

    chainLightning(firstTarget, enemies) {
        const additionalTargets = this.findAdditionalTargets(firstTarget, enemies);
        let currentTarget = firstTarget;
        additionalTargets.forEach((target) => {
            if (target) {
                let lightning = this.scene.add.graphics();
                lightning.lineStyle(2, 0x00ffff, 1);
                this.drawLightning(currentTarget.x, currentTarget.y, target.x, target.y, lightning);
                this.scene.tweens.add({
                    targets: lightning,
                    onComplete: () => {
                        target.takeDamage(this.damage);
                        this.scene.time.delayedCall(20, () => {
                            lightning.destroy();
                        });
                    }
                });
                currentTarget = target;
            }
        });
    }

    findAdditionalTargets(firstTarget, enemies) {
        let forwardTargets = [];
        let backwardTargets = [];
        for (let enemy of enemies) {
            if (enemy === firstTarget) continue;
            const distance = Phaser.Math.Distance.Between(firstTarget.x, firstTarget.y, enemy.x, enemy.y);
            if (distance <= this.chainRange) {
                const positionDifference = firstTarget.follower - enemy.follower;
                if (positionDifference < 0) {
                    forwardTargets.push(enemy);
                } else {
                    backwardTargets.push(enemy);
                }
            }
        }
        let additionalTargets = [];
        if (forwardTargets.length > 0) {
            additionalTargets.push(forwardTargets[0]);
        }
        if (backwardTargets.length > 0) {
            additionalTargets.push(backwardTargets[0]);
        }
        if (additionalTargets.length < 2 && forwardTargets.length > 1) {
            additionalTargets.push(forwardTargets[1]);
        } else if (additionalTargets.length < 2 && backwardTargets.length > 1) {
            additionalTargets.push(backwardTargets[1]);
        }
        return additionalTargets;
    }

    sellTower() {
        const refundAmount = Math.floor(this.scene.towerCost / 2);
        this.scene.playerGold.addGold(refundAmount);
        this.tileIndice.forEach(index => this.occupiedTiles.delete(index));
        let index = this.scene.towers.indexOf(this);
        this.scene.towers.splice(index, 1);
        this.destroy();
        this.hideDetails();
        this.sellButton.destroy();
    }

    destroy() {
        this.sprite.destroy();
    }


}

export class SlowTower {
    constructor(scene, x, y, texture, range, layerCasePlacement, occupiedTiles) {
        this.scene = scene;
        this.sprite = this.scene.add.sprite(x, y, texture).setScale(0.4).setAlpha(0.5);
        this.graphics = this.scene.add.graphics();
        this.x = x;
        this.y = y;
        this.layerCasePlacement = layerCasePlacement;
        this.occupiedTiles = occupiedTiles;
        this.range = range;
        this.affectedEnemies = new Set();
        this.rangeCircle = this.scene.add.graphics({ lineStyle: { width: 2, color: 0xff0000 } });
        this.rangeCircle.clear();
        this.rangeCircle.strokeCircle(x, y, this.range);
        this.rangeCircle.lineStyle(2, 0xff0000);
        this.tileIndice = null;

        this.sprite.on('pointerdown', () => {
            if (!this.scene.currentTower) {
                this.selected = !this.selected
                if (this.selected) {
                    this.showDetails(this.sprite.x, this.sprite.y);
                    this.sellButton = this.scene.add.text(10, 80, 'Vendre', {
                        font: '20px Arial', fill: '#ff0000', stroke: '#000000',
                        strokeThickness: 2
                    })
                        .setInteractive()
                        .on('pointerdown', () => {
                            this.sellTower();
                        });
                } else {
                    this.sellButton.destroy();
                    this.hideDetails();
                }
            }
        });

    }

    showDetails(x, y) {
        this.rangeCircle.strokeCircle(x, y, this.range);
        const attackPerSecond = (1000 / this.attackCooldown).toFixed(2);
        this.infoTowerContainer = this.scene.add.container(x, y - 50);
        const infoTowerGraphic = this.scene.add.graphics();
        const infoTowerText = this.scene.add.text(-40, -20,
            `Slow\nPortée: ${this.range}`,
            { font: '14px Arial', fill: '#ffffff' }
        );
        infoTowerGraphic.fillStyle(0x000000, 0.5);
        infoTowerGraphic.fillRoundedRect(-50, -30, 95, 50, 10);
        this.infoTowerContainer.add(infoTowerGraphic);
        this.infoTowerContainer.add(infoTowerText);
    }

    hideDetails() {
        this.rangeCircle.clear();
        if (this.infoTowerContainer) {
            this.infoTowerContainer.destroy();
        }
    }

    getTilesAround(X, Y) {
        return [
            this.layerCasePlacement.getTileAt(X, Y),
            this.layerCasePlacement.getTileAt(X + 1, Y),
            this.layerCasePlacement.getTileAt(X + 1, Y + 1),
            this.layerCasePlacement.getTileAt(X, Y + 1),
            this.layerCasePlacement.getTileAt(X - 1, Y + 1),
            this.layerCasePlacement.getTileAt(X - 1, Y),
            this.layerCasePlacement.getTileAt(X - 1, Y - 1),
            this.layerCasePlacement.getTileAt(X, Y - 1),
            this.layerCasePlacement.getTileAt(X + 1, Y - 1),
        ];
    }

    updatePosition(pointer) {
        this.layerCasePlacement.forEachTile(tile => {
            tile.setAlpha(0);
        });
        const worldPoint = pointer.positionToCamera(this.scene.cameras.main);
        const tileX = this.layerCasePlacement.worldToTileX(worldPoint.x);
        const tileY = this.layerCasePlacement.worldToTileY(worldPoint.y);
        this.sprite.setPosition(pointer.worldX, pointer.worldY - 25);
        this.rangeCircle.clear();
        this.rangeCircle.strokeCircle(pointer.worldX, pointer.worldY - 25, this.range);
        const tilesAround = this.getTilesAround(tileX, tileY);
        tilesAround.forEach(tile => {
            if (tile && tile.properties.TP) {
                tile.setAlpha(1);
            }
        });
    }

    place(pointer) {
        this.layerCasePlacement.forEachTile(tile => {
            tile.setAlpha(0);
        });
        const worldPoint = pointer.positionToCamera(this.scene.cameras.main);
        const tileX = this.layerCasePlacement.worldToTileX(worldPoint.x);
        const tileY = this.layerCasePlacement.worldToTileY(worldPoint.y);
        const tile = this.layerCasePlacement.getTileAt(tileX, tileY);
        if (!tile) return false;
        const centerX = tile.getCenterX();
        const centerY = tile.getCenterY();
        const tilesAround = this.getTilesAround(tileX, tileY);
        this.tileIndice = tilesAround.map(t => `${t.x},${t.y}`);
        if (tilesAround.every(tile => tile != null) && !this.tileIndice.some(index => this.occupiedTiles.has(index))) {
            this.animateCircle(centerX, centerY - 25);
            this.sprite.setPosition(centerX, centerY - 25);
            this.sprite.setInteractive();
            this.tileIndice.forEach(index => this.occupiedTiles.add(index));
            this.sprite.setAlpha(1);
            this.rangeCircle.clear();
            return true;
        }
        return false;
    }

    update(time, enemies) {
        enemies.forEach(enemy => {
            const distance = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, enemy.x, enemy.y);
            if (distance <= this.range) {
                if (!this.affectedEnemies.has(enemy)) {
                    enemy.originalSpeed = enemy.speed;
                    enemy.speed = enemy.speed / 2;
                    this.affectedEnemies.add(enemy);
                }
            } else {
                if (this.affectedEnemies.has(enemy)) {
                    enemy.speed = enemy.originalSpeed;
                    this.affectedEnemies.delete(enemy);
                }
            }
        });
    }

    animateCircle(x, y) {
        let alpha = 0;
        let increasing = true;

        this.scene.tweens.add({
            targets: { alpha: alpha },
            alpha: { from: 0, to: 1 },
            duration: 1000,
            repeat: -1,
            onUpdate: () => {
                this.graphics.clear();
                this.graphics.fillStyle(0x00ffff, alpha);
                this.graphics.lineStyle(2, 0x00ffff, alpha);
                this.graphics.beginPath();
                this.graphics.arc(x, y, this.range, 0, Math.PI * 2);
                this.graphics.fillPath();
                this.graphics.strokePath();

                if (increasing) {
                    alpha += 0.01;
                    if (alpha >= 1) {
                        increasing = false;
                    }
                } else {
                    alpha -= 0.01;
                    if (alpha <= 0) {
                        increasing = true;
                    }
                }
            },
            onComplete: () => {
                this.graphics.clear();
            }
        });
    }

    sellTower() {
        const refundAmount = Math.floor(this.scene.towerCost / 2);
        this.scene.playerGold.addGold(refundAmount);
        this.tileIndice.forEach(index => this.occupiedTiles.delete(index));
        let index = this.scene.towers.indexOf(this);
        this.scene.towers.splice(index, 1);
        this.destroy();
        this.hideDetails();
        this.sellButton.destroy();
    }

    destroy() {
        this.sprite.destroy();
        this.graphics.destroy();
    }
}

