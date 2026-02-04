'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function CrystalS() {
    const [refractions, setRefractions] = useState<{
        width: number;
        top: string;
        left: string;
        rotate: string;
        duration: number;
        delay: number;
        moveX: number;
    }[]>([]);

    useEffect(() => {
        const data = [...Array(6)].map(() => ({
            width: Math.random() * 40 + 10,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            rotate: `${Math.random() * 360}deg`,
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 2,
            moveX: Math.random() * 20 - 10,
        }));
        setRefractions(data);
    }, []);

    return (
        <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
            {/* Outer Glows - More subtle for light theme */}
            <motion.div
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.15, 0.3, 0.15],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-blue-400/20 blur-[100px] rounded-full"
            />
            <motion.div
                animate={{
                    scale: [1.15, 1, 1.15],
                    opacity: [0.1, 0.25, 0.1],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-cyan-300/10 blur-[120px] rounded-full"
            />

            {/* The Brand Logo Mark */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: [0, -10, 0],
                    rotateY: [0, 8, 0],
                }}
                transition={{
                    opacity: { duration: 1.5, ease: "easeOut" },
                    scale: { duration: 1.5, ease: "easeOut" },
                    y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                    rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                }}
                className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none"
            >
                <div className="relative group">
                    {/* Soft Reflection Glow */}
                    <div className="absolute inset-0 bg-blue-400/10 blur-[50px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

                    <motion.img
                        src="/solisteo-logo.svg"
                        alt="Solisteo Logo"
                        className="w-40 h-40 md:w-72 md:h-72 drop-shadow-[0_10px_30px_rgba(59,130,246,0.15)] relative z-20 object-contain"
                        animate={{
                            y: [0, -5, 0],
                            filter: [
                                "drop-shadow(0 10px 20px rgba(59,130,246,0.1))",
                                "drop-shadow(0 20px 40px rgba(59,130,246,0.2))",
                                "drop-shadow(0 10px 20px rgba(59,130,246,0.1))"
                            ]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Glint effect (white sweep) */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/60 to-transparent -skew-x-12 z-30 opacity-50"
                        initial={{ left: "-100%" }}
                        animate={{ left: "200%" }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
                    />
                </div>

                {/* Refractions - Brighter for light theme */}
                {refractions.map((ref, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-blue-300/30 blur-[1px]"
                        style={{
                            width: ref.width,
                            height: 1.5,
                            top: ref.top,
                            left: ref.left,
                            transform: `rotate(${ref.rotate})`,
                        }}
                        animate={{
                            opacity: [0, 1, 0],
                            x: [0, ref.moveX],
                        }}
                        transition={{
                            duration: ref.duration,
                            repeat: Infinity,
                            delay: ref.delay,
                        }}
                    />
                ))}
            </motion.div>
        </div>
    );
}

