import React, { useRef, useEffect } from 'react';

const Ball = (x, y, r) => ({
    position: { x, y },
    velocity: { x: 0, y: 0 },
    radius: r,
    color: ['#FE0194', '#FF004D', '#FFEA00', '#00FF0D', '#00C8FF'][Math.floor(Math.random() * 5)],
    update(mouseX, mouseY, k, damping) {
        const force = { x: mouseX - this.position.x, y: mouseY - this.position.y };
        force.x *= k;
        force.y *= k;
        this.velocity.x += force.x;
        this.velocity.y += force.y;

        const limit = 10;
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        if (speed > limit) {
            const ratio = limit / speed;
            this.velocity.x *= ratio;
            this.velocity.y *= ratio;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (Math.hypot(mouseX - this.position.x, mouseY - this.position.y) < 50) {
            this.velocity.x *= damping;
            this.velocity.y *= damping;
        }
    },
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    },
    explode(mouseX, mouseY) {
        const explodeDir = { x: this.position.x - mouseX, y: this.position.y - mouseY };
        const magnitude = Math.sqrt(explodeDir.x ** 2 + explodeDir.y ** 2);
        explodeDir.x /= magnitude;
        explodeDir.y /= magnitude;
        explodeDir.x *= 100;
        explodeDir.y *= 100;
        this.velocity.x += explodeDir.x;
        this.velocity.y += explodeDir.y;
    },
    collide(other) {
        const dir = { x: this.position.x - other.position.x, y: this.position.y - other.position.y };
        const dist = Math.hypot(dir.x, dir.y);
        if (dist < this.radius + other.radius) {
            const overlap = (this.radius + other.radius - dist) * 0.5;
            dir.x /= dist;
            dir.y /= dist;
            dir.x *= overlap;
            dir.y *= overlap;
            this.position.x += dir.x;
            this.position.y += dir.y;
            other.position.x -= dir.x;
            other.position.y -= dir.y;

            const vDiff = { x: this.velocity.x - other.velocity.x, y: this.velocity.y - other.velocity.y };
            const damp = 0.5;
            this.velocity.x -= dir.x * damp * (vDiff.x * dir.x + vDiff.y * dir.y) / dist;
            this.velocity.y -= dir.y * damp * (vDiff.x * dir.x + vDiff.y * dir.y) / dist;
            other.velocity.x += dir.x * damp * (vDiff.x * dir.x + vDiff.y * dir.y) / dist;
            other.velocity.y += dir.y * damp * (vDiff.x * dir.x + vDiff.y * dir.y) / dist;

            this.velocity.x *= 0.99;
            this.velocity.y *= 0.99;
            other.velocity.x *= 0.99;
            other.velocity.y *= 0.99;

        }
    }
});

const CanvasComponent = () => {
    const canvasRef = useRef(null);
    const ballsRef = useRef([]);
    const animationFrameRef = useRef(null);
    const numberOfBalls = 50;
    const lowerRadius = 10;
    const upperRadius = 20;
    const k = 0.001;
    const damping = 0.8;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const mousePosition = {x: 0, y: 0};

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const mouseHandler = (e) => {
            mousePosition.x = e.clientX;
            mousePosition.y = e.clientY;
        };
        window.addEventListener('mousemove', mouseHandler);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (ballsRef.current.length < numberOfBalls && Math.random() < 0.05) {
                ballsRef.current.push(Ball(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * (upperRadius - lowerRadius) + lowerRadius));
                if(ballsRef.current.length > numberOfBalls*0.5) {
                    ballsRef.current.shift();
                }
            }
            ballsRef.current.forEach((ball, i) => {
                // ball.update(mousePosition.x, mousePosition.y, k, damping);
                ball.update(canvas.width / 2, canvas.height / 2, k, damping);
                ballsRef.current.slice(i + 1).forEach(other => ball.collide(other));
                ball.draw(ctx);
            });
            animationFrameRef.current = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', mouseHandler);
        };
    }, []);

    const handleClick = (e) => {
        if (e.button === 0) {
            ballsRef.current = [];
        } else {
            ballsRef.current.forEach(ball => ball.explode(e.clientX, e.clientY));
        }
    };

    return (
        <canvas className="fixed top-0 left-0 w-full h-full pointer-events-none blur" ref={canvasRef} onClick={handleClick} />
    );
};

export default CanvasComponent;
