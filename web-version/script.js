class CelestialBody {
    constructor(x, y, vx, vy, mass, radius, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.mass = mass;
        this.radius = radius;
        this.color = color;
        this.prevPoints = [];
    }
}

const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const G = 5;
const MAX_LENGTH = 500;
let frameCount = 0;
let bodies = [];

bodies.push(new CelestialBody(400, 400, 0, 0, 50000, 30, 'yellow'));
bodies.push(new CelestialBody(500, 400, 0, 50, 10, 8, 'cyan'));
bodies.push(new CelestialBody(300, 400, 0, -58, 10, 8, 'magenta'));

function loop() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let dt = 1.0 / 60;
    frameCount++;
    let toRemove = new Set();

    for (let i = 0; i < bodies.length; i++) {
        let body = bodies[i];
        let totalAccX = 0;
        let totalAccY = 0;

        for (let j = 0; j < bodies.length; j++) {
            if (i === j) continue;
            let other = bodies[j];

            let dx = other.x - body.x;
            let dy = other.y - body.y;
            let distSq = dx * dx + dy * dy;
            let dist = Math.sqrt(distSq);

            if (dist < 1) continue;

            if (dist < (body.radius + other.radius)) {
                let p1 = body.mass * Math.sqrt(body.vx ** 2 + body.vy ** 2);
                let p2 = other.mass * Math.sqrt(other.vx ** 2 + other.vy ** 2);
                toRemove.add(p1 > p2 ? other : body);
            }

            let accel = (G * other.mass) / distSq;
            totalAccX += (dx / dist) * accel;
            totalAccY += (dy / dist) * accel;
        }

        body.vx += totalAccX * dt;
        body.vy += totalAccY * dt;

        if (Math.abs(body.x) > 2000 || Math.abs(body.y) > 2000) {
            toRemove.add(body);
        }
    }

    bodies = bodies.filter(body => !toRemove.has(body));

    bodies.forEach(body => {
        body.x += body.vx * dt;
        body.y += body.vy * dt;

        if (frameCount % 5 === 0) {
            body.prevPoints.push({x: body.x, y: body.y});
            if (body.prevPoints.length > MAX_LENGTH) body.prevPoints.shift();
        }

        ctx.strokeStyle = body.color;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        body.prevPoints.forEach((p, index) => {
            if (index === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        ctx.fillStyle = body.color;
        ctx.beginPath();
        ctx.arc(body.x, body.y, body.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    document.getElementById('planetCount').innerText = `Objects: ${bodies.length}`;
    requestAnimationFrame(loop);
}

loop();