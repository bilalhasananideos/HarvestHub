import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { colors } from "../../theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons'

const OrderSuccess = ({ navigation, route }) => {

    const { paymentIntent } = route.params;

    // Format amount: Stripe sends in cents → divide by 100
    const amountFormatted = paymentIntent?.amount
        ? `$${(paymentIntent.amount / 100).toFixed(2)}`
        : "N/A";

    const orderId = paymentIntent?.id ?? "N/A";
    const status = paymentIntent?.status ?? "succeeded";

    const placedAt = paymentIntent?.created
        ? new Date(paymentIntent.created * 1000).toLocaleString()
        : new Date().toLocaleString();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.header}>
                {/* <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: "Home" }] })} style={styles.backBtn}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity> */}
                <View style={{ width: 36 }} />
                <Text style={styles.headerTitle}>Order Success</Text>
                <View style={{ width: 36 }} />
            </View>
            <ScrollView contentContainerStyle={styles.container}>

                {/* Green Check */}
                <View style={styles.iconWrap}>
                    <View style={styles.checkCircle}>
                        <Text style={styles.checkMark}>✓</Text>
                    </View>
                </View>

                {/* Thank you text */}
                <Text style={styles.thankYou}>Thank you!</Text>
                <Text style={styles.subText}>Your order has been placed successfully.</Text>
                <Text style={styles.timeText}>Time placed: {placedAt}</Text>

                {/* Order Info Card */}
                <View style={styles.card}>
                    <Row label="Order ID" value={`#${orderId.slice(-8).toUpperCase()}`} />
                    <Divider />
                    <Row label="Amount" value={amountFormatted} />
                    <Divider />
                    <Row label="Status" value={status.charAt(0).toUpperCase() + status.slice(1)}
                        valueStyle={{ color: "#27ae60", fontWeight: "700" }} />
                    <Divider />
                    <Row label="Payment" value="Card" />
                </View>

                {/* Back to Home Button */}
                <TouchableOpacity
                    style={styles.homeBtn}
                    onPress={() => navigation.reset({ index: 0, routes: [{ name: "MybottomTabs" }] })}>
                    <Text style={styles.homeBtnText}>Back to home</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

// ---- Small helpers ----
const Row = ({ label, value, valueStyle }) => (
    <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={[styles.rowValue, valueStyle]}>{value}</Text>
    </View>
);

const Divider = () => <View style={styles.divider} />;

export default OrderSuccess;

const styles = StyleSheet.create({
    // Layout
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    backBtn: { padding: 4, width: 36 },
    backArrow: { fontSize: 22, color: "#111" },
    headerTitle: { fontSize: 17, fontWeight: "600", color: "#111" },

    container: {
        flexGrow: 1,
        padding: 24,
        alignItems: "center",
        backgroundColor: "#fff",
    },

    iconWrap: { marginTop: 40, marginBottom: 20 },
    checkCircle: {
        width: 80, height: 80,
        borderRadius: 40,
        backgroundColor: "#27ae60",
        alignItems: "center",
        justifyContent: "center",
    },
    checkMark: { color: "#fff", fontSize: 38, fontWeight: "700" },

    thankYou: {
        fontSize: 28,
        fontWeight: "800",
        color: "#111",
        marginBottom: 8,
    },
    subText: {
        fontSize: 15,
        color: "#555",
        textAlign: "center",
        marginBottom: 4,
    },
    timeText: {
        fontSize: 12,
        color: "#aaa",
        marginBottom: 32,
    },

    card: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 4,
        marginBottom: 32,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
    },
    rowLabel: { fontSize: 14, color: "#888" },
    rowValue: { fontSize: 14, fontWeight: "600", color: "#111" },
    divider: { height: 1, backgroundColor: "#f0f0f0" },

    homeBtn: {
        width: "100%",
        backgroundColor: colors.primary.main,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: "center",
        shadowColor: colors.primary.main,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
    },
    homeBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});