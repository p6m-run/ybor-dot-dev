import { useEffect, useRef } from 'react';

export default function GradientBg({ color = "brand-purple" }: { color?: string }) {
    const interBubbleRef = useRef<HTMLDivElement>(null);

    const gradientBgMap = {
        "brand-purple": "bg-brand-purple-gradient",
        "brand-blue": "bg-brand-blue-gradient",
        "brand-orange": "bg-brand-orange-gradient",
        "brand-yellow": "bg-brand-yellow-gradient",
        "brand-green": "bg-brand-green-gradient",
    }

    const colorsMap = {
        "brand-purple": "g1",
        "brand-blue": "g2",
        "brand-orange": "g3",
        "brand-yellow": "g4",
        "brand-green": "g5",
    }

    useEffect(() => {
        const interBubble = interBubbleRef.current;
        if (!interBubble) return;

        let curX = 0;
        let curY = 0;
        let tgX = 0;
        let tgY = 0;
        let animationFrameId: number;

        function move() {
            if (!interBubble) return;
            curX += (tgX - curX) / 20;
            curY += (tgY - curY) / 20;
            interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
            animationFrameId = requestAnimationFrame(move);
        }

        const handleMouseMove = (event: MouseEvent) => {
            tgX = event.clientX;
            tgY = event.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove);
        move();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className={`${gradientBgMap[color as keyof typeof gradientBgMap]} gradient-bg absolute top-0 left-0 w-full h-screen overflow-hidden -z-50`}>
            <svg xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
                        <feBlend in="SourceGraphic" in2="goo" />
                    </filter>
                </defs>
            </svg>
            <div className="gradients-container opacity-30">
                <div className={colorsMap[color as keyof typeof colorsMap]}></div>
                <div className="interactive hidden md:block" ref={interBubbleRef}></div>
            </div>
        </div>
    );
}