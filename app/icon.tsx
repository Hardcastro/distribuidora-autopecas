import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#10b981",
          color: "#022c22",
          fontSize: 19,
          fontWeight: 600,
          borderRadius: 7,
        }}
      >
        A
        <div
          style={{
            position: "absolute",
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "#022c22",
            right: 8,
            top: 8,
          }}
        />
      </div>
    ),
    size
  );
}
