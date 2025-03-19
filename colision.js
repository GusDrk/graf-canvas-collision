const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff09f";

let removedCircles = 0;

class Circle {
    constructor(x, radius, color, text, speed) {
        this.posX = x;
        this.posY = -radius; // Inicia justo fuera del canvas en la parte superior
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fill();
        context.closePath();

        context.fillStyle = "#000";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
    }

    update() {
        this.posY += this.speed;
        if (this.posY - this.radius > window_height) {
            this.posY = -this.radius; // Reiniciar desde la parte superior
            this.posX = Math.random() * (window_width - this.radius * 2) + this.radius; // Nueva posición X aleatoria
        }
    }
}

let circles = [];

function generateCircle() {
    let radius = Math.random() * 30 + 20;
    let x = Math.random() * (window_width - radius * 2) + radius;
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    let speed = Math.random() * 4 + 1;
    let text = `C${circles.length + 1}`;
    circles.push(new Circle(x, radius, color, text, speed));
}

setInterval(generateCircle, 1000); // Generar una nueva esfera cada segundo

canvas.addEventListener("click", function(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    for (let i = circles.length - 1; i >= 0; i--) {
        let circle = circles[i];
        let dx = mouseX - circle.posX;
        let dy = mouseY - circle.posY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < circle.radius) {
            circles.splice(i, 1);
            removedCircles++;
            break;
        }
    }
});

function drawCounter() {
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`Eliminados: ${removedCircles}`, window_width - 20, 30);
}

function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    circles.forEach(circle => {
        circle.update();
        circle.draw(ctx);
    });
    drawCounter();
    requestAnimationFrame(animate);
}

animate();