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
        this.ax = 0;
        this.ay = 0;
    }
}

const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const G = 5;
const MAX_LENGTH = 500;
const startingMass = 10;
const startingRadius = 8;
let frameCount = 0;
let bodies = [];

let startPoint = null;
let currentPoint = null;
let endPoint = null;
let isDragging = false;
let leadBody = null;
let startTime;

bodies.push(new CelestialBody(400, 400, 0, 0, 50000, 30, 'yellow'));
bodies.push(new CelestialBody(500, 400, 0, 50, 10, 8, 'cyan'));
bodies.push(new CelestialBody(300, 400, 0, -58, 10, 8, 'magenta'));

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    startPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    isDragging = true;
    startTime = Date.now();
})

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        currentPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
})

canvas.addEventListener('mouseup', (e) => {
    if (isDragging) {
        const duration = Date.now() - startTime;
        const rect = canvas.getBoundingClientRect();
        const endPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };

        const vx = (startPoint.x - endPoint.x) * 0.1;
        const vy = (startPoint.y - endPoint.y) * 0.1;

        let massMultiplier = duration * 0.009;
        if (massMultiplier < 1) massMultiplier = 1;

        let radiusMultiplier = duration * 0.00015;
        if (radiusMultiplier < 1) radiusMultiplier = 1;
        bodies.push(new CelestialBody(startPoint.x, startPoint.y, vx, vy, startingMass * massMultiplier,
            startingRadius * radiusMultiplier, 'white'));

        startPoint = null;
        currentPoint = null;
        isDragging = false;
    }
})

function loop() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let dt = 1.0 / 60;
    frameCount++;
    let toRemove = new Set();

    if (bodies.length > 0) {
        leadBody = bodies.reduce((prev, curr) => (curr.mass > prev.mass) ? curr : prev);
    }

    for (let i = 0; i < bodies.length; i++) {
        let body = bodies[i];

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
            body.ax += (dx / dist) * accel;
            body.ay += (dy / dist) * accel;
        }

        if (Math.abs(body.x) > 2000 || Math.abs(body.y) > 2000) {
            toRemove.add(body);
        }
    }

    bodies = bodies.filter(body => !toRemove.has(body));

    bodies.forEach(body => {
        body.vx += body.ax * dt;
        body.vy += body.ay * dt;

        body.ax = 0;
        body.ay = 0;

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

        ctx.fillStyle = (body === leadBody) ? 'yellow' : body.color;
        ctx.beginPath();
        ctx.arc(body.x, body.y, body.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    if (startPoint && currentPoint) {
        let duration = Date.now() - startTime;
        let radiusMultiplier = duration * 0.00015;
        if (radiusMultiplier < 1) radiusMultiplier = 1;
        let previewRadius = startingRadius * radiusMultiplier;

        ctx.globalAlpha = 0.5;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, previewRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();

        let ghostX = startPoint.x;
        let ghostY = startPoint.y;
        let ghostVX = (startPoint.x - currentPoint.x) * 0.1;
        let ghostVY = (startPoint.y - currentPoint.y) * 0.1;
        let ghostDT = 0.005;

        ctx.strokeStyle = 'rgba(255, 120, 0, 0.6)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(ghostX, ghostY);

        for (let i = 0; i < 2000; i++) {
            let totalAccX = 0;
            let totalAccY = 0;

            bodies.forEach(other => {
                let dx = other.x - ghostX;
                let dy = other.y - ghostY;
                let distSq = dx * dx + dy * dy;
                let dist = Math.sqrt(distSq);

                if (dist < 1) return;

                let accel = (G * other.mass) / distSq;
                totalAccX += (dx / dist) * accel;
                totalAccY += (dy / dist) * accel;
            });

            ghostVX += totalAccX * ghostDT;
            ghostVY += totalAccY * ghostDT;
            ghostX += ghostVX * ghostDT;
            ghostY += ghostVY * ghostDT;

            if (leadBody) {
                let dxSun = ghostX - leadBody.x;
                let dySun = ghostY - leadBody.y;
                let distToSunSq = dxSun * dxSun + dySun * dySun;
                let combinedRadius = leadBody.radius + previewRadius;

                if (distToSunSq < (combinedRadius * combinedRadius)) {
                    break;
                }
            }

            ctx.lineTo(ghostX, ghostY);
        }

        ctx.stroke();
        ctx.setLineDash([]);
        ctx.lineWidth = 1;
    }

    document.getElementById('planetCount').innerText = `Objects: ${bodies.length}`;
    requestAnimationFrame(loop);
}

loop();