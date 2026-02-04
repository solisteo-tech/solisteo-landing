'use client';

import { motion } from 'framer-motion';

export default function MeshBackground() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyber-cyan/10 blur-[120px] rounded-full"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    x: [0, -60, 0],
                    y: [0, 40, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-cyber-purple/5 blur-[150px] rounded-full"
            />
            <div className="absolute inset-0 bg-cyber-black/40" />
        </div>
    );
}
