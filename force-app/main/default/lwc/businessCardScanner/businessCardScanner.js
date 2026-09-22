import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getDocumentScanner } from 'lightning/mobileCapabilities';
import saveLead from '@salesforce/apex/BusinessCardScanController.saveLead';
import saveContact from '@salesforce/apex/BusinessCardScanController.saveContact';

export default class BusinessCardScanner extends LightningElement {
    @api recordId;
    @api objectApiName;

    @track errorMessage;

    // UI state
    mobileSupported = false;
    scanDisabled = true;
    resetDisabled = true;

    // Fields
    createAs = 'Lead';
    fullName = '';
    email = '';
    phone = '';
    company = '';
    locationText = '';
    capturedTimeISO = '';
    geoLat;
    geoLon;
    rawText = '';

    connectedCallback() {
        try {
            const scanner = getDocumentScanner();
            this.mobileSupported = scanner && scanner.isAvailable();
        } catch (e) {
            this.mobileSupported = false;
        }
        this.scanDisabled = !this.mobileSupported;
    }

    get createAsOptions() {
        return [
            { label: 'Lead', value: 'Lead' },
            { label: 'Contact', value: 'Contact' }
        ];
    }

    get saveLabel() {
        return this.createAs === 'Lead' ? 'Create Lead' : 'Create Contact';
    }

    get saveDisabled() {
        const hasSomething = (this.fullName || this.email || this.phone || this.company);
        return !hasSomething;
    }

    get hasGeo() {
        return this.geoLat !== undefined && this.geoLon !== undefined;
    }

    get geoDisplay() {
        return `${this.geoLat}, ${this.geoLon}`;
    }

    get capturedTimeDisplay() {
        if (!this.capturedTimeISO) return '';
        try {
            return new Date(this.capturedTimeISO).toLocaleString();
        } catch {
            return this.capturedTimeISO;
        }
    }

    handleCreateAsChange(event) {
        this.createAs = event.detail.value;
    }

    onFullNameChange(e) { this.fullName = e.detail.value; }
    onEmailChange(e) { this.email = e.detail.value; }
    onPhoneChange(e) { this.phone = e.detail.value; }
    onCompanyChange(e) { this.company = e.detail.value; }
    onLocationTextChange(e) { this.locationText = e.detail.value; }

    handleReset() {
        this.errorMessage = null;
        this.fullName = '';
        this.email = '';
        this.phone = '';
        this.company = '';
        this.locationText = '';
        this.capturedTimeISO = '';
        this.geoLat = undefined;
        this.geoLon = undefined;
        this.rawText = '';
        this.resetDisabled = true;
    }

    async handleScan() {
        this.errorMessage = null;
        this.capturedTimeISO = new Date().toISOString();
        await this.tryCaptureGeo();
        await this.scanWithDocumentScanner();
        this.resetDisabled = false;
    }

    // async scanWithDocumentScanner() {
    //     let scanner;
    //     try {
    //         scanner = getDocumentScanner();
    //         if (!scanner || !scanner.isAvailable()) {
    //             this.errorMessage = 'Scanner not available. Please use Salesforce Mobile App.';
    //             return;
    //         }
    //     } catch (e) {
    //         this.errorMessage = 'Scanner not available on this device.';
    //         return;
    //     }

    //     try {
    //         const options = {
    //             scanMode: 'DOCUMENT',
    //             source: 'CAMERA',
    //             imageType: 'PNG', 
    //             returnFullImage: false
    //         };

    //         const result = await scanner.scan(options);
            
    //         // DEBUG LINE: This shows the raw data in your OCR RAW TEXT box for troubleshooting
    //         this.rawText = JSON.stringify(result); 

    //         // Extract text using the improved logic
    //         const extractedText = this.extractTextFromResult(result);
            
    //         // If we successfully extracted text, we replace the JSON with the clean text
    //         if(extractedText) {
    //             this.rawText = extractedText;
    //         }

    //         const parsed = this.parseBusinessCardText(this.rawText);

    //         this.fullName = this.fullName || parsed.fullName || '';
    //         this.email = this.email || parsed.email || '';
    //         this.phone = this.phone || parsed.phone || '';
    //         this.company = this.company || parsed.company || '';
    //         this.locationText = this.locationText || parsed.locationText || '';

    //     } catch (e) {
    //         this.errorMessage = this.normalizeError(e);
    //     }
    // }

    // extractTextFromResult(result) {
    //     if (!result) return '';

    //     // Standard text property
    //     if (result.text) return result.text;

    //     // Nested in scannedDocument
    //     if (result.scannedDocument && result.scannedDocument.text) {
    //         return result.scannedDocument.text;
    //     }

    //     // Handle pages array (Modern mobile standard)
    //     if (result.pages && Array.isArray(result.pages)) {
    //         return result.pages.map(page => page.text || '').join('\n');
    //     }

    //     // Rebuild from blocks/lines
    //     const blocks = result.blocks || result.textBlocks || [];
    //     if (Array.isArray(blocks) && blocks.length > 0) {
    //         return blocks.map(block => {
    //             const lines = block.lines || [];
    //             return lines.map(line => line.text).join(' ');
    //         }).join('\n');
    //     }

    //     return '';
    // }
// async scanWithDocumentScanner() {
//     try {
//         const myScanner = getDocumentScanner();
//         if (!myScanner.isAvailable()) {
//             this.errorMessage = "Scanner not available on this device.";
//             return;
//         }

//         // const options = {
//         //     scanMode: 'DOCUMENT',
//         //     imageSource: 'DEVICE_CAMERA',
//         //     returnImageBytes: false,
//         // };
// const options = {
//   imageSource: 'DEVICE_CAMERA',
//   scriptHint: 'LATIN',
//   extractEntities: true,
//   entityExtractionLanguageCode: 'en',
//   returnImageBytes: false
// };
//         const results = await myScanner.scan(options);
        
//         const doc = Array.isArray(results) ? results[0] : results;

// const cleanText = this.extractTextFromResult(doc);
// this.rawText = cleanText;

//         if (this.rawText) {
//             const parsed = this.parseBusinessCardText(this.rawText);

//             this.fullName = parsed.fullName || '';
//             this.email = parsed.email || '';
//             this.phone = parsed.phone || '';
//             this.company = parsed.company || '';
//             this.locationText = parsed.locationText || '';
//         }

//     } catch (error) {
//         this.errorMessage = "Error: " + error.message;
//         this.toast('Scanner Error', this.errorMessage, 'error');
//     }
// }
async scanWithDocumentScanner() {
    try {
        const myScanner = getDocumentScanner(); //
        if (!myScanner.isAvailable()) { //
            this.errorMessage = "Scanner not available on this device.";
            return;
        }

        const options = {
            imageSource: 'DEVICE_CAMERA', //
            scriptHint: 'LATIN', //
            extractEntities: true, //
            entityExtractionLanguageCode: 'en', //
            returnImageBytes: false
        };

        const results = await myScanner.scan(options); //
        
        // Handle both single objects and arrays of documents
        const doc = Array.isArray(results) ? results[0] : results;

        // Extract clean text from the hardware result
        const cleanText = this.extractTextFromResult(doc);
        this.rawText = cleanText;

        if (this.rawText) {
            const parsed = this.parseBusinessCardText(this.rawText);

           
            // Programmatically updating these variables ensures that handleSave 
            // has the data even though the user didn't type it manually.
            this.fullName = parsed.fullName || '';
            this.email = parsed.email || '';
            this.phone = parsed.phone || '';
            this.company = parsed.company || '';
            this.locationText = parsed.locationText || '';
            
            console.log('Success: Internal variables synced with OCR data.');
        }

    } catch (error) {
        this.errorMessage = "Scanner Error: " + error.message;
        this.toast('Error', this.errorMessage, 'error');
    }
}
// extractTextFromResult(result) {
//     if (!result) return '';
//     if (typeof result === 'string') return result; 
    
//     // Check standard text property
//     if (result.text) return result.text;

//     // Fallback to iterating blocks if .text is missing
//     if (result.blocks && Array.isArray(result.blocks)) {
//         return result.blocks.map(block => block.text).join('\n');
//     }

//     return '';
// }
extractTextFromResult(result) {
    if (!result) return '';

    // ✅ If scan() returned an array, extract text from each Document
    if (Array.isArray(result)) {
        return result.map(r => this.extractTextFromResult(r)).filter(Boolean).join('\n\n');
    }

    // already a string
    if (typeof result === 'string') return result;

    // Standard DocumentScanner result
    if (result.text) return result.text;

    // structured OCR
    if (result.blocks && Array.isArray(result.blocks)) {
        return result.blocks.map(b => {
            if (b.text) return b.text;
            if (b.lines && Array.isArray(b.lines)) {
                return b.lines.map(l => l.text).join(' ');
            }
            return '';
        }).filter(Boolean).join('\n');
    }

    return '';
}

    normalizeError(e) {
        if (!e) return 'Unknown error';
        if (typeof e === 'string') return e;
        if (e.body && e.body.message) return e.body.message;
        if (e.message) return e.message;
        return JSON.stringify(e);
    }

    async tryCaptureGeo() {
        try {
            if (!navigator.geolocation) return;
            const pos = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 8000,
                    maximumAge: 60000
                });
            });
            this.geoLat = pos.coords.latitude;
            this.geoLon = pos.coords.longitude;
        } catch (e) {
            // silent fail
        }
    }

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
            if (companyKeywords.test(ln) && !this.looksLikeEmailOrPhone(ln)) {
                company = ln;
                break;
            }
        }
        if (!company) {
            const candidates = lines
                .filter(ln => !this.looksLikeEmailOrPhone(ln))
                .filter(ln => ln.length >= 4 && ln.length <= 50);
            const allCaps = candidates.find(ln => ln === ln.toUpperCase() && /[A-Z]/.test(ln));
            company = allCaps || '';
        }

        let fullName = '';
        for (let i = 0; i < Math.min(3, lines.length); i++) {
            const ln = lines[i];
            if (!this.looksLikeEmailOrPhone(ln) && ln !== company) {
                if (!/(engineer|developer|architect|manager|director|vp|president|sales|marketing|consultant)/i.test(ln)) {
                    if (this.looksLikePersonName(ln)) {
                        fullName = ln;
                        break;
                    }
                }
            }
        }
        if (!fullName) {
            const fallback = lines.find(ln => !this.looksLikeEmailOrPhone(ln) && ln !== company);
            fullName = fallback || '';
        }

        let locationText = '';
        const addrPattern = /\b\d{1,5}\b.*\b(st|street|ave|avenue|rd|road|blvd|boulevard|dr|drive|suite|ste|floor|fl)\b/i;
        const cityStateZip = /([A-Za-z.\s]+,\s*[A-Z]{2}\s*\d{5}(-\d{4})?)/;
        for (const ln of lines) {
            if (addrPattern.test(ln) || cityStateZip.test(ln)) {
                locationText = ln;
                break;
            }
        }

        return { fullName, email, phone, company, locationText };
    }

    looksLikeEmailOrPhone(line) {
        return /@/.test(line) || /\d{3}[\s.-]?\d{4}/.test(line);
    }

    looksLikePersonName(line) {
        const clean = line.replace(/[^A-Za-z\s.'-]/g, '').trim();
        const parts = clean.split(/\s+/).filter(Boolean);
        if (parts.length < 2 || parts.length > 4) return false;
        if (clean.length > 40) return false;
        const capWords = parts.filter(p => /^[A-Z][a-zA-Z'.-]+$/.test(p));
        return capWords.length >= 2;
    }

    // async handleSave() {
    //     this.errorMessage = null;
    //     try {
    //         const payload = {
    //             fullName: this.fullName,
    //             email: this.email,
    //             phone: this.phone,
    //             company: this.company,
    //             locationText: this.locationText,
    //             capturedTimeISO: this.capturedTimeISO,
    //             latitude: this.geoLat,
    //             longitude: this.geoLon,
    //             sourceRecordId: this.recordId 
    //         };

    //         if (this.createAs === 'Lead') {
    //             await saveLead({ req: payload });
    //             this.toast('Success', 'Lead created successfully', 'success');
    //         } else {
    //             await saveContact({ req: payload });
    //             this.toast('Success', 'Contact created successfully', 'success');
    //         }
    //         this.handleReset();
    //     } catch (e) {
    //         this.errorMessage = this.normalizeError(e);
    //     }
    // }
async handleSave() {
    this.errorMessage = null;
    try {
        const payload = {
            fullName: this.fullName,
            email: this.email,
            phone: this.phone,
            company: this.company,
            locationText: this.locationText,
            capturedTimeISO: this.capturedTimeISO,
            latitude: this.geoLat,
            longitude: this.geoLon,
            sourceRecordId: this.recordId
        };

        // IMPORTANT: send as JSON string
        const reqJson = JSON.stringify(payload);
        console.log('Sending reqJson:', reqJson);

        // ✅ call correct method based on selection
        if (this.createAs === 'Contact') {
            await saveContact({ reqJson });
            this.toast('Success', 'Contact created successfully', 'success');
        } else {
            await saveLead({ reqJson });
            this.toast('Success', 'Lead created successfully', 'success');
        }

        this.handleReset();
    } catch (e) {
        let msg = 'Unknown error';
        if (e?.body?.message) msg = e.body.message;
        else if (e?.message) msg = e.message;
        else msg = JSON.stringify(e);

        this.errorMessage = msg;
        this.toast('Error', msg, 'error');
    }
}

    toast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }

    handleMockScan() {
        const mockText = `Company Name\nAddress\nFull Name\nemail@domain.com\nPhone: 510.555.1234`;
        this.capturedTimeISO = new Date().toISOString();
        this.rawText = mockText;
        const parsed = this.parseBusinessCardText(mockText);
        this.fullName = parsed.fullName;
        this.email = parsed.email;
        this.phone = parsed.phone;
        this.company = parsed.company;
        this.locationText = parsed.locationText;
    }
}