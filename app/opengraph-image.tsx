import { ImageResponse } from "next/og";
import { site } from "@/site.config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(140deg, #ffffff 0%, #f3faf7 55%, #e9f6f0 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 600,
            color: "#065f46",
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          {site.cidade}/{site.uf} · distribuidora de linha leve
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 24 }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: 26,
              background: "#10b981",
              color: "#022c22",
              fontSize: 56,
              fontWeight: 600,
              marginRight: 28,
            }}
          >
            A
            <div
              style={{
                position: "absolute",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#022c22",
                right: 24,
                top: 24,
              }}
            />
          </div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 600, color: "#0f172a" }}>{site.name}</div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 34,
            color: "#134e4a",
            maxWidth: 900,
          }}
        >
          {site.promise}
        </div>
      </div>
    ),
    size
  );
}
