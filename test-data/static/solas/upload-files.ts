// Minimal valid PDF used as the content of files uploaded to program drop
// spots (Submission, Quote, Signing). The app only checks that a file is
// present in the drop spot, not what it contains; file names come from
// generateProgramLifecycleData() so each run's names are unique.
export const minimalPdf = {
    mimeType: 'application/pdf',
    content: '%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n',
} as const;
