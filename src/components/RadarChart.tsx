"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface AttributeData {
  name: string;
  value: number;
  max: number;
  color: string;
}

interface RadarChartProps {
  attributes: AttributeData[];
  size?: number;
}

export function RadarChart({ attributes, size = 280 }: RadarChartProps) {
  const polygonPoints = useMemo(() => {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size / 2) * 0.8;

    return attributes.map((attr, index) => {
      const angle = (index * 2 * Math.PI) / attributes.length - Math.PI / 2;
      const value = attr.value / attr.max;
      const x = centerX + radius * value * Math.cos(angle);
      const y = centerY + radius * value * Math.sin(angle);
      return `${x},${y}`;
    }).join(" ");
  }, [attributes, size]);

  const backgroundPoints = useMemo(() => {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size / 2) * 0.8;

    return attributes.map((_, index) => {
      const angle = (index * 2 * Math.PI) / attributes.length - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return `${x},${y}`;
    }).join(" ");
  }, [attributes, size]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grille de fond (cercles concentriques) */}
        {[0.25, 0.5, 0.75, 1].map((scale) => {
          const points = attributes.map((_, index) => {
            const centerX = size / 2;
            const centerY = size / 2;
            const radius = (size / 2) * 0.8 * scale;
            const angle = (index * 2 * Math.PI) / attributes.length - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            return `${x},${y}`;
          }).join(" ");

          return (
            <polygon
              key={scale}
              points={points}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          );
        })}

        {/* Lignes radiales */}
        {attributes.map((_, index) => {
          const centerX = size / 2;
          const centerY = size / 2;
          const radius = (size / 2) * 0.8;
          const angle = (index * 2 * Math.PI) / attributes.length - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);

          return (
            <line
              key={index}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          );
        })}

        {/* Polygone de données avec animation */}
        <motion.polygon
          points={polygonPoints}
          fill="rgba(255, 215, 0, 0.2)"
          stroke="rgba(255, 215, 0, 0.8)"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="drop-shadow-lg"
        />

        {/* Points aux sommets */}
        {attributes.map((attr, index) => {
          const centerX = size / 2;
          const centerY = size / 2;
          const radius = (size / 2) * 0.8;
          const angle = (index * 2 * Math.PI) / attributes.length - Math.PI / 2;
          const value = attr.value / attr.max;
          const x = centerX + radius * value * Math.cos(angle);
          const y = centerY + radius * value * Math.sin(angle);

          return (
            <motion.circle
              key={attr.name}
              cx={x}
              cy={y}
              r="6"
              fill={attr.color}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="drop-shadow-lg"
            />
          );
        })}
      </svg>

      {/* Labels des attributs */}
      <div className="absolute inset-0 pointer-events-none">
        {attributes.map((attr, index) => {
          const angle = (index * 2 * Math.PI) / attributes.length - Math.PI / 2;
          const labelRadius = (size / 2) * 0.95;
          const x = 50 + 45 * Math.cos(angle);
          const y = 50 + 45 * Math.sin(angle);

          return (
            <div
              key={attr.name}
              className="absolute text-xs font-medium text-foreground"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {attr.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
