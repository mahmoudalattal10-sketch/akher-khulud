import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BookingDetails, BookingStatus, GuestInfo } from './types';

interface VoucherDownloadButtonProps {
    booking: BookingDetails;
    guest: GuestInfo;
    status: BookingStatus;
    welcomeMessage: string;
}

const VoucherDownloadButton: React.FC<VoucherDownloadButtonProps> = ({ booking }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        setIsGenerating(true);

        try {
            // Find the A4 container element
            const voucherElement = document.querySelector('.a4-container') as HTMLElement;

            if (!voucherElement) {
                alert('Voucher element not found');
                setIsGenerating(false);
                return;
            }

            // Store original styles
            const originalWidth = voucherElement.style.width;
            const originalMinHeight = voucherElement.style.minHeight;

            // Temporarily set fixed dimensions for consistent capture
            voucherElement.style.width = '794px'; // A4 width at 96 DPI
            voucherElement.style.minHeight = '1123px'; // A4 height at 96 DPI

            // Wait for styles and FONTS to apply
            await document.fonts.ready;
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Capture the element as a canvas with EXTREME quality
            const canvas = await html2canvas(voucherElement, {
                scale: 4, // 4x resolution for crystal clear results
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                imageTimeout: 15000,
                scrollX: 0,
                scrollY: 0,
                windowWidth: 794,
                windowHeight: 1123,
                // Fix for Arabic text - ensure proper rendering
                onclone: (clonedDoc) => {
                    const body = clonedDoc.body;
                    body.style.width = '794px';
                    body.style.height = '1123px';
                    body.style.margin = '0';
                    body.style.padding = '0';
                    body.style.overflow = 'hidden';

                    const clonedElement = clonedDoc.querySelector('.a4-container') as HTMLElement;
                    if (clonedElement) {
                        // Restore A4 dimensions for capture engine stability
                        clonedElement.style.width = '794px';
                        clonedElement.style.height = '1123px';
                        clonedElement.style.margin = '0';
                        clonedElement.style.transform = 'none';
                        clonedElement.style.display = 'block';
                        clonedElement.style.visibility = 'visible';
                        clonedElement.style.opacity = '1';

                        // ONLY apply the Arabic Shaping fix (Required for html2canvas)
                        const allElements = clonedElement.querySelectorAll('*');
                        allElements.forEach((el) => {
                            const htmlEl = el as HTMLElement;
                            const text = htmlEl.textContent || '';
                            const hasArabic = /[\u0600-\u06FF]/.test(text);
                            const hasLatin = /[a-zA-Z]/.test(text);

                            if (hasArabic && htmlEl.children.length === 0) {
                                htmlEl.style.fontFamily = "'Cairo', sans-serif";
                                (htmlEl.style as any).fontFeatureSettings = '"kern" 1, "liga" 1, "clig" 1, "calt" 1';
                                (htmlEl.style as any).textRendering = 'optimizeLegibility';
                                htmlEl.style.letterSpacing = 'normal';

                                // Only force RTL if it's purely Arabic (no Latin chars)
                                // This prevents "Dear Mr. [Arabic Name]" from being flipped
                                if (!hasLatin) {
                                    htmlEl.style.direction = 'rtl';
                                    htmlEl.style.unicodeBidi = 'isolate';
                                } else {
                                    htmlEl.style.direction = 'ltr';
                                }
                            }
                        });
                    }
                }
            });

            // Restore original styles
            voucherElement.style.width = originalWidth;
            voucherElement.style.minHeight = originalMinHeight;

            // Create PDF with A4 dimensions
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: false, // No compression for better quality
            });

            // A4 dimensions in mm
            const pdfWidth = 210;
            const pdfHeight = 297;

            // Calculate image dimensions to fit A4 while maintaining aspect ratio
            const canvasAspectRatio = canvas.height / canvas.width;
            const a4AspectRatio = pdfHeight / pdfWidth;

            let imgWidth = pdfWidth;
            let imgHeight = pdfWidth * canvasAspectRatio;

            // If the image is taller than A4, scale it down
            if (imgHeight > pdfHeight) {
                imgHeight = pdfHeight;
                imgWidth = pdfHeight / canvasAspectRatio;
            }

            // Center the image on the page
            const xOffset = (pdfWidth - imgWidth) / 2;
            const yOffset = (pdfHeight - imgHeight) / 2;

            // Add image to PDF with maximum quality
            pdf.addImage(
                canvas.toDataURL('image/png', 1.0), // Full quality PNG
                'PNG',
                xOffset,
                yOffset,
                imgWidth,
                imgHeight,
                undefined,
                'FAST' // Use FAST compression for better quality
            );

            // Download the PDF
            pdf.save(`Voucher-${booking.reference}.pdf`);

        } catch (error) {
            console.error('PDF generation failed:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    if (isGenerating) {
        return (
            <button disabled className="bg-[#286343] opacity-80 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-wait shadow-lg">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-[11px] font-black uppercase tracking-wide">Generating...</span>
            </button>
        );
    }

    return (
        <button
            onClick={handleDownload}
            className="bg-[#286343] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#1a3d2a] transition-all shadow-lg active:scale-95"
        >
            <Download size={16} />
            <span className="text-[11px] font-black uppercase tracking-wide">Download PDF</span>
        </button>
    );
};

export default VoucherDownloadButton;
