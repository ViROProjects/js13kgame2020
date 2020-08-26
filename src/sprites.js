import { init, Sprite, SpriteSheet, keyPressed, collides } from 'kontra';
export let { canvas, context } = init();

let ptrImg = new Image();
ptrImg.src = 'assets/pattern-min.png';

let fscImg = new Image();
fscImg.src = 'assets/portrait_base-min.png';

let gdfsImg = new Image();
gdfsImg.src = 'assets/portrait_good-min.png';

let rgfsImg = new Image();
rgfsImg.src = 'assets/portrait_regular-min.png';
let bdfsImg = new Image();
bdfsImg.src = 'assets/portrait_bad-min.png';

let chrImg = new Image();
chrImg.src = 'assets/charv2-min.png';
export let chrSheet;
chrImg.onload = function () {
    chrSheet = SpriteSheet({
        image: chrImg,
        frameWidth: 32,
        frameHeight: 40,
        animations: {
            wait: {
                frames: [0, 0, 0, 1],
                loop: true,
                frameRate: 8
            },
            walk: {
                frames: [2, 3],
                frameRate: 8
            }
        }
    });
}

let hltImg = new Image();
hltImg.src = 'assets/life-min.png';
export let hltSheet;
hltImg.onload = function () {
    hltSheet = SpriteSheet({
        image: hltImg,
        frameWidth: 16,
        frameHeight: 16,
        animations: {
            wait: {
                frames: [0, 0, 0, 1],
                loop: true,
                frameRate: 8
            }
        }
    });
}

let bosImg = new Image();
bosImg.src = 'assets/404-min.png';
export let bosSheet;
bosImg.onload = function () {
    bosSheet = SpriteSheet({
        image: bosImg,
        frameWidth: 100,
        frameHeight: 64,
        animations: {
            wait: {
                frames: [0, 0, 0, 1],
                loop: true,
                frameRate: 8
            }
        }
    });
}


let badImg = new Image();
badImg.src = 'assets/bad3-min.png';
export let badSheet;
badImg.onload = function () {
    badSheet = SpriteSheet({
        image: badImg,
        frameWidth: 32,
        frameHeight: 32,
        animations: {
            walk: {
                frames: [0, 0, 0, 1],
                frameRate: 8
            }
        }
    });
}

let badImg2 = new Image();
badImg2.src = 'assets/bad2-min.png';
export let badSheet2;
badImg2.onload = function () {
    badSheet2 = SpriteSheet({
        image: badImg2,
        frameWidth: 32,
        frameHeight: 32,
        animations: {
            walk: {
                frames: [0, 0, 0, 1],
                frameRate: 8
            }
        }
    });
}

let badImg3 = new Image();
badImg3.src = 'assets/bad4-min.png';
export let badSheet3;
badImg3.onload = function () {
    badSheet3 = SpriteSheet({
        image: badImg3,
        frameWidth: 32,
        frameHeight: 32,
        animations: {
            walk: {
                frames: [0, 0, 0, 1],
                frameRate: 8
            }
        }
    });
}

let lockImg = new Image();
lockImg.src = 'assets/locks-min.png';
let lockSheet
lockImg.onload = function () {
    lockSheet = SpriteSheet({
        image: lockImg,
        frameWidth: 32,
        frameHeight: 32,
        animations: {
            lock: {
                frames: [0, 0, 0, 1],
                frameRate: 8
            },
            open: {
                frames: [2, 2, 2, 3],
                frameRate: 8
            }
        }
    });
}

//-------------
let assignEnemySprite = (op) => {
    let result;
    switch (op) {
        case 1:
            result = badSheet.animations;
            break;
        case 2:
            result = badSheet2.animations;
            break;
        case 3:
            result = badSheet3.animations;
            break;
        case 4:
            result = bosSheet.animations;
            break;
    }
    return result;
}
//-------------
export class Player extends Sprite.class {
    constructor(d) {
        super({
            x: 380,
            y: 440,
            defx: 0,
            defy: -1,
            inmun: 0,
            width: 32,
            height: 40,
            anchor: { x: 0, y: 0 },
            animations: chrSheet.animations,
            bulletsRef: d.bulletsRef,
            walls: d.walls,
            enemies: d.enemies,
            face: d.face,
            health: d.health
        });
    }
    update(dt) {
        this.dx = 0;
        this.dy = 0;

        if (keyPressed('up')) {
            this.dy = -3;
        }
        if (keyPressed('down')) {
            this.dy = 3;
        }
        if (keyPressed('left')) {
            this.dx = -3;
            this._fx = 1;
        }
        if (keyPressed('right')) {
            this.dx = 3;
            this._fx = -1;
        }

        if (this.dx != 0 || this.dy != 0) {
            this.defx = this.dx != 0 ? (Math.abs(this.dx) / this.dx) : 0;
            this.defy = this.dy != 0 ? (Math.abs(this.dy) / this.dy) : 0;
            this.playAnimation('walk');
        }
        else {
            this.playAnimation('wait');
        }
        if (keyPressed("space") && !this.bulletsRef.length) {
            let cx = this.x + (this.width / 2);
            let cy = this.y + (this.height / 2);
            this.bulletsRef.push(new Sprite({
                x: cx,
                y: cy,
                dx: this.defx * 3.2,
                dy: this.defy * 3.2,
                color: '#ff1500',
                radius: 10,
                time: 0.5,
                render: function () {
                    this.context.fillStyle = this.color;
                    this.context.beginPath();
                    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                    this.context.fill();
                },
                update: function (dt) {
                    this.time -= dt;
                    this.advance();
                }
            }));
        }
        for (let item of this.walls.filter(x => this.collidesWith(x))) {
            let downD = this.y > item.y;
            let upD = this.y + this.height <= item.y + item.height;
            let leftD = (item.x === this.x + this.width || item.x > this.x + this.width - 10);
            let rightD = (item.x + item.width === this.x || item.x + item.width - 10 < this.x);
            if (leftD && (downD || upD)) {
                this.x = item.x - this.width;
                this.dx = 0;
                break;
            }
            if (rightD && (downD || upD)) {
                this.x = item.x + item.width;
                this.dx = 0;
                break;
            }
            if (downD) {
                this.y = item.y + item.height;
                this.dy = 0;
                break;
            }
            else {
                this.y = item.y - this.height;
                this.dy = 0;
                break;
            }
        }
        if (this.enemies.filter(x => this.collidesWith(x)).length && this.inmun <= 0) {
            this.inmun = 1;
            this.width = this.width / 1.5;
            this.height = this.height / 1.5;
            this.face.shift();
            this.health.shift();
        }
        if (this.inmun >= 0) {
            this.inmun -= dt;
        }

        this.advance();
    }
}
export class Enemy extends Sprite.class {
    constructor(d) {
        super({
            x: d.x,
            y: d.y,
            width: d.type == 4 ?100: 32,
            height: d.type == 4 ?64:32,
            anchor: { x: 0, y: 0 },
            customType: d.type,
            playerRef: d.player,
            walls: d.walls,
            bulletsRef: d.bulletsRef,
            animations: assignEnemySprite(d.type),
            dx:d.type == 4?2:  (d.type == 2 ? -2 : 0) ,
            dy: d.type == 2 ? -2 : 0,
            health: d.type == 4 ? 10 : 2,
            inmun: 0,
            live: true
        });
    }
    update(dt) {
        let dx = this.playerRef.x - this.x;
        let dy = this.playerRef.y - this.y;
        switch (this.customType) {
            case 1:
                this.dx = 0;
                this.dy = 0;
                if ((this.x + 3 > this.playerRef.x) && (this.x - 3 < this.playerRef.x)) {
                    this.dy = (dy / Math.abs(dy)) * 2;
                }
                else {
                    this.dx = (dx / Math.abs(dx)) * 2;
                }
                break;
            case 2:
                for (let item of this.walls.filter(x => this.collidesWith(x))) {
                    let downD = this.y > item.y;
                    let upD = this.y + this.height <= item.y + item.height;
                    let leftD = (item.x === this.x + this.width || item.x > this.x + this.width - 10);
                    let rightD = (item.x + item.width === this.x || item.x + item.width - 10 < this.x);
                    if (leftD && (downD || upD)) {
                        this.x = item.x - this.width;
                        this.dx = -2;
                        break;
                    }
                    if (rightD && (downD || upD)) {
                        this.x = item.x + item.width;
                        this.dx = 2;
                        break;
                    }
                    if (downD) {
                        this.y = item.y + item.height;
                        this.dy = 2;
                        break;
                    }
                    else {
                        this.y = item.y - this.height;
                        this.dy = -2;
                        break;
                    }
                }
                break;
            case 3:
                this.dx = dx != 0 ? (dx / Math.abs(dx) + (dy == 0 ? (dx / Math.abs(dx)) : 0)) : 0;
                this.dy = dy != 0 ? (dy / Math.abs(dy) + (dx == 0 ? (dy / Math.abs(dy)) : 0)) : 0;
                break;
            case 4:
                this.dy = 0;    
                for (let item of this.walls.filter(x => this.collidesWith(x))) {
                    let downD = this.y > item.y;
                    let upD = this.y + this.height <= item.y + item.height;
                    let leftD = (item.x === this.x + this.width || item.x > this.x + this.width - 10);
                    let rightD = (item.x + item.width === this.x || item.x + item.width - 10 < this.x);
                    if (leftD && (downD || upD)) {
                        this.x = item.x - this.width;
                        this.dx = -3;
                        break;
                    }
                    if (rightD && (downD || upD)) {
                        this.x = item.x + item.width;
                        this.dx = 3;
                        break;
                    }
                }
                break;
        }
        if (this.bulletsRef.filter(x => this.collidesWith(x)).length && this.inmun <= 0) {
            this.inmun = 0.3;
            this.health -= 1;
            this.width = (this.width * (this.customType != 4 ? 0.7 : 0.9));
            this.height = (this.height * (this.customType != 4 ? 0.7 : 0.9));
        }
        if (this.inmun >= 0) {
            this.inmun -= dt;
            this.dx = this.dx * -1
            this.dy = this.dy * -1
        }
        if (this.health <= 0) {
            this.live = false;
        }
        this.advance();
    }
}
//--
export const facesArray = () => {
    return [
        Sprite({
            x: 760,
            y: 40,
            width: 32,
            height: 32,
            anchor: { x: 0, y: 0 },
            image: gdfsImg
        }),
        Sprite({
            x: 760,
            y: 40,
            width: 32,
            height: 32,
            anchor: { x: 0, y: 0 },
            image: rgfsImg
        }),
        Sprite({
            x: 760,
            y: 40,
            width: 32,
            height: 32,
            anchor: { x: 0, y: 0 },
            image: bdfsImg
        })
    ]
};
export const designArray = () => {
    return [
        Sprite({
            x: 0,
            y: 0,
            color: '#DCDCDC',
            width: 800,
            height: 600,
            anchor: { x: 0, y: 0 }
        }),
        Sprite({
            x: 0,
            y: 80,
            color: '#FFFFFF',
            width: 800,
            height: 490,
            anchor: { x: 0, y: 0 }
        }),
        Sprite({
            x: 10,
            y: 50,
            color: '#FFFFFF',
            width: 720,
            height: 20,
            anchor: { x: 0, y: 0 }
        }),
        Sprite({
            x: 0,
            y: 0,
            color: '#4682B4',
            width: 800,
            height: 25,
            anchor: { x: 0, y: 0 }
        }),
        Sprite({
            x: 10,
            y: 575,
            color: '#696969',
            width: 700,
            height: 20,
            anchor: { x: 0, y: 0 }
        }),
        Sprite({
            x: 11,
            y: 576,
            color: '#F8F8FF',
            width: 698,
            height: 18,
            anchor: { x: 0, y: 0 }
        }),

        Sprite({
            x: 740,
            y: 5,
            color: '#1E90FF',
            width: 15,
            height: 15,
            anchor: { x: 0, y: 0 }
        }),
        Sprite({
            x: 760,
            y: 5,
            color: '#1E90FF',
            width: 15,
            height: 15,
            anchor: { x: 0, y: 0 }
        }),
        Sprite({
            x: 780,
            y: 5,
            color: '#B22222',
            width: 15,
            height: 15,
            anchor: { x: 0, y: 0 }
        }),
        Sprite({
            x: 755,
            y: 35,
            color: '#FFFFFF',
            width: 40,
            height: 40,
            anchor: { x: 0, y: 0 }
        }),

        Sprite({
            x: 9,
            y: 89,
            color: '#696969',
            width: 782,
            height: 52,
            anchor: { x: 0, y: 0 }
        }),
        Sprite({
            x: 9,
            y: 139,
            color: '#696969',
            width: 52,
            height: 422,
            anchor: { x: 0, y: 0 }
        }),
        Sprite({
            x: 9,
            y: 509,
            color: '#696969',
            width: 782,
            height: 52,
            anchor: { x: 0, y: 0 }
        }),
        Sprite({
            x: 739,
            y: 139,
            color: '#696969',
            width: 52,
            height: 422,
            anchor: { x: 0, y: 0 }
        }),

        Sprite({
            x: 62,
            y: 142,
            color: '#e6dfb3',
            width: 676,
            height: 400,
            anchor: { x: 0, y: 0 }
        }),
        Sprite({
            x: 62,
            y: 142,
            width: 676,
            height: 400,
            anchor: { x: 0, y: 0 },
            render: function () {
                let pattern = context.createPattern(ptrImg, 'repeat');
                this.context.rect(this.x, this.y, this.width, this.height);
                this.context.fillStyle = pattern;
                this.context.fill();
            }
        }),
        Sprite({
            x: 760,
            y: 40,
            color: '#8B0000',
            width: 32,
            height: 32,
            anchor: { x: 0, y: 0 },
            image: fscImg
        })
    ]
}

export const wallsArray = () => {
    return [
        Sprite({
            x: 10,
            y: 90,
            color: '#522524',
            width: 780,
            height: 50,
            anchor: { x: 0, y: 0 }
        }), Sprite({
            x: 10,
            y: 140,
            color: '#522524',
            width: 50,
            height: 420,
            anchor: { x: 0, y: 0 }
        }), Sprite({
            x: 10,
            y: 510,
            color: '#522524',
            width: 780,
            height: 50,
            anchor: { x: 0, y: 0 }
        }), Sprite({
            x: 740,
            y: 140,
            color: '#522524',
            width: 50,
            height: 420,
            anchor: { x: 0, y: 0 }
        })
    ]
};

export const healthArray = () => {
    return [
        Sprite({
            x: 735,
            y: 30,
            color: '#8B0000',
            width: 16,
            height: 16,
            anchor: { x: 0, y: 0 },
            animations: hltSheet.animations
        }), Sprite({
            x: 735,
            y: 45,
            color: '#8B0000',
            width: 16,
            height: 16,
            anchor: { x: 0, y: 0 },
            animations: hltSheet.animations
        }), Sprite({
            x: 735,
            y: 60,
            color: '#8B0000',
            width: 16,
            height: 16,
            anchor: { x: 0, y: 0 },
            animations: hltSheet.animations
        })
    ]
};

export const doorsArray = () => {
    return [
        Sprite({
            x: 370,
            y: 90,
            color: '#A9A9A9',
            width: 50,
            height: 50,
            anchor: { x: 0, y: 0 }
        })
    ]
};

export const newLoading = () => {
    return new Sprite({
        x: 11,
        y: 576,
        color: '#87CEEB',
        width: 50,
        height: 18,
        anchor: { x: 0, y: 0 }
    })
}

export class LockSprite extends Sprite.class {
    constructor(d) {
        super({
            x: 370,
            y: 90,
            color: '#A9A9A9',
            width: 50,
            height: 50,
            anchor: { x: 0, y: 0 },
            animations: lockSheet.animations,
            enemies: d.enemies,
            spriteok: d.spriteok,
            spritebar: d.spritebar,
            barwidth: 698,
            originalenesize: d.enemies.length
        });
    }
    update(dt) {
        if (this.enemies.length) {
            this.playAnimation('lock');
        }
        else {
            this.playAnimation('open');
            this.spriteok.color = "#45ff01";
        }
        this.spritebar.width = (this.barwidth / this.originalenesize) * (this.originalenesize - this.enemies.length)
        this.advance();
    }
}

export const newLoaded = () => {
    return new Sprite({
        x: 780,
        y: 585,
        color: '#FFFF00',
        radius: 10,

        render: function () {
            this.context.fillStyle = this.color;

            this.context.beginPath();
            this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            this.context.fill();
        }
    })
}

export const babyText = function (text, color, x, y, size, style) {
    context.fillStyle = color;
    context.font = `${style} ${size}px Courier New`;
    context.textBaseline = 'top';
    context.fillText(text, x, y);
}
