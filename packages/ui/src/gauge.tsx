import * as React from "react";
import { cn } from "./utils";

export interface GaugeZone {
  from: number;
  to: number;
  color: string; // CSS variable or color
}

export interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  label?: string;
  zones?: GaugeZone[];
  size?: number;
  className?: string;
}

/**
 * Signature Gauge Component (DESIGN §5)
 * 240° dial with a needle and marked zones.
 * Accessible with role="meter", aria-valuenow, aria-valuemin, aria-valuemax.
 * Respects prefers-reduced-motion.
 */
export const Gauge: React.FC<GaugeProps> = ({
  value,
  min = 0,
  max = 100,
  unit = "",
  label = "Meter",
  zones = [
    { from: 0, to: 25, color: "var(--warn)" },
    { from: 25, to: 75, color: "var(--ok)" },
    { from: 75, to: 100, color: "var(--fuel)" },
  ],
  size = 200,
  className,
}) => {
  const clampedValue = Math.min(Math.max(value, min), max);
  const percentage = (clampedValue - min) / (max - min || 1);

  // 240-degree dial from -120 deg to +120 deg
  const startAngle = -120;
  const totalSweep = 240;
  const currentAngle = startAngle + percentage * totalSweep;

  const radius = size * 0.38;
  const strokeWidth = size * 0.08;
  const center = size / 2;

  // Converts polar coordinates to Cartesian
  const polarToCartesian = (cx: number, cy: number, r: number, angleDegrees: number) => {
    const angleRadians = ((angleDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleRadians),
      y: cy + r * Math.sin(angleRadians),
    };
  };

  const describeArc = (x: number, y: number, r: number, start: number, end: number) => {
    const startPoint = polarToCartesian(x, y, r, start);
    const endPoint = polarToCartesian(x, y, r, end);
    const largeArcFlag = end - start <= 180 ? "0" : "1";
    return ["M", startPoint.x, startPoint.y, "A", r, r, 0, largeArcFlag, 1, endPoint.x, endPoint.y].join(" ");
  };

  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      className={cn("flex flex-col items-center select-none", className)}
      style={{ width: size }}
    >
      <svg width={size} height={size * 0.82} viewBox={`0 0 ${size} ${size * 0.85}`} className="overflow-visible">
        {/* Background track */}
        <path
          d={describeArc(center, center, radius, startAngle, startAngle + totalSweep)}
          fill="none"
          stroke="var(--surface-sunk)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Zones */}
        {zones.map((zone, i) => {
          const zoneStartPct = (Math.max(zone.from, min) - min) / (max - min || 1);
          const zoneEndPct = (Math.min(zone.to, max) - min) / (max - min || 1);
          const zoneStartAngle = startAngle + zoneStartPct * totalSweep;
          const zoneEndAngle = startAngle + zoneEndPct * totalSweep;

          if (zoneEndAngle <= zoneStartAngle) return null;

          return (
            <path
              key={i}
              d={describeArc(center, center, radius, zoneStartAngle, zoneEndAngle)}
              fill="none"
              stroke={zone.color}
              strokeWidth={strokeWidth * 0.75}
              strokeLinecap="butt"
              opacity={0.85}
            />
          );
        })}

        {/* Needle */}
        <g
          style={{
            transform: `rotate(${currentAngle}deg)`,
            transformOrigin: `${center}px ${center}px`,
            transition: "transform 0.4s cubic-bezier(0.34, 1.3, 0.64, 1)",
          }}
          className="motion-reduce:transition-none"
        >
          <line
            x1={center}
            y1={center}
            x2={center}
            y2={center - radius * 0.88}
            stroke="var(--ink)"
            strokeWidth={3}
            strokeLinecap="round"
          />
          <circle cx={center} cy={center} r={size * 0.05} fill="var(--ink)" />
          <circle cx={center} cy={center} r={size * 0.02} fill="var(--surface)" />
        </g>
      </svg>

      {/* Numerical readout */}
      <div className="flex flex-col items-center -mt-6">
        <div className="text-2xl font-bold font-[family-name:var(--font-display)] tabular-nums text-[var(--ink)]">
          {new Intl.NumberFormat().format(value)}
          {unit ? <span className="text-sm font-normal ml-1 text-[var(--ink-2)]">{unit}</span> : null}
        </div>
        {label ? <div className="text-xs font-medium text-[var(--ink-3)] uppercase tracking-wider">{label}</div> : null}
      </div>
    </div>
  );
};
