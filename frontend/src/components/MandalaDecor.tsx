import { theme } from "@/theme";

interface MandalaProps {
  size?: number;
  opacity?: number;
  color?: string;
}

export const MandalaDecor = ({ size = 120, opacity = 0.06, color = theme.colors.saffron }: MandalaProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={{ opacity, pointerEvents: "none" }}>
    <circle cx="60" cy="60" r="55" fill="none" stroke={color} strokeWidth="1" />
    <circle cx="60" cy="60" r="42" fill="none" stroke={color} strokeWidth="0.8" />
    <circle cx="60" cy="60" r="28" fill="none" stroke={color} strokeWidth="0.6" />
    {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
      <line key={a} x1="60" y1="60"
        x2={60 + 55 * Math.cos(a * Math.PI / 180)}
        y2={60 + 55 * Math.sin(a * Math.PI / 180)}
        stroke={color} strokeWidth="0.5" />
    ))}
    {[0,45,90,135].map(a => (
      <rect key={a} x="50" y="50" width="20" height="20"
        fill="none" stroke={color} strokeWidth="0.6"
        transform={`rotate(${a} 60 60)`} />
    ))}
  </svg>
);
