import React, { useState, useEffect } from 'react';

interface AnimatedProgressBarProps {
  value: number; // 0-100
  max?: number; // default 100
  width?: number; // number of blocks to display
  filledChar?: string; // character for filled blocks
  emptyChar?: string; // character for empty blocks
  showPercentage?: boolean; // show percentage text
  animationDuration?: number; // animation duration in ms
  className?: string;
}

export default function AnimatedProgressBar({
  value,
  max = 100,
  width = 10,
  filledChar = '█',
  emptyChar = '░',
  showPercentage = true,
  animationDuration = 1000,
  className = ''
}: AnimatedProgressBarProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = animatedValue;
    const targetValue = Math.min(Math.max(value, 0), max);
    const difference = targetValue - startValue;

    if (difference === 0) return;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (difference * easeOutCubic);
      
      setAnimatedValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimatedValue(targetValue);
      }
    };

    requestAnimationFrame(animate);
  }, [value, max, animationDuration]);

  const percentage = (animatedValue / max) * 100;
  const filledBlocks = Math.round((percentage / 100) * width);
  const emptyBlocks = width - filledBlocks;

  const progressBar = `${filledChar.repeat(filledBlocks)}${emptyChar.repeat(emptyBlocks)}`;
  const percentageText = `${Math.round(percentage)}%`;

  return (
    <div className={`flex items-center gap-2 font-mono animate-fade animate-once animate-duration-[250ms] animate-delay-100 ${className}`}>
      <span className="text-sm">{progressBar}</span>
      {showPercentage && (
        <span className="text-sm">{percentageText}</span>
      )}
    </div>
  );
}

// Example usage:
// <AnimatedProgressBar value={75} width={10} />
// <AnimatedProgressBar value={60} width={8} filledChar="▓" emptyChar="░" />
// <AnimatedProgressBar value={90} width={12} showPercentage={false} />

