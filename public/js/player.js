class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        // Super
        super(scene, x, y, "player");
        // Render
        scene.add.existing(this);
        // Physics Rendering
        scene.physics.add.existing(this);

        this.player_speed = 600;
        this.depth = 5;
        // Holds Scene
        this.scene = scene;

        this.setInteractive();
        this.setCollideWorldBounds(true);

        self = this;
        // Input Handlers
        this.keyUp = scene.input.keyboard.addKey('W');
        this.keyLeft = scene.input.keyboard.addKey('A');
        this.keyDown = scene.input.keyboard.addKey('S');
        this.keyRight = scene.input.keyboard.addKey('D');

        scene.physics.add.collider(this, scene.bullets, function() {
            alert('Vampire Punch');
        });
        // Rotate
        scene.input.on("pointermove", function(pointer) {
            this.angle = Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.Between(this.x, this.y, pointer.x, pointer.y);
            this.setAngle(this.angle);
        }, this);
        scene.input.keyboard.on('keydown-F', function() {
            // new Shoot(self.scene, self.x, self.y, self.angle);
            // Player Method Shoot
            var x = self.x;
            var y = self.y;
            var angle = self.angle;
            self.scene.io.emit('new_bullet', {
                x: x,
                y: y,
                angle: angle,
            });
        });
        this.old_x = this.x;
        this.old_y = this.y;
        this.old_angle = this.angle;
    }
    update() {
        this.setVelocity(0, 0);
        if (this.keyUp.isDown) {
            this.setVelocityY(this.player_speed * -1);
        } else if (this.keyDown.isDown) {
            this.setVelocityY(this.player_speed);
        }
        if (this.keyRight.isDown) {
            this.setVelocityX(this.player_speed);
        } else if (this.keyLeft.isDown) {
            this.setVelocityX(this.player_speed * -1);
        }
        var x = this.x;
        var y = this.y;
        var angle = this.angle;

        if (x != this.old_x || y != this.old_y || angle != this.old_angle) {
            // Send Socket To Server
            this.scene.io.emit('player_moved', {
                x: x,
                y: y,
                angle: angle
            });
            this.old_x = x;
            this.old_y = y;
            this.old_angle = angle;
        }
    }
}