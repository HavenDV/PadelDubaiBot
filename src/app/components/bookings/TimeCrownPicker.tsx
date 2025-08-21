"use client";

import React, { CSSProperties, useMemo, useRef, useState } from "react";

type Props = {
  value: string; // HH:MM
  onChange: (value: string) => void;
  minuteStep?: number; // default 5
  className?: string;
  style?: CSSProperties;
};

function pad2(n: number): string {
  return `${n}`.padStart(2, "0");
}

function parseValue(v: string): { h: number; m: number } {
  const m = /^(\d{2}):(\d{2})$/.exec(v || "");
  if (!m) return { h: 20, m: 0 };
  const h = Math.min(23, Math.max(0, Number(m[1])));
  const min = Math.min(59, Math.max(0, Number(m[2])));
  return { h, m: min };
}

function clampMinuteToStep(min: number, step: number): number {
  return Math.round(min / step) * step;
}

type CrownColumnProps = {
  value: number; // current numeric value
  values: number[]; // allowed values (hours: 0..23 or minutes by step)
  onChange: (next: number) => void;
  width?: number; // px
  height?: number; // px total control height
  rowHeight?: number; // px height for each row
};

function CrownColumn({
  value,
  values,
  onChange,
  width = 64,
  height = 48,
  rowHeight = 20,
}: CrownColumnProps) {
  const idx = Math.max(0, values.indexOf(value));
  const prev = values[(idx - 1 + values.length) % values.length];
  const next = values[(idx + 1) % values.length];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const startYRef = useRef(0);
  const accRef = useRef(0);

  const containerStyle: CSSProperties = {
    width,
    height,
    borderRadius: 8,
    position: "relative",
    overflow: "hidden",
    border: "none",
    background: "transparent",
    userSelect: "none",
    touchAction: "none",
  };

  const centerLineStyle: CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    top: Math.floor((height - rowHeight) / 2),
    height: rowHeight,
    borderTop: "1px solid rgba(0,0,0,0.12)",
    borderBottom: "1px solid rgba(0,0,0,0.12)",
    pointerEvents: "none",
  };

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateRows: `${rowHeight}px ${rowHeight}px ${rowHeight}px`,
    alignItems: "center",
    justifyItems: "center",
    height,
    userSelect: "none",
  };

  const textDim = { fontVariantNumeric: "tabular-nums" as const };

  const stepBy = (delta: number) => {
    if (!delta) return;
    const currentIdx = values.indexOf(value);
    if (currentIdx === -1) return;
    const nextIdx = (currentIdx + delta + values.length) % values.length;
    onChange(values[nextIdx]);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    startYRef.current = e.clientY;
    accRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dy = e.clientY - startYRef.current;
    accRef.current = dy;
    const threshold = rowHeight;
    if (Math.abs(accRef.current) >= threshold) {
      const steps = Math.trunc(accRef.current / threshold);
      stepBy(steps);
      startYRef.current += steps * threshold;
      accRef.current -= steps * threshold;
    }
  };
  const endDrag = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };
  const onClick = (e: React.MouseEvent) => {
    if (Math.abs(accRef.current) > 3) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    if (y < rect.height / 2) stepBy(-1);
    else stepBy(1);
  };

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClick={onClick}
      role="spinbutton"
      aria-valuenow={value}
    >
      <div style={gridStyle}>
        <div style={{ opacity: 0.45, ...textDim }} draggable={false}>
          {pad2(prev)}
        </div>
        <div style={{ fontWeight: 600, ...textDim }} draggable={false}>
          {pad2(value)}
        </div>
        <div style={{ opacity: 0.45, ...textDim }} draggable={false}>
          {pad2(next)}
        </div>
      </div>
      <div style={centerLineStyle} />
    </div>
  );
}

export default function TimeCrownPicker({
  value,
  onChange,
  minuteStep = 5,
  className,
  style,
}: Props) {
  const { h, m } = parseValue(value);
  const minutes = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < 60; i += minuteStep) arr.push(i);
    return arr;
  }, [minuteStep]);

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minuteAligned = useMemo(
    () => clampMinuteToStep(m, minuteStep) % 60,
    [m, minuteStep]
  );

  const changeHour = (next: number) =>
    onChange(`${pad2((next + 24) % 24)}:${pad2(minuteAligned)}`);
  const changeMinute = (next: number) =>
    onChange(`${pad2(h)}:${pad2(next % 60)}`);

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        userSelect: "none",
        ...(style || {}),
      }}
    >
      <CrownColumn value={h} values={hours} onChange={changeHour} width={52} height={40} rowHeight={16} />
      <div aria-hidden>:</div>
      <CrownColumn value={minuteAligned} values={minutes} onChange={changeMinute} width={52} height={40} rowHeight={16} />
    </div>
  );
}
