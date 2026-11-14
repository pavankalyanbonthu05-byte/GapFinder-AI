/**
 * Client-side PDF text extractor using pdfjs-dist
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  // @ts-ignore
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");

  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || "3.11.174"}/pdf.worker.min.js`;
  }

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  });

  const pdfDoc = await loadingTask.promise;

  let fullText = "";
  const numPages = pdfDoc.numPages;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageStrings = textContent.items
      // @ts-ignore
      .map((item: any) => item.str || "")
      .join(" ");

    if (pageStrings.trim()) {
      fullText += `\n[--- Page ${pageNum} ---]\n` + pageStrings + "\n";
    }
  }

  return fullText.trim();
}
