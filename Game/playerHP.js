export class PlayerHealth {
    constructor(scene, initialHealth = 20) {
        this.scene = scene;
        this.health = initialHealth;
        this.healthText = this.scene.add.text(16, 16, `${this.health}`, {
            fontSize: '32px',
            fill: '#FF0000',
            stroke: '#000000',
            strokeThickness: 2
        });
    }

    loseHealth(amount = 1) {
        this.health -= amount;
        this.updateHealthDisplay();

        if (this.health <= 0) {
            this.gameOver();
        }
    }

    updateHealthDisplay() {
        this.healthText.setText(`${this.health}`);
    }

    gameOver() {
        this.scene.cache.tilemap.remove('map');
        this.scene.scene.restart();
    }
}
