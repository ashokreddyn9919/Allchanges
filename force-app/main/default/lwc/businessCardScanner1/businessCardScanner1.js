import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getDocumentScanner } from 'lightning/mobileCapabilities';

import createLeadFromScan from '@salesforce/apex/BusinessCardScanController1.createLeadFromScan';

export default class BusinessCardScanner1 extends LightningElement {
  @track errorMessage;

  rawText = '';
  imageBase64;          // captured image (base64, no data prefix)
  imageContentType;     // e.g. image/jpeg

  fullName = '';
  email = '';
  phone = '';
  company = '';
  locationText = '';

  get createDisabled() {
    // Lead requires Company + LastName (we’ll derive last name); still, require something meaningful
    return !(this.fullName || this.email || this.phone || this.company || this.rawText);
  }

  onFullNameChange(e) { this.fullName = e.detail.value; }
  onEmailChange(e) { this.email = e.detail.value; }
  onPhoneChange(e) { this.phone = e.detail.value; }
  onCompanyChange(e) { this.company = e.detail.value; }
  onLocationTextChange(e) { this.locationText = e.detail.value; }

  async handleScan() {
    this.errorMessage = null;
    this.rawText = '';
    this.imageBase64 = null;
    this.imageContentType = null;

    let scanner;
    try {
      scanner = getDocumentScanner();
      if (!scanner || !scanner.isAvailable()) {
        this.errorMessage = 'DocumentScanner is not available. Please use Salesforce Mobile App.';
        return;
      }
    } catch (e) {
      this.errorMessage = 'Scanner not available on this device.';
      return;
    }

    try {
      // ✅ Correct constants + safe fallback to strings
      const imageSource =
        (scanner.DocumentScannerSource && scanner.DocumentScannerSource.DEVICE_CAMERA)
          ? scanner.DocumentScannerSource.DEVICE_CAMERA
          : 'DEVICE_CAMERA';

      const scriptHint =
        (scanner.Script && scanner.Script.LATIN)
          ? scanner.Script.LATIN
          : 'LATIN';

      const options = {
        imageSource,
        scriptHint,
        returnImageBytes: true // ✅ IMPORTANT: returns base64 image bytes
      };

      const results = await scanner.scan(options);
      // results is Document[]
      const doc0 = Array.isArray(results) ? results[0] : results;

      // OCR text
      this.rawText = this.extractTextFromDocuments(results);

      // Image base64 + contentType (depends on device/org)
      // Common property names: imageBytes / imageData / contentType (varies)
      this.imageBase64 = doc0?.imageBytes || doc0?.imageData || doc0?.base64Image || null;
      this.imageContentType = doc0?.contentType || 'image/jpeg';

      // Parse into fields
      const parsed = this.parseBusinessCardText(this.rawText);
      this.fullName = parsed.fullName || this.fullName;
      this.email = parsed.email || this.email;
      this.phone = parsed.phone || this.phone;
      this.company = parsed.company || this.company;
      this.locationText = parsed.locationText || this.locationText;

    } catch (e) {
      this.errorMessage = this.normalizeError(e);
      console.error('Scan error:', JSON.stringify(e));
    }
  }

  extractTextFromDocuments(results) {
    if (!results) return '';
    const docs = Array.isArray(results) ? results : [results];

    return docs.map(doc => {
      if (!doc) return '';
      if (doc.text) return doc.text;

      // fallback: blocks -> lines
      const lines = [];
      (doc.blocks || []).forEach(b => (b.lines || []).forEach(l => l.text && lines.push(l.text)));
      (doc.lines || []).forEach(l => l.text && lines.push(l.text));
      return lines.join('\n');
    }).filter(Boolean).join('\n\n');
  }

  async handleCreateLead() {
    this.errorMessage = null;

    try {
      const req = {
        rawText: this.rawText,
        fullName: this.fullName,
        email: this.email,
        phone: this.phone,
        company: this.company,
        locationText: this.locationText,
        imageBase64: this.imageBase64,
        imageContentType: this.imageContentType
      };

      const leadId = await createLeadFromScan({ req });

      this.dispatchEvent(new ShowToastEvent({
        title: 'Success',
        message: `Lead created: ${leadId}`,
        variant: 'success'
      }));

      // Optional: clear UI after success
      this.rawText = '';
      this.imageBase64 = null;
      this.imageContentType = null;
      this.fullName = '';
      this.email = '';
      this.phone = '';
      this.company = '';
      this.locationText = '';

    } catch (e) {
      this.errorMessage = this.normalizeError(e);
    }
  }

  normalizeError(e) {
    if (!e) return 'Unknown error';
    if (typeof e === 'string') return e;
    if (e.body?.message) return e.body.message;
    if (e.message) return e.message;
    if (e.code && e.message) return `${e.code}: ${e.message}`;
    return JSON.stringify(e);
  }

  // Basic parser (same as before, trimmed)
  parseBusinessCardText(text) {
    const t = (text || '').replace(/\r/g, '').trim();
    const lines = t.split('\n').map(s => s.trim()).filter(Boolean);

    const emailMatch = t.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/ig);
    const email = emailMatch ? emailMatch[0] : '';

    const phoneMatch = t.match(/(\+?\d{1,3}[\s.-]?)?(\(?\d{2,4}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/g);
    const phone = phoneMatch ? phoneMatch[0] : '';

    const companyKeywords = /(inc|llc|ltd|corp|corporation|company|technologies|technology|solutions|systems|services|labs)/i;
    let company = '';
    for (const ln of lines) {
      if (companyKeywords.test(ln) && !/@/.test(ln)) { company = ln; break; }
    }

    // name guess
    let fullName = '';
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const ln = lines[i];
      if (!/@/.test(ln) && !/\d{3}[\s.-]?\d{4}/.test(ln) && ln.length <= 40) {
        fullName = ln;
        break;
      }
    }

    // address guess
    let locationText = '';
    const cityStateZip = /([A-Za-z.\s]+,\s*[A-Z]{2}\s*\d{5}(-\d{4})?)/;
    for (const ln of lines) {
      if (cityStateZip.test(ln)) { locationText = ln; break; }
    }

    return { fullName, email, phone, company, locationText };
  }
}