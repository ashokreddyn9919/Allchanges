import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getDocumentScanner } from 'lightning/mobileCapabilities';
import createLeadFromScan from '@salesforce/apex/CardScanController.createLeadFromScan';

export default class CardScanner extends LightningElement {
  @track errorMessage;

  // UI state
  mobileSupported = false;
  isScanning = false;
  isSaving = false;

  // OCR output
  rawText = '';
  imageBase64;        // base64 only
  imageContentType;   // e.g. image/jpeg

  // Parsed / editable fields
  fullName = '';
  email = '';
  phone = '';
  fax = '';
  company = '';
  locationText = '';
  facebook = '';
  instagram = '';

  connectedCallback() {
    try {
      const scanner = getDocumentScanner();
      this.mobileSupported = !!scanner && scanner.isAvailable();
    } catch (e) {
      this.mobileSupported = false;
    }
  }

  // ----- UI GETTERS -----
  get scanDisabled() {
    return !this.mobileSupported || this.isScanning || this.isSaving;
  }

  get resetDisabled() {
    return this.isScanning || this.isSaving || !(this.rawText || this.fullName || this.email || this.phone || this.company);
  }

  get createDisabled() {
    // Require at least something meaningful
    const hasSomething = (this.rawText || this.fullName || this.email || this.phone || this.company);
    return this.isSaving || this.isScanning || !hasSomething;
  }

  get scanButtonLabel() {
    return this.isScanning ? 'Scanning…' : 'Scan Card';
  }

  get createButtonLabel() {
    return this.isSaving ? 'Creating…' : 'Create Lead';
  }

  get hasImage() {
    console.log('imageBase64 present?', !!this.imageBase64);
    console.log('imageBase64 length', this.imageBase64 ? this.imageBase64.length : 0);
    console.log('imageContentType', this.imageContentType);
    return !!this.imageBase64;
  }

  // ----- FIELD HANDLERS -----
  onFullNameChange(e) { this.fullName = e.detail.value; }
  onEmailChange(e) { this.email = e.detail.value; }
  onPhoneChange(e) { this.phone = e.detail.value; }
  onFaxChange(e) { this.fax = e.detail.value; }
  onCompanyChange(e) { this.company = e.detail.value; }
  onLocationTextChange(e) { this.locationText = e.detail.value; }
  onFacebookChange(e) { this.facebook = e.detail.value; }
  onInstagramChange(e) { this.instagram = e.detail.value; }

  // ----- RESET -----
  handleReset() {
    this.errorMessage = null;
    this.rawText = '';
    this.imageBase64 = null;
    this.imageContentType = null;

    this.fullName = '';
    this.email = '';
    this.phone = '';
    this.fax = '';
    this.company = '';
    this.locationText = '';
    this.facebook = '';
    this.instagram = '';
  }

  // ----- SCAN -----
  async handleScan() {
    this.errorMessage = null;
    this.isScanning = true;

    // clear prior scan outputs (keep user edits? your choice; here we reset scan outputs only)
    this.rawText = '';
    this.imageBase64 = null;
    this.imageContentType = null;

    try {
      const scanner = getDocumentScanner();
      if (!scanner || !scanner.isAvailable()) {
        this.errorMessage = 'DocumentScanner is not available. Please use Salesforce Mobile App.';
        return;
      }

      // Use constants when present; fallback to strings
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
        returnImageBytes: true // IMPORTANT: return the image bytes so we can attach later
      };

      const results = await scanner.scan(options);
      const docs = Array.isArray(results) ? results : [results];
      const doc0 = docs[0];

      // OCR raw text
      this.rawText = this.extractTextFromDocuments(docs);

      // image bytes (property varies by platform/org)
      this.imageBase64 = doc0?.imageBytes || doc0?.imageData || doc0?.base64Image || null;
      this.imageContentType = doc0?.contentType || 'image/jpeg';

      // parse
      const parsed = this.parseBusinessCardText(this.rawText);

      // Fill only if empty (don’t overwrite user edits)
      this.fullName = this.fullName || parsed.fullName || '';
      this.email = this.email || parsed.email || '';
      this.phone = this.phone || parsed.phone || '';
      this.fax = this.fax || parsed.fax || '';
      this.company = this.company || parsed.company || '';
      this.locationText = this.locationText || parsed.locationText || '';
      this.facebook = this.facebook || parsed.facebook || '';
      this.instagram = this.instagram || parsed.instagram || '';

      this.toast('Scan complete', 'Review details and tap Create Lead', 'success');

    } catch (e) {
      this.errorMessage = this.normalizeError(e);
      this.toast('Scan failed', this.errorMessage, 'error');
      console.error('Scan error:', JSON.stringify(e));
    } finally {
      this.isScanning = false;
    }
  }

  extractTextFromDocuments(docs) {
    if (!docs || !docs.length) return '';
    return docs.map(doc => {
      if (!doc) return '';
      if (doc.text) return doc.text;

      const lines = [];
      (doc.blocks || []).forEach(b => (b.lines || []).forEach(l => l.text && lines.push(l.text)));
      (doc.lines || []).forEach(l => l.text && lines.push(l.text));
      return lines.join('\n');
    }).filter(Boolean).join('\n\n');
  }

  async handleCreateLead() {
    this.errorMessage = null;
    this.isSaving = true;

    this.toast('Creating Lead…', 'Please wait', 'info');

    try {
      const req = {
            rawText: String(this.rawText || ''),
            fullName: String(this.fullName || ''),
            email: String(this.email || ''),
            phone: String(this.phone || ''),
            fax: String(this.fax || ''),
            company: String(this.company || ''),
            locationText: String(this.locationText || ''),
            facebook: String(this.facebook || ''),
            instagram: String(this.instagram || ''),
            imageBase64: this.imageBase64 || null,
            imageContentType: this.imageContentType || 'image/jpeg'
        };

      console.log('Sending createLeadFromScan request', JSON.stringify(req));

      const leadId = await createLeadFromScan({ req });

      this.toast('Success', `Lead created: ${leadId}`, 'success');

      // Optional: keep raw text for audit? Here we reset everything.
      this.handleReset();

    } catch (e) {
      this.errorMessage = this.normalizeError(e);
      this.toast('Lead create failed', this.errorMessage, 'error');
      console.error('Create Lead error:', JSON.stringify(e));
    } finally {
      this.isSaving = false;
    }
  }

  // ----- PARSER (Name/Email/Phone/Fax/Facebook/Instagram/Company/Location) -----
  parseBusinessCardText(text) {
    const t = (text || '').replace(/\r/g, '').trim();
    const lines = t.split('\n').map(s => s.trim()).filter(Boolean);

    // EMAIL
    const emailMatch = t.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/ig);
    const email = emailMatch ? emailMatch[0] : '';

    // PHONE (general)
    const phoneMatch = t.match(/(\+?\d{1,3}[\s.-]?)?(\(?\d{2,4}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/g);
    const phone = phoneMatch ? phoneMatch[0] : '';

    // FAX (prefer explicit "Fax" line)
    let fax = '';
    const faxLine = lines.find(l => /\bfax\b/i.test(l));
    if (faxLine) {
      const m = faxLine.match(/(\+?\d{1,3}[\s.-]?)?(\(?\d{2,4}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/);
      fax = m ? m[0] : '';
    }

    // FACEBOOK / INSTAGRAM URLs
    let facebook = '';
    let instagram = '';

    const fbUrl = t.match(/(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.com)\/[A-Za-z0-9.\-_]+/i);
    if (fbUrl) facebook = fbUrl[0];

    const igUrl = t.match(/(?:https?:\/\/)?(?:www\.)?instagram\.com\/[A-Za-z0-9.\-_]+/i);
    if (igUrl) instagram = igUrl[0];

    // Handles like "@name" if no URL but line mentions platform
    if (!instagram) {
      const igLine = lines.find(l => /instagram/i.test(l) && /@[\w.]+/.test(l));
      if (igLine) {
        const hm = igLine.match(/@[\w.]+/);
        instagram = hm ? hm[0] : '';
      }
    }
    if (!facebook) {
      const fbLine = lines.find(l => /facebook|\bfb\b/i.test(l) && /@[\w.]+/.test(l));
      if (fbLine) {
        const hm = fbLine.match(/@[\w.]+/);
        facebook = hm ? hm[0] : '';
      }
    }

    // COMPANY guess
    const companyKeywords = /(inc|llc|ltd|corp|corporation|company|technologies|technology|solutions|systems|services|labs)/i;
    let company = '';
    for (const ln of lines) {
      if (companyKeywords.test(ln) && !/@/.test(ln)) { company = ln; break; }
    }

    // NAME guess (first meaningful line)
    let fullName = '';
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const ln = lines[i];
      if (!/@/.test(ln) && !/\d{3}[\s.-]?\d{4}/.test(ln) && ln.length <= 40) {
        fullName = ln;
        break;
      }
    }

    // LOCATION guess
    let locationText = '';
    const cityStateZip = /([A-Za-z.\s]+,\s*[A-Z]{2}\s*\d{5}(-\d{4})?)/;
    for (const ln of lines) {
      if (cityStateZip.test(ln)) { locationText = ln; break; }
    }

    return { fullName, email, phone, fax, company, locationText, facebook, instagram };
  }

  normalizeError(e) {
    if (!e) return 'Unknown error';
    if (typeof e === 'string') return e;
    if (e.body?.message) return e.body.message;
    if (e.message) return e.message;
    if (e.code && e.message) return `${e.code}: ${e.message}`;
    return JSON.stringify(e);
  }

  toast(title, message, variant) {
    this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
  }

  // ----- MOCK -----
  handleMockScan() {
    const mockText =
`ACME TECHNOLOGIES INC
123 Main St, Suite 200
San Jose, CA 95110

John A Doe
Senior Engineer
john.doe@acme.com
Phone: 510-555-1234
Fax: 510-555-9999
facebook.com/johndoe
instagram.com/johndoe`;

    this.rawText = mockText;
    const parsed = this.parseBusinessCardText(mockText);
    this.fullName = parsed.fullName || '';
    this.email = parsed.email || '';
    this.phone = parsed.phone || '';
    this.fax = parsed.fax || '';
    this.company = parsed.company || '';
    this.locationText = parsed.locationText || '';
    this.facebook = parsed.facebook || '';
    this.instagram = parsed.instagram || '';

    this.toast('Mock loaded', 'Now click Create Lead', 'info');
  }
}