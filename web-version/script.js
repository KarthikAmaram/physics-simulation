const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let x = 100;
let y = 100;

class CelestialBody {
    constructor(x, y, vx, vy, radius, mass) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.mass = mass;
        this.prevPoints = [];
    }

}

let planet = new CelestialBody(200, 200, 2, 1, 100, 15);

function loop() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // x += 2;
    // y += 1;

    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
    ctx.fill();

    planet.x += planet.vx;
    planet.y += planet.vy;
    requestAnimationFrame(loop);

}


loop();


