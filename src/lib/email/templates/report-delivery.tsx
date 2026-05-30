import * as React from "react";

interface ReportDeliveryEmailProps {
  agencyName: string;
  clientName: string;
  reportTitle: string;
  reportUrl: string;
  period: string;
}

export function ReportDeliveryEmail({
  agencyName,
  clientName,
  reportTitle,
  reportUrl,
  period,
}: ReportDeliveryEmailProps) {
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
      {/* Agency name */}
      <p
        style={{
          fontSize: "18px",
          fontWeight: "700",
          color: "#111827",
          margin: "0 0 32px",
        }}
      >
        {agencyName}
      </p>

      {/* Greeting */}
      <h1
        style={{
          fontSize: "22px",
          fontWeight: "600",
          color: "#111827",
          margin: "0 0 8px",
          lineHeight: "1.3",
        }}
      >
        Your {period} report is ready
      </h1>

      <p
        style={{
          fontSize: "15px",
          color: "#6B7280",
          margin: "0 0 32px",
          lineHeight: "1.6",
        }}
      >
        Hi {clientName}, your marketing performance report for {period} has
        been prepared. Click below to view your full report.
      </p>

      {/* CTA */}
      <a
        href={reportUrl}
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
        View your report →
      </a>

      {/* Divider */}
      <hr
        style={{
          border: "none",
          borderTop: "1px solid #F3F4F6",
          margin: "32px 0",
        }}
      />

      {/* Footer */}
      <p
        style={{
          fontSize: "12px",
          color: "#9CA3AF",
          margin: "0",
          lineHeight: "1.6",
        }}
      >
        This report was sent by {agencyName} via Corpozort. If you have
        questions about your report, reply directly to this email.
      </p>
    </div>
  );
}
