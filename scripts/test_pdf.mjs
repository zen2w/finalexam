import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, backgroundColor: '#0D0E12', color: '#FFFFFF' },
  title: { fontSize: 24, marginBottom: 10, color: '#F59E0B' },
});

const MyDoc = () => React.createElement(
  Document,
  null,
  React.createElement(
    Page,
    { size: 'A4', style: styles.page },
    React.createElement(Text, { style: styles.title }, 'MovieSeat Reservation Ticket'),
    React.createElement(Text, null, 'Testing PDF generation')
  )
);

async function testPdf() {
  console.log("Generating test PDF...");
  const blob = await pdf(React.createElement(MyDoc)).toBlob();
  const buffer = Buffer.from(await blob.arrayBuffer());
  console.log("Generated PDF bytes:", buffer.length);
  if (buffer.length > 500) {
    console.log("PDF generation SUCCESS! Header:", buffer.subarray(0, 8).toString());
  }
}

testPdf();
