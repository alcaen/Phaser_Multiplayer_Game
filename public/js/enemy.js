class Enemy extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, id) {
        // Super
        super(scene, x, y, "enemy");
        // Render
        scene.add.existing(this);
        // Physics Rendering
        scene.physics.add.existing(this);

        this.depth = 5;
        this.id = id;

    }
    shoot() {
        new Shoot(this.scene, this.x, this.y, this.angle);
        new Shoot(this.scene, this.x, this.y, this.angle);
    }
}