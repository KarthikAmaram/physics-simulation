class CelestialBody {
    constructor(x, y, vx, vy, mass, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.mass = mass;
        this.color = color;
        this.prevPoints = [];
        this.ax = 0;
        this.ay = 0;
    }

    get radius() {
        return 5 + Math.log10(this.mass / 1e24 + 1) * 3;
    }
}

const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const G = 6.674e-11;
const SCALE = 5e8;
const sunMass = 1.989e30;
const earthMass = 5.97e24;

let bodies = [];
let startPoint = null;
let currentPoint = null;
let isDragging = false;
let startTime;

const sunX = canvas.width / 2;
const sunY = canvas.height / 2;
bodies.push(new CelestialBody(sunX, sunY, 0, 0, sunMass, 'yellow'));

const dist1 = 150;
const vCirc = Math.sqrt((G * sunMass) / (dist1 * SCALE));
bodies.push(new CelestialBody(sunX + dist1, sunY, 0, vCirc, earthMass, 'cyan'));

const dist2 = 250;
const vEllip = Math.sqrt((G * sunMass) / (dist2 * SCALE)) * 0.75;
bodies.push(new CelestialBody(sunX - dist2, sunY, 0, -vEllip, earthMass, 'magenta'));

window.addEventListener('resize', () => {
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const offsetX = (canvas.width - oldWidth) / 2;
    const offsetY = (canvas.height - oldHeight) / 2;

    bodies.forEach(b => {
        b.x += offsetX;
        b.y += offsetY;

        b.prevPoints.forEach(p => {
            p.x += offsetX;
            p.y += offsetY;
        });
    });
});

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    startPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    currentPoint = { x: startPoint.x, y: startPoint.y };
    isDragging = true;
    startTime = Date.now();
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        currentPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (isDragging) {
        const duration = Date.now() - startTime;
        const rect = canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        let mMult = 1 + (duration / 1000) ** 2;
        let finalMass = earthMass * mMult;
        const vx = (startPoint.x - endX) * 250;
        const vy = (startPoint.y - endY) * 250;
        const randomColor = `hsl(${Math.random() * 360}, 70%, 60%)`;

        bodies.push(new CelestialBody(startPoint.x, startPoint.y, vx, vy, finalMass, randomColor));

        startPoint = null;
        currentPoint = null;
        isDragging = false;
    }
});

function loop() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let dt = 6000;
    let toRemove = new Set();

    for (let i = 0; i < bodies.length; i++) {
        let b = bodies[i];
        for (let j = 0; j < bodies.length; j++) {
            if (i === j) continue;
            let other = bodies[j];

            let dx = (other.x - b.x) * SCALE;
            let dy = (other.y - b.y) * SCALE;
            let dSq = dx * dx + dy * dy;
            let d = Math.sqrt(dSq);

            if (d < (b.radius + other.radius) * SCALE) {
                toRemove.add(b.mass < other.mass ? b : other);
                continue;
            }

            let f = (G * other.mass) / dSq;
            b.ax += (dx / d) * f;
            b.ay += (dy / d) * f;
        }
    }

    bodies = bodies.filter(b => !toRemove.has(b));

    bodies.forEach(b => {
        b.vx += b.ax * dt;
        b.vy += b.ay * dt;
        b.x += (b.vx * dt) / SCALE;
        b.y += (b.vy * dt) / SCALE;
        b.ax = 0; b.ay = 0;

        b.prevPoints.push({x: b.x, y: b.y});
        if (b.prevPoints.length > 1000) b.prevPoints.shift();

        ctx.strokeStyle = b.color;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        b.prevPoints.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        ctx.fillStyle = b.mass >= sunMass * 0.9 ? 'yellow' : b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    if (startPoint && currentPoint) {
        let duration = Date.now() - startTime;
        let mMult = 1 + (duration / 1000) ** 2;
        let gMass = earthMass * mMult;
        let gRadius = 5 + Math.log10(gMass / 1e24 + 1) * 3;

        ctx.globalAlpha = 0.4;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, gRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        ctx.strokeStyle = '#00ccff';
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();

        let gX = startPoint.x, gY = startPoint.y;
        let gVX = (startPoint.x - currentPoint.x) * 250;
        let gVY = (startPoint.y - currentPoint.y) * 250;

        ctx.strokeStyle = 'rgba(255, 165, 0, 0.6)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(gX, gY);

        for (let i = 0; i < 4000; i++) {
            let tx = 0, ty = 0;
            bodies.forEach(o => {
                let dx = (o.x - gX) * SCALE, dy = (o.y - gY) * SCALE;
                let d2 = dx * dx + dy * dy;
                let d = Math.sqrt(d2);
                if (d < 1) return;
                tx += (dx / d) * (G * o.mass / d2);
                ty += (dy / d) * (G * o.mass / d2);
            });
            gVX += tx * dt; gVY += ty * dt;
            gX += (gVX * dt) / SCALE; gY += (gVY * dt) / SCALE;
            ctx.lineTo(gX, gY);
            if (Math.abs(gX) > canvas.width * 5 || Math.abs(gY) > canvas.height * 5) break;
        }
        ctx.stroke();
        ctx.setLineDash([]);
    }

    renderUI();
    requestAnimationFrame(loop);
}

function renderUI() {
    let tableX = canvas.width - 320;
    let tableY = 40;
    let chartX = 40;
    let chartY = canvas.height - 40;
    let col1 = 0, col2 = 60, col3 = 160;

    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px monospace';
    ctx.fillText("BODY", tableX + col1, tableY);
    ctx.fillText("MASS (kg)", tableX + col2, tableY);
    ctx.fillText("KINETIC ENERGY (J)", tableX + col3, tableY);
    ctx.fillRect(tableX, tableY + 5, 300, 1);

    bodies.forEach((b, i) => {
        let ke = 0.5 * b.mass * (b.vx**2 + b.vy**2);
        let rowY = tableY + 25 + (i * 20);
        ctx.fillStyle = b.color;
        ctx.fillText(`#${i+1}`, tableX + col1, rowY);
        ctx.fillStyle = 'white';
        ctx.fillText(b.mass.toExponential(2), tableX + col2, rowY);
        ctx.fillText(ke.toExponential(2), tableX + col3, rowY);

        let barH = Math.max(2, Math.log10(ke + 1) * 3 - 60);
        ctx.fillStyle = b.color;
        ctx.fillRect(chartX + (i * 35), chartY, 25, -barH);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(chartX + (i * 35), chartY, 25, -barH);
    });
}

loop();