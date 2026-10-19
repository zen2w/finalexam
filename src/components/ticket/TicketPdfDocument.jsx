import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatShowtime, formatShowDate } from "@/lib/time";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    backgroundColor: "#0D0E12",
    color: "#FFFFFF",
    fontFamily: "Helvetica",
  },
  card: {
    backgroundColor: "#18191E",
    border: "1px solid #2B2C33",
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #2B2C33",
    paddingBottom: 16,
    marginBottom: 18,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F59E0B",
  },
  badge: {
    backgroundColor: "#121316",
    color: "#F59E0B",
    fontSize: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  movieTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  metaText: {
    fontSize: 10,
    color: "#9CA3AF",
    marginBottom: 14,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#121316",
    padding: 14,
    borderRadius: 8,
    marginBottom: 18,
  },
  column: {
    width: "48%",
  },
  label: {
    fontSize: 9,
    color: "#6B7280",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  value: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#E5E7EB",
  },
  valueGold: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#F59E0B",
  },
  stub: {
    backgroundColor: "#121316",
    border: "1px solid #374151",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  stubTitle: {
    fontSize: 9,
    color: "#9CA3AF",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  refCode: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F59E0B",
    letterSpacing: 2,
    marginBottom: 8,
  },
  barcode: {
    fontSize: 14,
    letterSpacing: 6,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  scanText: {
    fontSize: 8,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  guidelines: {
    backgroundColor: "#141519",
    border: "1px solid #1F2937",
    borderRadius: 8,
    padding: 14,
  },
  guidelineTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#F59E0B",
    marginBottom: 4,
  },
  guidelineText: {
    fontSize: 9,
    color: "#9CA3AF",
    lineHeight: 1.4,
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 8,
    color: "#4B5563",
  },
});

export default function TicketPdfDocument({ reservation }) {
  const showtime = reservation.showtime;
  const movie = showtime?.movie;
  const auditorium = showtime?.auditorium;
  const seats = reservation.reservation_seats?.map((rs) => rs.seat) || [];
  const refCode = reservation.reference_code || "MS-2026-000000";

  return (
    <Document title={`MovieSeat-Ticket-${refCode}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.brandTitle}>MOVIESEAT CINEMAS</Text>
            <Text style={styles.badge}>RESERVED ADMISSION - ACTIVE</Text>
          </View>

          {/* Movie Details */}
          <Text style={styles.movieTitle}>{movie?.title || "Movie"}</Text>
          <Text style={styles.metaText}>
            {auditorium?.name || "Cinema 1"} • 4K Dual Laser • Dolby Atmos
          </Text>

          {/* 2-Column Schedule */}
          <View style={styles.grid}>
            <View style={styles.column}>
              <Text style={styles.label}>Screening Date & Time</Text>
              <Text style={styles.valueGold}>
                {formatShowDate(showtime?.start_time)} at {formatShowtime(showtime?.start_time)}
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Cinema Auditorium</Text>
              <Text style={styles.value}>{auditorium?.name || "Cinema Room 1"}</Text>
            </View>
          </View>

          {/* Patron & Seat Information */}
          <View style={styles.grid}>
            <View style={styles.column}>
              <Text style={styles.label}>Ticket Holder</Text>
              <Text style={styles.value}>{reservation.customer_name || "MovieSeat Patron"}</Text>
              <Text style={{ fontSize: 9, color: "#9CA3AF", marginTop: 2 }}>
                {reservation.customer_email || ""}
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Allocated Seats & Total</Text>
              <Text style={styles.valueGold}>
                {seats.map((s) => s.seat_label).join(", ")}
              </Text>
              <Text style={{ fontSize: 9, color: "#10B981", marginTop: 2 }}>
                Total: PHP {Number(reservation.total_amount).toFixed(2)} (Paid)
              </Text>
            </View>
          </View>

          {/* Verification Stub */}
          <View style={styles.stub}>
            <Text style={styles.stubTitle}>Pass Verification Code</Text>
            <Text style={styles.refCode}>{refCode}</Text>
            <Text style={styles.barcode}>||| | |||| | || |||| | |||</Text>
            <Text style={styles.scanText}>Present code or scan at turnstile</Text>
          </View>

          {/* Guidelines */}
          <View style={styles.guidelines}>
            <Text style={styles.guidelineTitle}>Theater & Concession Guidelines</Text>
            <Text style={styles.guidelineText}>
              Please present this e-ticket at the cinema turnstile. Gates open 15 minutes before showtime. Free cancellation is permitted up to 30 minutes before screening via the Find Reservation self-service portal.
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          MovieSeat Cinemas • Bonifacio Global City, Manila • Official Digital E-Ticket Pass
        </Text>
      </Page>
    </Document>
  );
}
