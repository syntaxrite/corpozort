import * as React from "react";

interface IntegrationFailureEmailProps {
  agencyOwnerName: string;
  clientName: string;
  platformName: string;
  fixUrl: string;
}

export function IntegrationFailureEmail({
  agencyOwnerName,
  clientName,
  platformName,
  fixUrl,
}: IntegrationFailureEmailProps) {
  return (
    <div
      style={{
        fontFamily: "Inter, -apple-system, sans-serif",
        maxWidth: "520px",
        margin: "0 auto",
        padding: "40px 24px",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Warning badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          backgroundColor: "#FEF2F2",
          border: "1px solid #FECACA",
          borderRadius: "100px",
          padding: "4px 12px",
          marginBottom: "24px",
        }}
      >
        <span style={{ fontSize: "12px", color: "#DC2626", fontWeight: "500" }}>
          ⚠️ Integration alert
        </span>
      </div>

      <h1
        style={{
          fontSize: "20px",
          fontWeight: "600",
          color: "#111827",
          margin: "0 0 8px",
        }}
      >
        Integration needs attention
      </h1>

      <p
        style={{
          fontSize: "15px",
          color: "#6B7280",
          margin: "0 0 24px",
          lineHeight: "1.6",
        }}
      >
        Hi {agencyOwnerName}, the <strong>{platformName}</strong> integration
        for <strong>{clientName}</strong> failed during its last sync.
        Scheduled reports for this client may fail until it is reconnected.
      </p>

      <a
        href={fixUrl}
        style={{
          display: "inline-block",
          backgroundColor: "#4F46E5",
          color: "#ffffff",
          padding: "12px 24px",
          borderRadius: "8px",
          fontSize: "15px",
          fontWeight: "500",
          textDecoration: "none",
          marginBottom: "32px",
        }}
      >
        Fix integration →
      </a>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid #F3F4F6",
          margin: "32px 0",
        }}
      />

      <p
        style={{
          fontSize: "12px",
          color: "#9CA3AF",
          margin: "0",
        }}
      >
        This alert was sent by Corpozort because an integration in your
        workspace failed its scheduled sync.
      </p>
    </div>
  );
}
