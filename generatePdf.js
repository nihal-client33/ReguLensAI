import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  console.log('Launching browser to render presentation PDF...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const htmlPath = path.resolve(__dirname, 'presentation.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  // Wait for Google Fonts to load
  await page.evaluateHandle('document.fonts.ready');

  const pdfPath = path.resolve(__dirname, 'ReguLens_AI_Presentation.pdf');
  await page.pdf({
    path: pdfPath,
    width: '1920px',
    height: '1080px',
    printBackground: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    preferCSSPageSize: true
  });

  console.log(`Successfully generated presentation PDF at: ${pdfPath}`);
  await browser.close();
}

run().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
