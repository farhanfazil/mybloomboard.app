import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "BloomBoard — Productivity app that thinks with you.";

export default function OpengraphImage() {
  const bgData = readFileSync(join(process.cwd(), "public/backgrounds/hero-bg.jpg")).toString("base64");
  const logoData = readFileSync(join(process.cwd(), "public/logo.png")).toString("base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#000000",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Cinematic background photo, same as homepage hero */}
        <img
          src={`data:image/jpeg;base64,${bgData}`}
          width={1200}
          height={630}
          style={{ position: "absolute", inset: 0, objectFit: "cover", width: "100%", height: "100%" }}
        />

        {/* Dark gradient overlay so text reads clearly, matching site's hero treatment */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.8) 65%, rgba(0,0,0,0.94) 100%)",
          }}
        />

        {/* Extra dark vignette focused behind the text block, so the bright horizon glow never washes out the copy */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 70,
            height: 330,
            display: "flex",
            background:
              "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0.1) 75%, transparent 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "92px 80px 0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 28 }}>
            <img src={`data:image/png;base64,${logoData}`} width={78} height={78} style={{ display: "flex" }} />
            <span style={{ fontSize: 48, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em" }}>
              BloomBoard
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: 44,
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.15,
                textShadow: "0 2px 18px rgba(0,0,0,0.8)",
              }}
            >
              Productivity app that
            </span>
            <span
              style={{
                fontSize: 44,
                fontWeight: 800,
                lineHeight: 1.15,
                backgroundImage: "linear-gradient(90deg, #7ec2ff 0%, #c4b5fd 38%, #f9a8d4 65%, #ff6b5e 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              thinks with you.
            </span>
          </div>

          <span
            style={{
              marginTop: 24,
              fontSize: 23,
              color: "rgba(255,255,255,0.75)",
              fontWeight: 500,
              textShadow: "0 2px 12px rgba(0,0,0,0.8)",
            }}
          >
            Free · Local · No account · mybloomboard.app
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
