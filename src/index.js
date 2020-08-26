import { init, Sprite, SpriteSheet, GameLoop, initKeys, keyPressed, getPointer } from 'kontra';
import { Player, Enemy, facesArray, designArray, wallsArray, healthArray, doorsArray, newLoading, newLoaded, babyText, LockSprite, chrSheet, badSheet, badSheet2, badSheet3 } from './sprites'
initKeys();
let positionArray = [];
let enemyCount = 0;
class BeginScene {
    constructor() {
        this.backgroud = new Sprite({
            x: 0,
            y: 0,
            width: 800,
            height: 600,
            color: "#FFF"
        });
        this.backgroud2 = new Sprite({
            x: 0,
            y: 0,
            width: 800,
            height: 600,
            color: "#FFF"
        });
        this.transition = new Sprite({
            x: 400,
            y: 300,
            radius: 0,
            color: "#000",
            anchor: { x: 0.5, y: 0.5 },
            render: function () {
                this.context.fillStyle = this.color;
                this.context.beginPath();
                this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                this.context.fill();
            }
        });
        this.timer = 0;
        this.finish = false;
        this.next = 2;
    }
    update(dt) {
        this.timer += dt;
        this.backgroud2.x += dt * 250;
        if (this.timer >= 3.5) {
            this.transition.radius += dt * 700;
        }
        if (this.timer >= 4.5) {
            this.finish = true;
        }
    }
    render() {
        this.backgroud.render();
        babyText('js13kgames', '#a80e00', 205, 265, 64, 'bold');
        this.backgroud2.render();
        this.transition.render();
    }
}
class StartScene {
    constructor() {
        this.backgroud = new Sprite({
            x: 0,
            y: 0,
            width: 800,
            height: 600,
            color: "#FFF"
        });
        positionArray = [
            [],
            [{ x: 100, y: 170 }],
            [{ x: 100, y: 170 }, { x: 670, y: 170 }],
            [{ x: 100, y: 170 }, { x: 670, y: 170 }, { x: 370, y: 170 }],
            [{ x: 100, y: 290 }, { x: 670, y: 170 }, { x: 670, y: 290 }],
            [{ x: 100, y: 290 }, { x: 670, y: 170 }, { x: 670, y: 290 }],
            [{ x: 100, y: 170 }, { x: 670, y: 170 }, { x: 100, y: 290 }, { x: 670, y: 290 }],
            [{ x: 100, y: 440 }, { x: 370, y: 170 }, { x: 670, y: 440 }],
            [{ x: 100, y: 170 }, { x: 670, y: 170 }, { x: 100, y: 440 }, { x: 670, y: 440 }],
            [{ x: 100, y: 290 }, { x: 670, y: 290 }, { x: 100, y: 440 }, { x: 670, y: 440 }],
            [{ x: 100, y: 170 }, { x: 670, y: 170 }, { x: 370, y: 170 }, { x: 100, y: 440 }, { x: 670, y: 440 }],
            [{ x: 100, y: 170 }, { x: 670, y: 170 }, { x: 370, y: 170 }, { x: 100, y: 440 }, { x: 670, y: 440 }],
            [{ x: 100, y: 170 }, { x: 670, y: 170 }, { x: 370, y: 170 }, { x: 100, y: 290 }, { x: 670, y: 290 }, { x: 100, y: 440 }, { x: 670, y: 440 }],
            [{ x: 370, y: 170 }]
        ];
        this.timer = 0;
        this.finish = false;
        this.next = 3;
        this.starting = false;
        this.sprites = [
            new Sprite({
                x: 160,
                y: 480,
                width: 32,
                height: 32,
                animations: badSheet3.animations
            }),
            new Sprite({
                x: 280,
                y: 480,
                width: 32,
                height: 32,
                animations: badSheet2.animations
            }),
            new Sprite({
                x: 400,
                y: 480,
                width: 32,
                height: 32,
                animations: badSheet.animations
            }),
            new Sprite({
                x: 520,
                y: 472,
                width: 32,
                height: 40,
                animations: chrSheet.animations
            })
        ];
        this.transition = new Sprite({
            x: 400,
            y: 300,
            radius: 0,
            color: "#000",
            anchor: { x: 0.5, y: 0.5 },
            render: function () {
                this.context.fillStyle = this.color;
                this.context.beginPath();
                this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                this.context.fill();
            }
        });
        enemyCount = 0;
    }
    update(dt) {
        for (let item of this.sprites) {
            item.update();
        }
        if (!this.starting && keyPressed('enter')) {
            this.starting = true;
        }
        if (this.starting) {
            this.timer += dt;
            this.transition.radius += dt * 700;
        }
        if (this.timer > 1.2) {
            this.finish = true;
        }

    }
    render() {
        this.backgroud.render();
        babyText("° Can't find the page °", '#949494', 45, 100, 40, 'bold');
        babyText("A little game about error 404", '#000', 45, 200, 20, 'bold');
        babyText("- TOP-DOWN View", '#000', 45, 250, 20, 'bold');
        babyText("- Move with arrows", '#000', 45, 300, 20, 'bold');
        babyText("- Shoot with space", '#000', 45, 350, 20, 'bold');
        babyText("- 13 rooms + bossfight", '#000', 45, 400, 20, 'bold');
        babyText("Press Enter to start", '#949494', 45, 550, 20, 'bold');
        babyText("By ViRO", '#949494', 500, 550, 16, 'bold');
        for (let item of this.sprites) {
            item.render();
        }
        this.transition.render();
    }
}
class GameOver {
    constructor() {
        this.backgroud = new Sprite({
            x: 0,
            y: 0,
            width: 800,
            height: 600,
            color: "#000"
        });
        this.finish = false;
        this.next = 1;
    }
    update(dt) {
        if (keyPressed('enter')) {
            this.finish = true;
        }
    }
    render() {
        this.backgroud.render();
        babyText('500', '#a80e00', 205, 265, 64, 'bold');
        babyText("Press Enter restart", '#949494', 45, 550, 20, 'bold');
    }
}
class VictoryScene {
    constructor() {
        this.backgroud = new Sprite({
            x: 0,
            y: 0,
            width: 800,
            height: 600,
            color: "#FFF"
        });
        this.finish = false;
        this.next = 1;
    }
    update(dt) {
        if (keyPressed('enter')) {
            this.finish = true;
        }
    }
    render() {
        this.backgroud.render();
        babyText('Victory!', '#949494', 205, 150, 64, 'bold');
        babyText('Thanks for playing', '#949494', 205, 300, 42, 'bold');
        babyText("Press Enter restart", '#949494', 45, 550, 20, 'bold');
    }
}
class MyScene {
    constructor() {
        this.transition = new Sprite({
            x: 400,
            y: 130,
            radius: 0,
            color: "#000",
            anchor: { x: 0.5, y: 0.5 },
            render: function () {
                this.context.fillStyle = this.color;
                this.context.beginPath();
                this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                this.context.fill();
            }
        });
        this.enemiesPositions = positionArray.shift();
        this.finish = false;
        this.pong = true;
        this.bullet = [];
        this.health = healthArray();
        this.faces = facesArray();
        this.walls = wallsArray();

        this.loading = newLoading();
        this.loaded = newLoaded();
        this.enemies = [];


        this.PLY = new Player({
            bulletsRef: this.bullet,
            walls: this.walls,
            enemies: this.enemies,
            face: this.faces,
            health: this.health
        });
        for (let i = 0; i < this.enemiesPositions.length; i++) {
            this.enemies.push(

                new Enemy({
                    x: this.enemiesPositions[i].x,
                    y: this.enemiesPositions[i].y,
                    type: (enemyCount == 13 ? 4 : Math.floor(Math.random() * (3 - 1 + 1) + 1)),
                    player: this.PLY,
                    walls: this.walls,
                    bulletsRef: this.bullet
                })
            );
        }
        this.lockImg = new LockSprite({ enemies: this.enemies, spriteok: this.loaded, spritebar: this.loading });
        this.design = designArray();
        this.doors = doorsArray();

        this.timer = 0;
        this.finish = false;
        this.next = 2;

        this.starting = false;
        this.spawnlim = 0;
    }
    update(dt) {
        this.PLY.update(dt);
        for (let item of this.health) {
            item.update(dt);
        }
        for (let item of this.enemies) {
            item.update(dt);
        }
        this.lockImg.update();
        for (let item of this.bullet) {
            item.update(dt);
        }
        if (this.bullet.length) {
            let ii = 0;
            do {
                if (this.bullet[ii].time <= 0) {
                    this.bullet.splice(ii, 1);
                }
                else {
                    ii += 1;
                }
            } while (ii < this.bullet.length);
        }
        if (this.enemies.length) {
            let ii = 0;
            do {
                if (!this.enemies[ii].live) {
                    this.enemies.splice(ii, 1);
                }
                else {
                    ii += 1;
                }
            } while (ii < this.enemies.length);
        }
        if (this.health.length == 0) {
            this.finish = true;
            this.next = 4;
        }

        if (this.enemies.length == 0 && !this.starting && this.lockImg.collidesWith(this.PLY)) {
            this.starting = true;
        }
        if (this.starting) {
            this.timer += dt;
            this.transition.radius += dt * 1000;
        }
        if (this.timer > 1 && this.starting && !this.finish) {
            enemyCount += 1;
            if (enemyCount == 14) {
                this.next = 5;
            }
            else {
                this.next = 3;
            }
            this.finish = true;
        }
        if (enemyCount == 13 && this.spawnlim >= 5 && this.enemies.length && this.enemies[0].customType == 4) {
            this.spawnlim = 0;
            this.enemies.push(
                new Enemy({
                    x: this.pong ? 100 : 670,
                    y: 440,
                    type: Math.floor(Math.random() * (3 - 1 + 1) + 1),
                    player: this.PLY,
                    walls: this.walls,
                    bulletsRef: this.bullet
                })
            );
            this.pong = !this.pong;
            this.lockImg.originalenesize = this.enemies.length
        }
        else if (enemyCount == 13) {
            this.spawnlim += dt;
        }
    }
    render() {
        for (let item of this.design) {
            item.render();
        }
        for (let item of this.walls) {
            item.render();
        }
        for (let item of this.doors) {
            item.render();
        }
        for (let item of this.health) {
            item.render();
        }
        for (let item of this.bullet) {
            item.render();
        }


        this.loaded.render();
        this.loading.render();
        this.PLY.render();
        for (let item of this.enemies) {
            item.render();
        }
        this.lockImg.render();
        this.faces[0].render();
        babyText(`https://js${enemyCount}kgames.com/submit`, '#000000', 15, 55, 16, '');
        babyText(`Error 404 Page not found`, '#FFFFFF', 20, 5, 16, '');

        babyText(`-`, '#FFFFFF', 742, 5, 16, '');
        babyText(`*`, '#FFFFFF', 762, 6, 16, '');
        babyText(`x`, '#FFFFFF', 782, 5, 16, '');

        this.transition.render();
    }

}

class Manager {
    constructor() {
        this.scene = this.getScene(1);
        this.gameloop = GameLoop({
            update: (dt) => {
                this.scene.update(dt);
                if (this.scene.finish) {
                    this.scene = this.getScene(this.scene.next);
                }
            },
            render: () => {
                this.scene.render();
            }
        });

    }
    getScene(op) {
        let result;
        switch (op) {
            case 1:
                result = new BeginScene();
                break;
            case 2:
                result = new StartScene();
                break;
            case 3:
                result = new MyScene();
                break;
            case 4:
                result = new GameOver();
                break;
            case 5:
                result = new VictoryScene();
                break;
        }
        return result;
    }
}

let myManager = new Manager();
myManager.gameloop.start();
