export class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, path, hp, speed, animation) {
        super(scene, x, y);
        this.scene = scene;
        this.path = path;
        this.hp = hp;
        this.speed = speed;
        this.follower = 0;

        this.scene.add.existing(this).setScale(0.50);
        this.play(animation);
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0 && this.scene) {
            this.scene.playerGold.addGold(1);
            this.destroy();
        }
    }

    playerDamage() {
        if (this.scene && this.scene.playerHealth) {
            this.scene.playerHealth.loseHealth(1);
        }
        this.destroy();
    }

    getCurrentPoint() {
        const segment = this.path.length - 1;
        const t = this.follower * segment;
        const currentIndex = Math.floor(t);
        const nextIndex = currentIndex + 1;

        if (nextIndex >= this.path.length) return this.path[this.path.length - 1];

        const startPoint = this.path[currentIndex];
        const endPoint = this.path[nextIndex];

        const localT = t - currentIndex;
        return {
            x: Phaser.Math.Linear(startPoint.x, endPoint.x, localT),
            y: Phaser.Math.Linear(startPoint.y, endPoint.y, localT)
        };
    }

    update(time, delta) {
        this.follower += this.speed * delta / 1000;
        if (this.follower >= 1) {
            this.playerDamage();
            return;
        }
        const pos = this.getCurrentPoint();
        this.setPosition(pos.x, pos.y);
    }
}

export class WaveManager {
    constructor(scene, final_path) {
        this.scene = scene;
        this.final_path = final_path;
        this.currentWaveIndex = 0;
        this.waveData = [];
        this.currentWave = null;
        this.enemiesRemaining = 0;
        this.allWavesSent = false;
        this.timerText = null;
    }

    addWave(enemyType, numberOfEnemies, delayBetweenSpawns, speed, hp) {
        this.waveData.push({
            enemyType,
            numberOfEnemies,
            delayBetweenSpawns,
            speed,
            hp
        });
    }

    startWaveCountdown() {
        this.timerText = this.scene.add.text(395, 50, '10', {
            fontSize: '64px', fill: '#fff', stroke: '#000000',
            strokeThickness: 2
        });
        let countdown = 10;
        let countdownEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                countdown--;
                this.timerText.setText(countdown);
                if (countdown <= 0) {
                    this.timerText.destroy();
                    this.startNextWave();
                    countdownEvent.remove();
                }
            },
            repeat: 9
        });
    }

    startNextWave() {
        if (this.currentWaveIndex >= this.waveData.length) {
            console.log("Toutes les vagues ont été terminées !");
            this.allWavesSent = true;
            return;
        }

        let enemiesSpawned = 0;
        const currentWave = this.waveData[this.currentWaveIndex];

        this.scene.time.addEvent({
            delay: currentWave.delayBetweenSpawns,
            repeat: currentWave.numberOfEnemies - 1,
            callback: () => {
                let enemy = new Enemy(this.scene, this.final_path[0].x, this.final_path[0].y, this.final_path, currentWave.hp, currentWave.speed, currentWave.enemyType);
                this.scene.enemies.push(enemy);
                enemiesSpawned++;
                this.enemiesRemaining++;
                if (enemiesSpawned >= currentWave.numberOfEnemies) {
                    this.currentWaveIndex++;
                    this.startNextWave();
                }
            },
        });
    }

    allWavesCompleted() {
        return this.allWavesSent && this.enemiesRemaining === 0;
    }

    enemyDestroyed() {
        this.enemiesRemaining--;
    }
}
