import { ImageResponse } from "next/og";
import { site, study } from "@/config/study";

export const runtime = "edge";
export const alt = `${study.title} — ${site.name} ${study.cohort} 모집`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0a0a0a 45%, #78350f 145%)",
          color: "#fff",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(251,191,36,0.16)",
              color: "#fcd34d",
              borderRadius: 999,
              padding: "10px 24px",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {site.name} · {study.cohort} 모집
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 800 }}>
            {study.title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "rgba(255,255,255,0.75)",
            }}
          >
            {study.subtitle}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, fontSize: 28, fontWeight: 700 }}>
          <div
            style={{
              display: "flex",
              background: "rgba(255,255,255,0.12)",
              borderRadius: 16,
              padding: "16px 26px",
            }}
          >
            📚 전 {study.sessionCount}회 · {study.capacity}
          </div>
          <div
            style={{
              display: "flex",
              background: "rgba(255,255,255,0.12)",
              borderRadius: 16,
              padding: "16px 26px",
            }}
          >
            📍 {study.place}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
