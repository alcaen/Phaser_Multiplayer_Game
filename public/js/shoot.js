class Shoot extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, angle) {
        // Super
        super(scene, x, y, "bullet");
        // Render
        scene.add.existing(this);
        // Physics Rendering
        scene.physics.add.existing(this);

        // Set Angle
        this.setAngle(angle);
        this.setCollideWorldBounds(true);

        this.bullet_speed = 800;
        scene.bullets.add(this);

        // layer depth
        this.depth = 0;
        // DEG to RAD
        angle = angle * (Math.PI / 180);
        this.vx = this.bullet_speed * Math.cos(angle);
        this.vy = this.bullet_speed * Math.sin(angle);

        this.setVelocity(this.vx, this.vy);
    }
}