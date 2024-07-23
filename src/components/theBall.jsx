import React, { useEffect, useRef } from 'react';

const CanvasBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');

        const drawCircle = (x, y) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
            ctx.fillStyle = 'rgba(255, 0, 0, 0.8)'; // Circle color with opacity
            ctx.beginPath();
            ctx.arc(x, y, 50, 0, 2 * Math.PI); // Draw the circle
            ctx.fill();
        };

        const handleMouseMove = (event) => {
            drawCircle(event.clientX, event.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full  pointer-events-none blur" />;
};

export default CanvasBackground;
