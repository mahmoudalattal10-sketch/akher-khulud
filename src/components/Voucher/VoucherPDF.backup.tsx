import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { BookingDetails, BookingStatus, GuestInfo } from './types';

// Standard Fonts (Helvetica/Times) used to prevent CORS issues
// Custom Font registration removed


// Brand Colors
const COLORS = {
    primary: '#1a3d2a', // Dark Slate / Emerald Deep
    secondary: '#c5a059', // Gold
    accent: '#f8fafc', // Light Gray
    text: '#0f172a', // Slate 900
    textLight: '#64748b', // Slate 500
    border: '#e2e8f0', // Slate 200
    white: '#ffffff',
    success: '#059669',
    pending: '#d97706',
};

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
        padding: 0,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 30,
        paddingBottom: 20,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        position: 'relative',
        marginBottom: 15,
    },
    headerLeft: {
        flexDirection: 'column',
    },
    logo: {
        width: 140,
        height: 70,
        objectFit: 'contain',
    },
    // Centered Badge Style
    verifiedBadgeContainer: {
        position: 'absolute',
        bottom: -12, // Half height approx
        left: '50%',
        marginLeft: -70, // Half width approx
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 140,
    },
    verifiedText: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.textLight,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginLeft: 6,
    },
    headerRight: {
        alignItems: 'flex-start',
        gap: 8,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 50,
        borderWidth: 1,
        marginBottom: 5,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    statusText: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    refContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    refLabel: {
        fontSize: 9,
        color: COLORS.textLight,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    refValue: {
        fontSize: 13,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.text,
        letterSpacing: -0.5,
    },
    contentContainer: {
        paddingVertical: 25,
        paddingHorizontal: 40,
    },
    sectionTitle: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.textLight,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
        marginTop: 15,
    },
    card: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    label: {
        fontSize: 8,
        color: COLORS.textLight,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    valueLarge: {
        fontSize: 16,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.text,
        textTransform: 'uppercase',
    },
    value: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.text,
    },
    valueNumber: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.text,
    },
    valueLargeNumber: {
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.text,
    },
    propertyContainer: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 20,
        backgroundColor: '#fdfdfd',
    },
    propertyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    propertyTitle: {
        fontSize: 20,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.primary,
        marginBottom: 4,
    },
    propertyAddress: {
        fontSize: 9,
        color: COLORS.textLight,
    },
    assetIdBox: {
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    specsGrid: {
        flexDirection: 'row',
        marginTop: 15,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 15,
        gap: 30,
    },
    specItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    specIconBox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        backgroundColor: COLORS.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    specValue: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.text,
    },
    financialTable: {
        marginTop: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
    },
    finRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        backgroundColor: '#fff',
    },
    finTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: COLORS.primary,
    },
    finLabel: {
        fontSize: 11,
        color: COLORS.textLight,
    },
    finValue: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.text,
    },
    finTotalLabel: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        color: 'rgba(255,255,255,0.8)',
        textTransform: 'uppercase',
    },
    finTotalValue: {
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.secondary,
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});

interface VoucherPDFProps {
    booking: BookingDetails;
    guest: GuestInfo;
    status: BookingStatus;
    welcomeMessage: string;
}

const VoucherPDF: React.FC<VoucherPDFProps> = ({ booking, guest, status, welcomeMessage }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* 1. Header Area - Clean & Balanced */}
                {/* 1. Header Area - Clean & Balanced */}
                <View style={styles.headerContainer}>
                    {/* Left: Logo */}
                    <View style={styles.headerLeft}>
                        <View style={{ width: 140, height: 70, justifyContent: 'center' }}>
                            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 24, color: COLORS.primary }}>DIYAFAAT</Text>
                        </View>
                    </View>

                    {/* Right: Status & Reference */}
                    <View style={styles.headerRight}>
                        <View style={[styles.statusBadge, {
                            borderColor: status === BookingStatus.CONFIRMED ? '#059669' : '#f59e0b',
                            backgroundColor: status === BookingStatus.CONFIRMED ? '#ecfdf5' : '#fffbeb'
                        }]}>
                            <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: status === BookingStatus.CONFIRMED ? '#ecfdf5' : '#fffbeb', alignItems: 'center', justifyContent: 'center', marginRight: 6 }}>
                                {status === BookingStatus.CONFIRMED ? (
                                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#059669' }} />
                                ) : (
                                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#d97706' }} />
                                )}
                            </View>
                            <Text style={[styles.statusText, { color: status === BookingStatus.CONFIRMED ? '#064e3b' : '#92400e' }]}>{status}</Text>
                        </View>
                        <View style={styles.refContainer}>
                            <Text style={styles.refLabel}>REFERENCE:</Text>
                            <Text style={styles.refValue}>{booking.reference}</Text>
                        </View>
                    </View>

                    {/* Centered Badge - Absolute Positioned */}
                    <View style={styles.verifiedBadgeContainer}>
                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 8, fontFamily: 'Helvetica-Bold' }}>✓</Text>
                        </View>
                        <Text style={styles.verifiedText}>Verified Tourism Partner</Text>
                    </View>
                </View>

                {/* 2. Main Content */}
                <View style={styles.contentContainer}>
                    {/* Welcome Message with Quote */}
                    <View style={{ flexDirection: 'row', marginBottom: 15, paddingHorizontal: 10 }}>
                        <Text style={{ fontSize: 40, fontFamily: 'Helvetica-Bold', color: '#c5a059', opacity: 0.4, marginRight: 10, lineHeight: 0.8 }}>“</Text>
                        <Text style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic', lineHeight: 1.6, flex: 1, fontFamily: 'Helvetica' }}>
                            Dear Mr. {guest.lastName}, it is our pleasure to formally confirm your reservation at
                            <Text style={{ fontFamily: 'Helvetica-Bold', color: '#1e293b' }}> {booking.hotelName}</Text>
                            . Your stay in a
                            <Text style={{ fontFamily: 'Helvetica-Bold', color: '#1e293b' }}> {booking.roomType}</Text>
                            for
                            <Text style={{ fontFamily: 'Helvetica-Bold', color: '#1e293b' }}> {booking.nights} nights</Text>
                            (from
                            <Text style={{ fontFamily: 'Helvetica-Bold', color: '#1e293b' }}> {booking.checkIn}</Text>
                            to
                            <Text style={{ fontFamily: 'Helvetica-Bold', color: '#1e293b' }}> {booking.checkOut}</Text>
                            is officially
                            <Text style={{ fontFamily: 'Helvetica-Bold', color: status === BookingStatus.CONFIRMED ? '#286343' : '#d97706', textTransform: 'uppercase' }}>
                                {status === BookingStatus.CONFIRMED ? ' CONFIRMED' : ' PENDING'}
                            </Text>
                            . We look forward to welcoming you soon.
                        </Text>
                    </View>

                    {/* Guest & Trip Info Grid - Balanced Columns */}
                    <View style={{ flexDirection: 'row', gap: 15, marginBottom: 20 }}>
                        {/* Passenger Card */}
                        <View style={[styles.card, { flex: 1 }]}>
                            <Text style={styles.label}>Primary Guest</Text>
                            <Text style={styles.valueLarge}>{guest.firstName} {guest.lastName}</Text>
                            <Text style={[styles.value, { marginTop: 4, opacity: 0.7 }]}>{guest.nationality}</Text>

                            <View style={{ marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: COLORS.border }}>
                                <Text style={styles.label}>Contact Detail</Text>
                                <Text style={styles.valueNumber}>{guest.phone || guest.email}</Text>
                            </View>
                        </View>

                        {/* Dates Card */}
                        <View style={[styles.card, { flex: 1.5, flexDirection: 'row', backgroundColor: '#fff' }]}>
                            <View style={{ flex: 1, paddingRight: 10 }}>
                                <Text style={styles.label}>Check-In</Text>
                                <Text style={styles.valueLargeNumber}>{booking.checkIn}</Text>
                                <Text style={[styles.value, { color: COLORS.textLight }]}>{booking.checkInTime}</Text>
                            </View>
                            <View style={{ width: 1, backgroundColor: COLORS.border, marginHorizontal: 10 }} />
                            <View style={{ flex: 1, paddingLeft: 10 }}>
                                <Text style={styles.label}>Check-Out</Text>
                                <Text style={styles.valueLargeNumber}>{booking.checkOut}</Text>
                                <Text style={[styles.value, { color: COLORS.textLight }]}>{booking.checkOutTime}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Property Asset Section */}
                    <View style={styles.propertyContainer}>
                        <View style={styles.propertyHeader}>
                            <View>
                                <Text style={[styles.label, { color: COLORS.secondary }]}>Property Asset</Text>
                                <Text style={styles.propertyTitle}>{booking.hotelName}</Text>
                                <Text style={styles.propertyAddress}>{booking.hotelAddress}</Text>
                            </View>
                            <View style={styles.assetIdBox}>
                                <Text style={{ fontSize: 6, color: COLORS.textLight, textTransform: 'uppercase', marginBottom: 2 }}>Asset ID</Text>
                                <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold' }}>{(booking.reference && typeof booking.reference === 'string' ? booking.reference.split('-')[2] : '8892') || '8892'}</Text>
                            </View>
                        </View>

                        <View style={styles.specsGrid}>
                            <View style={styles.specItem}>
                                <View style={styles.specIconBox}><Text style={{ fontSize: 8 }}>🛏</Text></View>
                                <View>
                                    <Text style={styles.label}>Room Type</Text>
                                    <Text style={styles.specValue}>{booking.roomType}</Text>
                                </View>
                            </View>
                            <View style={styles.specItem}>
                                <View style={styles.specIconBox}><Text style={{ fontSize: 8 }}>🍽</Text></View>
                                <View>
                                    <Text style={styles.label}>Boarding</Text>
                                    <Text style={styles.specValue}>{booking.boardBasis}</Text>
                                </View>
                            </View>
                            <View style={styles.specItem}>
                                <View style={styles.specIconBox}><Text style={{ fontSize: 8 }}>👥</Text></View>
                                <View>
                                    <Text style={styles.label}>Occupancy</Text>
                                    <Text style={styles.specValue}>{booking.occupancy} Guests</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Financial Ledger */}
                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.sectionTitle}>Financial Ledger</Text>
                        <View style={styles.financialTable}>
                            <View style={styles.finRow}>
                                <Text style={styles.finLabel}>Base Value</Text>
                                <Text style={styles.finValue}>
                                    {((booking.totalPrice || 0) - ((booking.extraBedCount || 0) * (booking.extraBedPrice || 0) * (booking.nights || 1))).toLocaleString(undefined, { minimumFractionDigits: 2 })} {booking.currency || 'SAR'}
                                </Text>
                            </View>
                            {(booking.extraBedCount || 0) > 0 && (
                                <View style={styles.finRow}>
                                    <Text style={styles.finLabel}>Extra Bed (x{booking.extraBedCount})</Text>
                                    <Text style={styles.finValue}>
                                        {((booking.extraBedCount || 0) * (booking.extraBedPrice || 0) * booking.nights).toLocaleString(undefined, { minimumFractionDigits: 2 })} {booking.currency}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.finTotalRow}>
                                <View>
                                    <Text style={styles.finTotalLabel}>Final Settlement</Text>
                                    <Text style={{ fontSize: 6, color: 'rgba(255,255,255,0.6)', marginTop: 2, textTransform: 'uppercase' }}>Includes Taxes & Fees</Text>
                                </View>
                                <Text style={styles.finTotalValue}>
                                    {(booking.totalPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} {booking.currency || 'SAR'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={[styles.footerContainer, { paddingBottom: 50 }]}>
                    <View style={{ flexDirection: 'row', padding: 25, borderTopWidth: 1, borderTopColor: COLORS.border, alignItems: 'center' }}>
                        {/* Col 1 - Secured Registry */}
                        <View style={{ borderRightWidth: 1, borderRightColor: COLORS.border, paddingRight: 15, alignItems: 'center', flexDirection: 'row', gap: 10 }}>
                            <View style={{ width: 34, height: 34, backgroundColor: '#ffffff', borderRadius: 6, alignItems: 'center', justifyContent: 'center', padding: 2 }}>
                                <View style={{ width: 30, height: 30, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 6, fontFamily: 'Helvetica-Bold' }}>QR</Text>
                                </View>
                            </View>
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                                    <View style={{ width: 8, height: 8, backgroundColor: '#1e293b', borderRadius: 4 }} />
                                    <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#1e293b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Secured Registry</Text>
                                </View>
                                <Text style={{ fontSize: 6, color: '#94a3b8', fontStyle: 'italic', textTransform: 'uppercase' }}>System Powered by</Text>
                                <Text style={{ fontSize: 6, color: '#94a3b8', fontStyle: 'italic', textTransform: 'uppercase' }}>Elattal Co.</Text>
                            </View>
                        </View>
                        {/* Col 2 */}
                        <View style={{ paddingLeft: 15, borderRightWidth: 1, borderRightColor: COLORS.border, paddingRight: 15, alignItems: 'flex-start' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                                <Text style={{ fontSize: 8, color: '#c5a059' }}>📞</Text>
                                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#1e293b' }}>+966 2445 388 055</Text>
                            </View>
                            <Text style={{ fontSize: 6, color: '#94a3b8', textTransform: 'uppercase' }}>24/7 Support Line</Text>
                        </View>
                        {/* Col 3 */}
                        <View style={{ paddingLeft: 15, alignItems: 'flex-start' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                                <Text style={{ fontSize: 8, color: '#c5a059' }}>✉️</Text>
                                <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#1e293b', textTransform: 'uppercase' }}>Diyafaat.khulood@outlook.sa</Text>
                            </View>
                            <Text style={{ fontSize: 6, color: '#94a3b8', textTransform: 'uppercase' }}>Official Correspondence</Text>
                        </View>
                    </View>


                </View>
            </Page>
        </Document>
    );
};

export default VoucherPDF;
