'use client';

import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

interface ScrollRevealProps {
    children: React.ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    distance?: number;
}

export default function ScrollReveal({
    children,
    delay = 0,
    direction = 'up',
    distance = 30
}: ScrollRevealProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // 一旦显示就不再观察
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1, // 当10%的元素可见时触发
                rootMargin: '0px 0px -50px 0px', // 提前一点触发
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    const getInitialTransform = () => {
        switch (direction) {
            case 'up':
                return `translateY(${distance}px)`;
            case 'down':
                return `translateY(-${distance}px)`;
            case 'left':
                return `translateX(${distance}px)`;
            case 'right':
                return `translateX(-${distance}px)`;
            default:
                return `translateY(${distance}px)`;
        }
    };

    return (
        <Box
            ref={ref}
            sx={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translate(0, 0)' : getInitialTransform(),
                transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
                willChange: 'opacity, transform',
            }}
        >
            {children}
        </Box>
    );
}
