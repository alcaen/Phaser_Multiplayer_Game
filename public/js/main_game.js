var window_height = window.innerHeight;
var window_width = window.innerWidth;

var config = {
    type: Phaser.AUTO,
    width: window_width,
    height: window_height,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0,
            },
            fps: 60,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
}
// Holds a game instance
var game = new Phaser.Game(config);
var player;
var player_init = false;

function preload() {
    this.load.image('player', '/public/resources/img/player.png');
    this.load.image('bullet', '/public/resources/img/donut.png');
    this.load.image('enemy', '/public/resources/img/Arararararararagi.png');

}

function create() {
    this.io = io();

    self = this;

    this.enemies = this.physics.add.group();
    this.bullets = this.physics.add.group();

    this.io.on('actualPlayers', function(players) {
        Object.keys(players).forEach(function(id) {
            if (players[id].player_id == self.io.id) {
                createPlayer(self, players[id].x, players[id].y);
            } else {
                // creating other players
                createEnemy(self, players[id]);
            }
        });
    });
    // this.player = new Player(this, 500, 500);
    this.io.on('new_player', function(pInfo) {
        createEnemy(self.scene, pInfo);
    });
    enemies_ref = this.enemies;
    this.io.on('enemy_moved', function(player_data) {
        enemies_ref.getChildren().forEach(function(enemy) {
            if (player_data.id == enemy.id) {
                enemy.setPosition(player_data.x, player_data.y);
                enemy.setAngle(player_data.angle);
            }
        });
    });
    this.io.on('new_bullet', function(bullet_data) {
        new Shoot(self.scene, bullet_data.x, bullet_data.y, bullet_data.angle)
    });
}

function update() {
    if (this.player_init == true) {
        this.player.update();
    }
}

function createPlayer(scene, x, y) {
    scene.player_init = true;
    scene.player = new Player(scene, x, y);
}

function createEnemy(scene, enemy_info) {
    const enemy = new Enemy(scene, enemy_info.x, enemy_info.y, enemy_info.id);
    scene.enemies.add(enemy);
}