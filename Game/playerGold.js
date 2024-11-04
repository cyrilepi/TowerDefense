export class PlayerGold {
    constructor(scene, initialGold) {
        this.scene = scene;
        this.gold = initialGold;
        this.goldText = this.scene.add.text(16, 48, `${this.gold}`, {
            fontSize: '32px',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 2
        });
    }

    addGold(amount) {
        this.gold += amount;
        this.updateGoldDisplay();
    }

    checkGold(amount) {
        if (this.gold >= amount) {
            return true;
        }
        return false;
    }

    spendGold(amount) {
            this.gold -= amount;
            this.updateGoldDisplay();
    }

    updateGoldDisplay() {
        this.goldText.setText(`${this.gold}`);
    }

    NotEnoughGoldMessage() {
        const message = this.scene.add.text(400, 100, 'Pas assez d\'or', {
            fontSize: '32px',
            fill: '#FF0000',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.scene.tweens.add({
            targets: message,
            alpha: 0,
            duration: 1500,
            ease: 'Power1',
            onComplete: () => {
                message.destroy();
            }
        });
    }
}
