"use client";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  hover?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  glowColor,
  hover = false,
}: GlassCardProps) {
  return (
    <div
      className={`glass ${hover ? "transition-all duration-300 hover:scale-[1.02] hover:shadow-glow-blue cursor-pointer" : ""} ${className}`}
      style={
        glowColor
          ? { borderTop: `1px solid ${glowColor}50`, borderLeft: `1px solid ${glowColor}20` }
          : {}
      }
    >
      {children}
    </div>
  );
}
