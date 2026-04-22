import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Modal,
    FlatList,
    SafeAreaView,
    Keyboard,
    Alert,
} from "react-native";
import { colors } from "../../theme/colors";
import {
    intentPaymentStripeApi,
    addAddressApi,
} from "../../store/services/Services";
import { useStripe } from "@stripe/stripe-react-native";

// ─── US States ────────────────────────────────────────────────
const US_STATES = [
    "Alabama","Alaska","Arizona","Arkansas","California","Colorado",
    "Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho",
    "Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana",
    "Maine","Maryland","Massachusetts","Michigan","Minnesota",
    "Mississippi","Missouri","Montana","Nebraska","Nevada",
    "New Hampshire","New Jersey","New Mexico","New York",
    "North Carolina","North Dakota","Ohio","Oklahoma","Oregon",
    "Pennsylvania","Rhode Island","South Carolina","South Dakota",
    "Tennessee","Texas","Utah","Vermont","Virginia","Washington",
    "West Virginia","Wisconsin","Wyoming",
];

// ─── Main Component ───────────────────────────────────────────
const AddAddress = ({ navigation, route }) => {
    const { initPaymentSheet, presentPaymentSheet, retrievePaymentIntent } = useStripe();
    const { items, vendor_id, cart_id, selectedAddress } = route.params ?? {};

    // If address was selected from AddressListScreen, use it
    const hasSelectedAddress = !!selectedAddress;

    const [loading, setLoading]       = useState(false);
    const [stateSheet, setStateSheet] = useState(false);

    // ── Form state ──
    // Pre-fill if address was selected from cart screen
    const [form, setForm] = useState({
        full_address:  selectedAddress?.full_address  ?? "",
        address_line1: selectedAddress?.full_address  ?? "",   // map full_address → line1
        address_line2: selectedAddress?.floor         ?? "",
        city:          selectedAddress?.city          ?? "",
        state:         selectedAddress?.state         ?? "",
        postal_code:   selectedAddress?.postal_code   ?? "",
        country:       selectedAddress?.country       ?? "United States",
        label:         selectedAddress?.label         ?? "",
        street:        selectedAddress?.street        ?? "",
        instructions:  selectedAddress?.instructions  ?? "",
        // recipient info (only needed when no address selected)
        full_name:     "",
        phone:         "",
        email:         "",
    });

    const [errors, setErrors] = useState<any>({});

    // ── Refs ──
    const refs: any = {
        full_name:     useRef(null),
        phone:         useRef(null),
        email:         useRef(null),
        address_line1: useRef(null),
        address_line2: useRef(null),
        city:          useRef(null),
        postal_code:   useRef(null),
    };

    const focusNext = (key: string) => refs[key]?.current?.focus();

    const handleChange = (key: string, value: any) => {
        setForm(prev => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors((prev: any) => ({ ...prev, [key]: undefined }));
    };

    const selectState = (state: string) => {
        handleChange("state", state);
        setStateSheet(false);
    };

    // ── Validation ──
    const validate = () => {
        const e: any = {};

        // Recipient info — always required
        if (!form.full_name.trim()) e.full_name = "Full name required";
        if (!form.phone.trim())     e.phone     = "Phone required";
        if (!form.email.trim())     e.email     = "Email required";

        // Shipping fields — only required when no address pre-selected
        if (!hasSelectedAddress) {
            if (!form.address_line1.trim()) e.address_line1 = "Address required";
            if (!form.city.trim())          e.city          = "City required";
            if (!form.state)                e.state         = "Select a state";
            if (!form.postal_code.trim())   e.postal_code   = "Postal code required";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // ── Stripe helpers ──
    const fetchClientSecret = async (payload: any) => {
        try {
            const data = await intentPaymentStripeApi(payload);
            return data?.client_secret;
        } catch (e) {
            console.log("fetchClientSecret error:", e);
        }
    };

    const openStripePayment = async (clientSecret: string) => {
        const { error: initError } = await initPaymentSheet({
            paymentIntentClientSecret: clientSecret,
            merchantDisplayName: "Your Company",
        });
        if (initError) { console.log(initError); return null; }

        const { error: paymentError } = await presentPaymentSheet();
        if (paymentError) { console.log(paymentError); return null; }

        const { paymentIntent } = await retrievePaymentIntent(clientSecret);
        return paymentIntent ?? null;
    };

    // ── Save address then pay (when no address selected) ──
    const handleSaveAndPay = async () => {
        if (!validate()) return;
        try {
            setLoading(true);

            // 1. Save address first
            const addressPayload = {
                full_address: form.address_line1.trim(),
                label:        form.label        || undefined,
                street:       form.street       || undefined,
                floor:        form.address_line2 || undefined,
                instructions: form.instructions  || undefined,
                city:         form.city.trim(),
                state:        form.state,
                postal_code:  form.postal_code.trim(),
                country:      form.country,
                is_default:   false,
            };

            const savedAddress = await addAddressApi(addressPayload);
            console.log("Saved address:", savedAddress);

            const address_id = savedAddress?.data?.id ?? savedAddress?.id ?? 1;

            // 2. Build order payload
            const orderPayload = {
                vendor_id,
                estimated_delivery_date: "2026-02-15",
                cart_id,
                address_id,
                address: {
                    full_name:     form.full_name,
                    phone:         form.phone,
                    email:         form.email,
                    address_line1: form.address_line1,
                    address_line2: form.address_line2,
                    city:          form.city,
                    state:         form.state,
                    postal_code:   form.postal_code,
                    country:       form.country,
                },
                items: items.map((i: any) => ({
                    product_id:        i.product_id,
                    vendor_product_id: i.vendor_product_id,
                    quantity:          i.quantity,
                    unit:              i.unitSuffix.replace("/", ""),
                    unit_price:        i.unitPrice,
                    price:             i.unitPrice,
                })),
            };

            // 3. Pay
            const clientSecret = await fetchClientSecret(orderPayload);
            if (!clientSecret) return;

            const paymentIntent = await openStripePayment(clientSecret);
            console.log("paymentIntent:", paymentIntent);

            if (paymentIntent?.status === "Succeeded") {
                navigation.replace("OrderSuccess", { paymentIntent });
            }
        } catch (err) {
            console.log("SaveAndPay Error:", err);
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ── Pay now (address already selected) ──
    const handlePayNow = async () => {
        if (!validate()) return;
        try {
            setLoading(true);

            const orderPayload = {
                vendor_id,
                estimated_delivery_date: "2026-02-15",
                cart_id,
                address_id: selectedAddress?.id,
                items: items.map((i: any) => ({
                    product_id:        i.product_id,
                    vendor_product_id: i.vendor_product_id,
                    quantity:          i.quantity,
                    unit:              i.unitSuffix.replace("/", ""),
                    unit_price:        i.unitPrice,
                    price:             i.unitPrice,
                })),
            };

            const clientSecret = await fetchClientSecret(orderPayload);
            if (!clientSecret) return;

            const paymentIntent = await openStripePayment(clientSecret);
            console.log("paymentIntent:", paymentIntent);

            if (paymentIntent?.status === "Succeeded") {
                navigation.replace("OrderSuccess", { paymentIntent });
            }
        } catch (err) {
            console.log("PayNow Error:", err);
            Alert.alert("Error", "Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ─── Render ───────────────────────────────────────────────
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : -280}
            >
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >

                    {/* ── Section 1: Recipients — ALWAYS shown ── */}
                    <SectionCard number="1" title="Recipients Information">
                        <Field
                            ref={refs.full_name}
                            label="Full Name *"
                            placeholder="Name and Surname"
                            value={form.full_name}
                            onChangeText={(t: string) => handleChange("full_name", t)}
                            error={errors.full_name}
                            returnKeyType="next"
                            onSubmitEditing={() => focusNext("phone")}
                        />
                        <Field
                            ref={refs.phone}
                            label="Phone *"
                            placeholder="Phone Number"
                            keyboardType="phone-pad"
                            value={form.phone}
                            onChangeText={(t: string) => handleChange("phone", t)}
                            error={errors.phone}
                            returnKeyType="next"
                            onSubmitEditing={() => focusNext("email")}
                        />
                        <Field
                            ref={refs.email}
                            label="Email Address *"
                            placeholder="E-mail"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={form.email}
                            onChangeText={(t: string) => handleChange("email", t)}
                            error={errors.email}
                            returnKeyType="next"
                            onSubmitEditing={() =>
                                hasSelectedAddress ? Keyboard.dismiss() : focusNext("address_line1")
                            }
                        />
                    </SectionCard>

                    {/* ── Section 2: Address ── */}
                    {hasSelectedAddress ? (
                        // Address selected → show read-only box + change link
                        <SectionCard number="2" title="Delivery Address">
                            <View style={styles.selectedAddressBox}>
                                {!!form.label && (
                                    <Text style={styles.selectedLabel}>{form.label}</Text>
                                )}
                                <Text style={styles.selectedAddress}>
                                    {selectedAddress.full_address ?? selectedAddress.address ?? ""}
                                </Text>
                                {!!form.city && (
                                    <Text style={styles.selectedMeta}>
                                        {[form.city, form.state, form.postal_code].filter(Boolean).join(", ")}
                                    </Text>
                                )}
                            </View>
                            <TouchableOpacity
                                style={styles.changeAddressBtn}
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={styles.changeAddressText}>Change address</Text>
                            </TouchableOpacity>
                        </SectionCard>
                    ) : (
                        // No address → full shipping form
                        <SectionCard number="2" title="Shipping Address">
                            <Field
                                ref={refs.address_line1}
                                label="Address Line 1 *"
                                placeholder="Street address"
                                value={form.address_line1}
                                onChangeText={(t: string) => handleChange("address_line1", t)}
                                error={errors.address_line1}
                                returnKeyType="next"
                                onSubmitEditing={() => focusNext("address_line2")}
                            />
                            <Field
                                ref={refs.address_line2}
                                label="Address Line 2 (Optional)"
                                placeholder="Apartment / landmark"
                                value={form.address_line2}
                                onChangeText={(t: string) => handleChange("address_line2", t)}
                                returnKeyType="next"
                                onSubmitEditing={() => focusNext("city")}
                            />

                            <View style={styles.row}>
                                <View style={{ flex: 1, marginRight: 8 }}>
                                    <Field
                                        ref={refs.city}
                                        label="City *"
                                        placeholder="City"
                                        value={form.city}
                                        onChangeText={(t: string) => handleChange("city", t)}
                                        error={errors.city}
                                        returnKeyType="next"
                                        onSubmitEditing={() => setStateSheet(true)}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>State *</Text>
                                    <TouchableOpacity
                                        style={[styles.selectBox, errors.state && { borderColor: "red" }]}
                                        onPress={() => setStateSheet(true)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={form.state ? styles.selectValue : styles.selectPlaceholder}>
                                            {form.state || "Select State"}
                                        </Text>
                                        <Text style={styles.chevron}>⌄</Text>
                                    </TouchableOpacity>
                                    {errors.state && <Text style={styles.error}>{errors.state}</Text>}
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={{ flex: 1, marginRight: 8 }}>
                                    <Field
                                        ref={refs.postal_code}
                                        label="Postal Code *"
                                        placeholder="Postal code"
                                        keyboardType="number-pad"
                                        value={form.postal_code}
                                        onChangeText={(t: string) => handleChange("postal_code", t)}
                                        error={errors.postal_code}
                                        returnKeyType="done"
                                        onSubmitEditing={() => Keyboard.dismiss()}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Country</Text>
                                    <View style={[styles.selectBox, styles.lockedBox]}>
                                        <Text style={styles.selectValue}>🇺🇸 United States</Text>
                                    </View>
                                </View>
                            </View>
                        </SectionCard>
                    )}

                    {/* ── Buttons ── */}
                    <View style={styles.btnRow}>
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        {hasSelectedAddress ? (
                            // Address selected → Pay Now only
                            <TouchableOpacity
                                style={[styles.saveBtn, loading && { opacity: 0.6 }]}
                                onPress={handlePayNow}
                                disabled={loading}
                            >
                                {loading
                                    ? <ActivityIndicator color="#fff" />
                                    : <Text style={styles.saveBtnText}>Pay Now</Text>
                                }
                            </TouchableOpacity>
                        ) : (
                            // No address → Save address & Pay
                            <TouchableOpacity
                                style={[styles.saveBtn, loading && { opacity: 0.6 }]}
                                onPress={handleSaveAndPay}
                                disabled={loading}
                            >
                                {loading
                                    ? <ActivityIndicator color="#fff" />
                                    : <Text style={styles.saveBtnText}>Save & Pay</Text>
                                }
                            </TouchableOpacity>
                        )}
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* State Bottom Sheet */}
            <StateSheet
                visible={stateSheet}
                onClose={() => setStateSheet(false)}
                onSelect={selectState}
                selected={form.state}
            />
        </SafeAreaView>
    );
};

// ─── Section Card ─────────────────────────────────────────────
const SectionCard = ({ number, title, children }: any) => (
    <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
            <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>{number}</Text>
            </View>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.required}>*Required fields.</Text>
        </View>
        {children}
    </View>
);

// ─── Field ────────────────────────────────────────────────────
const Field = React.forwardRef(({ label, error, ...props }: any, ref: any) => (
    <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            ref={ref}
            style={[styles.input, error && { borderColor: "red" }]}
            placeholderTextColor="#bbb"
            blurOnSubmit={false}
            {...props}
        />
        {error && <Text style={styles.error}>{error}</Text>}
    </View>
));

// ─── State Bottom Sheet ───────────────────────────────────────
const StateSheet = ({ visible, onClose, onSelect, selected }: any) => (
    <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={onClose}
    >
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Select State</Text>
            <FlatList
                data={US_STATES}
                keyExtractor={item => item}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.stateItem, item === selected && styles.stateItemActive]}
                        onPress={() => onSelect(item)}
                    >
                        <Text style={[styles.stateText, item === selected && styles.stateTextActive]}>
                            {item}
                        </Text>
                        {item === selected && (
                            <Text style={{ color: colors.primary.main }}>✓</Text>
                        )}
                    </TouchableOpacity>
                )}
            />
        </View>
    </Modal>
);

export default AddAddress;

// ─── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { padding: 16, paddingBottom: 40 },

    // Section card
    sectionCard: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        gap: 8,
    },
    sectionBadge: {
        width: 26, height: 26,
        borderRadius: 13,
        borderWidth: 1.5,
        borderColor: colors.primary.main,
        alignItems: "center",
        justifyContent: "center",
    },
    sectionBadgeText: { fontSize: 13, fontWeight: "700", color: colors.primary.main },
    sectionTitle:     { fontSize: 15, fontWeight: "600", color: "#111", flex: 1 },
    required:         { fontSize: 11, color: "#aaa" },

    // Selected address display box
    selectedAddressBox: {
        backgroundColor: "#F9F9F9",
        borderRadius: 10,
        padding: 14,
        borderWidth: 1,
        borderColor: "#e8e8e8",
        marginBottom: 10,
    },
    selectedLabel: {
        fontSize: 13,
        fontWeight: "700",
        color: "#111",
        marginBottom: 4,
    },
    selectedAddress: {
        fontSize: 14,
        color: "#333",
        lineHeight: 20,
    },
    selectedMeta: {
        fontSize: 13,
        color: "#888",
        marginTop: 4,
    },
    changeAddressBtn: {
        alignSelf: "flex-start",
        paddingVertical: 4,
    },
    changeAddressText: {
        fontSize: 13,
        color: "#2979FF",
        fontWeight: "600",
    },

    // Fields
    inputGroup: { marginBottom: 12 },
    label:      { fontSize: 12, color: "#888", marginBottom: 5, fontWeight: "500" },
    input: {
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 10,
        padding: 12,
        fontSize: 14,
        color: "#111",
        backgroundColor: "#fafafa",
    },
    error: { color: "red", fontSize: 11, marginTop: 3 },

    // Select
    selectBox: {
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 10,
        padding: 12,
        backgroundColor: "#fafafa",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: 46,
    },
    lockedBox:         { backgroundColor: "#f0f0f0" },
    selectValue:       { fontSize: 14, color: "#111" },
    selectPlaceholder: { fontSize: 14, color: "#bbb" },
    chevron:           { fontSize: 16, color: "#888" },

    row: { flexDirection: "row" },

    // Buttons
    btnRow: { flexDirection: "row", gap: 12, marginTop: 8 },
    cancelBtn: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: "#ddd",
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: "center",
    },
    cancelText:  { fontSize: 15, fontWeight: "600", color: "#555" },
    saveBtn: {
        flex: 2,
        backgroundColor: colors.primary.main,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: colors.primary.main,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
    },
    saveBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },

    // Bottom sheet
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingBottom: 40,
        maxHeight: "65%",
    },
    sheetHandle: {
        width: 40, height: 4,
        backgroundColor: "#ddd",
        borderRadius: 2,
        alignSelf: "center",
        marginVertical: 12,
    },
    sheetTitle: { fontSize: 17, fontWeight: "700", color: "#111", marginBottom: 12 },
    stateItem: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#f5f5f5",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    stateItemActive: { backgroundColor: "#fdf5f0" },
    stateText:       { fontSize: 15, color: "#333" },
    stateTextActive: { color: colors.primary.main, fontWeight: "600" },
});