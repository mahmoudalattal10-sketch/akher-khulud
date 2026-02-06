import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { BookingDetails, BookingStatus, GuestInfo } from './types';

// Brand Colors (matching web)
const COLORS = {
    primary: '#1a3d2a',
    secondary: '#c5a059',
    accent: '#f8fafc',
    text: '#0f172a',
    textMuted: '#94a3b8',
    textLight: '#64748b',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    white: '#ffffff',
    success: '#059669',
    successBg: '#f0fdf4',
    successBorder: '#059669',
    pending: '#d97706',
    pendingBg: '#fffbeb',
    pendingBorder: '#f59e0b',
    cardBg: '#fdfdfd',
};

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
        padding: 30,
        fontSize: 9,
    },
    // ============ HEADER ============
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderLight,
        marginBottom: 8,
        position: 'relative',
    },
    logoContainer: {
        width: 120,
    },
    headerRight: {
        alignItems: 'flex-end',
        gap: 6,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusText: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    refRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    refLabel: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    refValue: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.text,
    },
    // Verified Badge (Centered)
    verifiedBadgeContainer: {
        position: 'absolute',
        bottom: -10,
        left: '50%',
        marginLeft: -75,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
        borderRadius: 15,
        paddingHorizontal: 16,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
    },
    verifiedDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.secondary,
        marginRight: 6,
    },
    verifiedText: {
        fontSize: 6,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.textLight,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    // ============ WELCOME MESSAGE ============
    welcomeContainer: {
        flexDirection: 'row',
        marginTop: 18,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    quoteIcon: {
        fontSize: 28,
        fontFamily: 'Helvetica-Bold',
        color: '#e4dcc0',
        marginRight: 10,
        lineHeight: 0.8,
    },
    welcomeText: {
        fontSize: 10,
        color: COLORS.textLight,
        lineHeight: 1.6,
        flex: 1,
        fontStyle: 'italic',
    },
    welcomeBold: {
        fontFamily: 'Helvetica-Bold',
        color: COLORS.text,
    },
    // ============ INFO GRID ============
    infoGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 14,
    },
    // Guest Card
    guestCard: {
        flex: 4,
        flexDirection: 'column',
        gap: 8,
    },
    guestMainCard: {
        backgroundColor: COLORS.accent,
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    label: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 3,
    },
    guestName: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.text,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    nationalityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    nationalityIcon: {
        fontSize: 10,
        color: COLORS.secondary,
    },
    nationalityText: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.textLight,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    contactInfo: {
        paddingLeft: 4,
    },
    contactItem: {
        marginBottom: 6,
    },
    contactLabel: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.text,
    },
    // Dates Card
    datesCard: {
        flex: 8,
        backgroundColor: COLORS.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
        overflow: 'hidden',
    },
    datesRow: {
        flexDirection: 'row',
        flex: 1,
    },
    dateBlock: {
        flex: 1,
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateDivider: {
        width: 1,
        backgroundColor: COLORS.borderLight,
    },
    dateLabel: {
        fontSize: 7,
        color: COLORS.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 6,
    },
    dateValue: {
        fontSize: 22,
        fontFamily: 'Helvetica',
        color: COLORS.text,
        marginBottom: 4,
    },
    dateTime: {
        fontSize: 8,
        color: COLORS.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    durationBar: {
        backgroundColor: COLORS.accent,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: COLORS.borderLight,
        gap: 6,
    },
    durationLabel: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    durationDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.secondary,
    },
    durationValue: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.secondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    // ============ PROPERTY ASSET ============
    propertyCard: {
        backgroundColor: COLORS.cardBg,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 14,
        padding: 14,
        marginBottom: 14,
    },
    sectionLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 6,
    },
    sectionLabelDot: {
        width: 5,
        height: 2,
        backgroundColor: COLORS.secondary,
    },
    sectionLabelText: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.secondary,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    propertyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    propertyName: {
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.primary,
        marginBottom: 4,
    },
    propertyAddressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    propertyAddressIcon: {
        fontSize: 8,
        color: COLORS.secondary,
    },
    propertyAddress: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.textLight,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    assetIdBox: {
        backgroundColor: COLORS.accent,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
    },
    assetIdLabel: {
        fontSize: 5,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 4,
    },
    assetIdRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    assetIdHash: {
        fontSize: 10,
        color: COLORS.secondary,
    },
    assetIdValue: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.text,
    },
    // ============ ACCOMMODATION + FINANCIAL ============
    accommodationRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 14,
    },
    accommodationCard: {
        flex: 7,
    },
    accommodationTitle: {
        fontSize: 15,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.text,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderLight,
        paddingBottom: 8,
        marginBottom: 12,
    },
    specsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    specItem: {
        width: '45%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    specIconBox: {
        width: 24,
        height: 24,
        backgroundColor: COLORS.accent,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    specIcon: {
        fontSize: 10,
        color: COLORS.secondary,
    },
    specContent: {
        flex: 1,
    },
    specLabel: {
        fontSize: 6,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 2,
    },
    specValue: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.textLight,
        textTransform: 'uppercase',
    },
    // Financial Card
    financialCard: {
        flex: 5,
        backgroundColor: COLORS.primary,
        borderRadius: 14,
        overflow: 'hidden',
    },
    financialHeader: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    financialTitle: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    financialContent: {
        paddingHorizontal: 12,
        paddingBottom: 8,
    },
    finRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    finLabel: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    finValue: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.white,
    },
    financialTotal: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    finTotalLabel: {
        fontSize: 6,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.secondary,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 4,
    },
    finTotalRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    finTotalValue: {
        fontSize: 22,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.white,
    },
    finTotalCurrency: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.secondary,
        textTransform: 'uppercase',
    },
    finTotalNote: {
        fontSize: 5,
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: 2,
    },
    // ============ POLICIES ============
    policiesRow: {
        flexDirection: 'row',
        gap: 24,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderLight,
        marginBottom: 12,
    },
    policyCard: {
        flex: 1,
    },
    policyTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
    },
    policyTitleDot: {
        width: 6,
        height: 6,
        backgroundColor: COLORS.secondary,
        transform: 'rotate(45deg)',
    },
    policyTitleText: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.text,
        textTransform: 'uppercase',
    },
    policyItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 8,
    },
    policyItemDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: COLORS.secondary,
        marginTop: 3,
    },
    policyItemContent: {
        flex: 1,
    },
    policyItemTitle: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.text,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    policyItemDesc: {
        fontSize: 7,
        color: COLORS.textMuted,
    },
    // ============ FOOTER ============
    footer: {
        position: 'absolute',
        bottom: 25,
        left: 30,
        right: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderLight,
    },
    footerCol: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    footerIconBox: {
        width: 28,
        height: 28,
        backgroundColor: COLORS.text,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerIconText: {
        fontSize: 6,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.white,
    },
    footerContent: {
        flexDirection: 'column',
    },
    footerLabel: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.text,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    footerValue: {
        fontSize: 6,
        color: COLORS.textMuted,
        textTransform: 'uppercase',
    },
    footerDivider: {
        width: 1,
        height: 30,
        backgroundColor: COLORS.borderLight,
        marginHorizontal: 12,
    },
});

interface VoucherPDFProps {
    booking: BookingDetails;
    guest: GuestInfo;
    status: BookingStatus;
    welcomeMessage: string;
}

const VoucherPDF: React.FC<VoucherPDFProps> = ({ booking, guest, status, welcomeMessage }) => {
    const isConfirmed = status === BookingStatus.CONFIRMED || status === BookingStatus.COMPLETED;
    const extraBedTotal = (booking.extraBedCount || 0) * (booking.extraBedPrice || 0) * (booking.nights || 1);
    const baseValue = (booking.totalPrice || 0) - extraBedTotal;
    const assetId = booking.reference?.split('-')[2] || '7121';

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* ========== HEADER ========== */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Image
                            src="https://i.postimg.cc/hj4pmkmc/llsfr-walsyaht-(1).png"
                            style={{ width: 100, height: 50, objectFit: 'contain' }}
                        />
                    </View>
                    <View style={styles.headerRight}>
                        <View style={[styles.statusBadge, {
                            backgroundColor: isConfirmed ? COLORS.successBg : COLORS.pendingBg,
                            borderColor: isConfirmed ? COLORS.successBorder : COLORS.pendingBorder,
                        }]}>
                            <View style={[styles.statusDot, {
                                backgroundColor: isConfirmed ? '#dcfce7' : '#fef3c7',
                            }]}>
                                <Text style={{ fontSize: 7, color: isConfirmed ? COLORS.success : COLORS.pending }}>
                                    {isConfirmed ? '✓' : '○'}
                                </Text>
                            </View>
                            <Text style={[styles.statusText, {
                                color: isConfirmed ? '#064e3b' : '#92400e',
                            }]}>{status.toUpperCase()}</Text>
                        </View>
                        <View style={styles.refRow}>
                            <Text style={styles.refLabel}>REFERENCE:</Text>
                            <Text style={styles.refValue}>{booking.reference}</Text>
                        </View>
                    </View>
                    {/* Verified Badge */}
                    <View style={styles.verifiedBadgeContainer}>
                        <View style={styles.verifiedDot} />
                        <Text style={styles.verifiedText}>Verified Tourism Partner</Text>
                    </View>
                </View>

                {/* ========== WELCOME MESSAGE ========== */}
                <View style={styles.welcomeContainer}>
                    <Text style={styles.quoteIcon}>"</Text>
                    <Text style={styles.welcomeText}>
                        Dear Mr. <Text style={styles.welcomeBold}>{guest.firstName} {guest.lastName}</Text>, it is our pleasure to formally confirm your reservation at <Text style={styles.welcomeBold}>{booking.hotelName}</Text>. Your stay in a <Text style={styles.welcomeBold}>{booking.roomType}</Text> for <Text style={styles.welcomeBold}>{booking.nights} nights</Text> (from <Text style={styles.welcomeBold}>{booking.checkIn}</Text> to <Text style={styles.welcomeBold}>{booking.checkOut}</Text>) is officially <Text style={[styles.welcomeBold, { color: isConfirmed ? COLORS.success : COLORS.pending }]}>{status.toUpperCase()}</Text>. We look forward to welcoming you soon.
                    </Text>
                </View>

                {/* ========== INFO GRID ========== */}
                <View style={styles.infoGrid}>
                    {/* Guest Card */}
                    <View style={styles.guestCard}>
                        <View style={styles.guestMainCard}>
                            <Text style={styles.label}>Lead Passenger</Text>
                            <Text style={styles.guestName}>{guest.firstName} {guest.lastName}</Text>
                            <View style={styles.nationalityRow}>
                                <Text style={styles.nationalityIcon}>🌍</Text>
                                <Text style={styles.nationalityText}>{guest.nationality || 'Saudi Arabia'}</Text>
                            </View>
                        </View>
                        <View style={styles.contactInfo}>
                            <View style={styles.contactItem}>
                                <Text style={styles.contactLabel}>Contact Proxy</Text>
                                <Text style={styles.contactValue}>{guest.email}</Text>
                            </View>
                            <View style={styles.contactItem}>
                                <Text style={styles.contactLabel}>Phone Record</Text>
                                <Text style={styles.contactValue}>{guest.phone}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Dates Card */}
                    <View style={styles.datesCard}>
                        <View style={styles.datesRow}>
                            <View style={styles.dateBlock}>
                                <Text style={styles.dateLabel}>Check-In</Text>
                                <Text style={styles.dateValue}>{booking.checkIn}</Text>
                                <Text style={styles.dateTime}>{booking.checkInTime}</Text>
                            </View>
                            <View style={styles.dateDivider} />
                            <View style={styles.dateBlock}>
                                <Text style={styles.dateLabel}>Check-Out</Text>
                                <Text style={styles.dateValue}>{booking.checkOut}</Text>
                                <Text style={styles.dateTime}>{booking.checkOutTime}</Text>
                            </View>
                        </View>
                        <View style={styles.durationBar}>
                            <Text style={styles.durationLabel}>Total Stay Duration</Text>
                            <View style={styles.durationDot} />
                            <Text style={styles.durationValue}>{booking.nights} Nights</Text>
                        </View>
                    </View>
                </View>

                {/* ========== PROPERTY ASSET ========== */}
                <View style={styles.propertyCard}>
                    <View style={styles.sectionLabel}>
                        <View style={styles.sectionLabelDot} />
                        <Text style={styles.sectionLabelText}>Property Asset</Text>
                    </View>
                    <View style={styles.propertyHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.propertyName}>{booking.hotelName}</Text>
                            <View style={styles.propertyAddressRow}>
                                <Text style={styles.propertyAddressIcon}>📍</Text>
                                <Text style={styles.propertyAddress}>{booking.hotelAddress}</Text>
                            </View>
                        </View>
                        <View style={styles.assetIdBox}>
                            <Text style={styles.assetIdLabel}>Asset ID</Text>
                            <View style={styles.assetIdRow}>
                                <Text style={styles.assetIdHash}>#</Text>
                                <Text style={styles.assetIdValue}>{assetId}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* ========== ACCOMMODATION + FINANCIAL ========== */}
                <View style={styles.accommodationRow}>
                    {/* Accommodation */}
                    <View style={styles.accommodationCard}>
                        <View style={styles.sectionLabel}>
                            <View style={styles.sectionLabelDot} />
                            <Text style={styles.sectionLabelText}>Accommodation Tier</Text>
                        </View>
                        <Text style={styles.accommodationTitle}>{booking.roomType}</Text>
                        <View style={styles.specsGrid}>
                            <View style={styles.specItem}>
                                <View style={styles.specIconBox}>
                                    <Text style={styles.specIcon}>👥</Text>
                                </View>
                                <View style={styles.specContent}>
                                    <Text style={styles.specLabel}>Capacity</Text>
                                    <Text style={styles.specValue}>{booking.occupancy} Guests</Text>
                                </View>
                            </View>
                            <View style={styles.specItem}>
                                <View style={styles.specIconBox}>
                                    <Text style={styles.specIcon}>🛏</Text>
                                </View>
                                <View style={styles.specContent}>
                                    <Text style={styles.specLabel}>Bedding</Text>
                                    <Text style={styles.specValue}>{booking.bedding}</Text>
                                </View>
                            </View>
                            <View style={styles.specItem}>
                                <View style={styles.specIconBox}>
                                    <Text style={styles.specIcon}>🍽</Text>
                                </View>
                                <View style={styles.specContent}>
                                    <Text style={styles.specLabel}>Board</Text>
                                    <Text style={styles.specValue}>{booking.boardBasis}</Text>
                                </View>
                            </View>
                            <View style={styles.specItem}>
                                <View style={styles.specIconBox}>
                                    <Text style={styles.specIcon}>👁</Text>
                                </View>
                                <View style={styles.specContent}>
                                    <Text style={styles.specLabel}>View</Text>
                                    <Text style={styles.specValue}>{booking.view || 'Haram View'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Financial */}
                    <View style={styles.financialCard}>
                        <View style={styles.financialHeader}>
                            <Text style={styles.financialTitle}>Financial Ledger</Text>
                        </View>
                        <View style={styles.financialContent}>
                            <View style={styles.finRow}>
                                <Text style={styles.finLabel}>Base Value</Text>
                                <Text style={styles.finValue}>{booking.currency} {baseValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                            </View>
                            {(booking.extraBedCount || 0) > 0 && (
                                <View style={styles.finRow}>
                                    <Text style={styles.finLabel}>Extra Bed (x{booking.extraBedCount})</Text>
                                    <Text style={styles.finValue}>{booking.currency} {extraBedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.financialTotal}>
                            <Text style={styles.finTotalLabel}>Final Settlement</Text>
                            <View style={styles.finTotalRow}>
                                <Text style={styles.finTotalValue}>
                                    {(booking.totalPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </Text>
                                <Text style={styles.finTotalCurrency}>{booking.currency}</Text>
                            </View>
                            <Text style={styles.finTotalNote}>Includes Taxes & Fees</Text>
                        </View>
                    </View>
                </View>

                {/* ========== POLICIES ========== */}
                <View style={styles.policiesRow}>
                    <View style={styles.policyCard}>
                        <View style={styles.policyTitle}>
                            <View style={styles.policyTitleDot} />
                            <Text style={styles.policyTitleText}>Accommodation Policies</Text>
                        </View>
                        <View style={styles.policyItem}>
                            <View style={styles.policyItemDot} />
                            <View style={styles.policyItemContent}>
                                <Text style={styles.policyItemTitle}>System Release:</Text>
                                <Text style={styles.policyItemDesc}>Prior 48h notice required for any booking modifications.</Text>
                            </View>
                        </View>
                        <View style={styles.policyItem}>
                            <View style={styles.policyItemDot} />
                            <View style={styles.policyItemContent}>
                                <Text style={styles.policyItemTitle}>Family Policy:</Text>
                                <Text style={styles.policyItemDesc}>Children under 6 years stay complimentary with parents.</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.policyCard}>
                        <View style={styles.policyTitle}>
                            <View style={styles.policyTitleDot} />
                            <Text style={styles.policyTitleText}>Operation Standards</Text>
                        </View>
                        <View style={styles.policyItem}>
                            <View style={styles.policyItemDot} />
                            <View style={styles.policyItemContent}>
                                <Text style={styles.policyItemTitle}>Registration:</Text>
                                <Text style={styles.policyItemDesc}>Formal check-in begins at 16:00 Local Time.</Text>
                            </View>
                        </View>
                        <View style={styles.policyItem}>
                            <View style={styles.policyItemDot} />
                            <View style={styles.policyItemContent}>
                                <Text style={styles.policyItemTitle}>Departure:</Text>
                                <Text style={styles.policyItemDesc}>Check-out must be finalized by 12:00 PM.</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* ========== FOOTER ========== */}
                <View style={styles.footer}>
                    <View style={styles.footerCol}>
                        <View style={styles.footerIconBox}>
                            <Text style={styles.footerIconText}>QR</Text>
                        </View>
                        <View style={styles.footerContent}>
                            <Text style={styles.footerLabel}>Secured Registry</Text>
                            <Text style={styles.footerValue}>System Powered by Elattal Co.</Text>
                        </View>
                    </View>
                    <View style={styles.footerDivider} />
                    <View style={styles.footerCol}>
                        <Text style={{ fontSize: 12, marginRight: 6 }}>📞</Text>
                        <View style={styles.footerContent}>
                            <Text style={styles.footerLabel}>+966 2445 388 055</Text>
                            <Text style={styles.footerValue}>24/7 Support Line</Text>
                        </View>
                    </View>
                    <View style={styles.footerDivider} />
                    <View style={styles.footerCol}>
                        <Text style={{ fontSize: 12, marginRight: 6 }}>✉️</Text>
                        <View style={styles.footerContent}>
                            <Text style={styles.footerLabel}>Diyafaat.khulood@outlook.sa</Text>
                            <Text style={styles.footerValue}>Official Correspondence</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default VoucherPDF;
