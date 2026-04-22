import React, { useState, useRef, useCallback } from "react";
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
// import { put } from "../../services/api"; // adjust path as needed
import Geolocation from 'react-native-geolocation-service';
import { useFocusEffect } from "@react-navigation/native";
import { updateAddressApi } from "../../store/services/Services";
 
// ─── US States ───────────────────────────────────────────────
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
const EditAddressScreen = ({ navigation, route }: any) => {
    const { address, onDone } = route?.params ?? {};
 
    const [loading, setLoading]       = useState(false);
    const [stateSheet, setStateSheet] = useState(false);
 
    // Pre-fill form from passed address object
    const [form, setForm] = useState({
        full_address:  address?.full_address  ?? address?.address ?? "",
        label:         address?.label         ?? address?.title   ?? "",
        street:        address?.street        ?? "",
        floor:         address?.floor         ?? "",
        instructions:  address?.instructions  ?? "",
        city:          address?.city          ?? "",
        state:         address?.state         ?? "",
        postal_code:   address?.postal_code   ?? "",
        country:       address?.country       ?? "United States",
        is_default:    address?.is_default    ?? false,
    });

          const [latitude, setLatitude] = useState(null);
          const [longitude, setLongitude] = useState(null);
    
 
    // const [errors, setErrors] = useState<any>({});
    const [errors, setErrors] = useState({});

    // ── Field refs ──
    const refs: any = {
        full_address:  useRef(null),
        label:         useRef(null),
        street:        useRef(null),
        floor:         useRef(null),
        instructions:  useRef(null),
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
 
    const validate = () => {
        const e: any = {};
        if (!form.full_address.trim()) e.full_address = "Full address is required";
        if (!form.city.trim())         e.city         = "City is required";
        if (!form.state)               e.state        = "Please select a state";
        if (!form.postal_code.trim())  e.postal_code  = "Postal code is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

          // Function to get geolocation (latitude and longitude)
          const getLocation = () => {
            Geolocation.getCurrentPosition(
              (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                console.log('Latitude:', position.coords.latitude);
                console.log('Longitude:', position.coords.longitude);
              },
              (error) => {
                console.warn('Error getting location:', error);
              },
              { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
          };
        
          // Request permissions and get location
          const requestLocationPermission = async () => {
            if (Platform.OS === 'android') {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                  title: 'Location Permission',
                  message: 'App needs access to your location',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'OK',
                }
              );
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                getLocation(); // Fetch location after permission granted
              } else {
                console.log('Location permission denied');
              }
            } else {
              // getLocation(); // On iOS, permission is handled automatically
              // On iOS, handle permissions using requestWhenInUseAuthorization or requestAlwaysAuthorization
              Geolocation.requestAuthorization('whenInUse')
              .then(() => getLocation()) // Once permission is granted, get the location
              .catch((error) => console.log('Permission denied:', error));
            }
          };
        
          // useFocusEffect to trigger data load when screen is focused
          useFocusEffect(
            useCallback(() => {
              requestLocationPermission(); // Request location permission on screen focus
        
              // Optionally, clean up any side effects
              return () => {
                // clean up if necessary
              };
            }, [])
          );
        
    const handleUpdate = async () => {
        if (!validate()) return;
        try {
            setLoading(true);
            const payload = {
                full_address: form.full_address.trim(),
                label:        form.label        || undefined,
                street:       form.street       || undefined,
                floor:        form.floor        || undefined,
                instructions: form.instructions || undefined,
                city:         form.city.trim(),
                state:        form.state,
                postal_code:  form.postal_code.trim(),
                country:      form.country,
                is_default:   form.is_default,
                // lat/lng nahi bhej rahe — backend handle karta hai
            };
            console.log("Sending payload:", payload);        // check karo kya ja raha hai
            console.log("Address ID:", address.id);          // id check karo
            const response = await updateAddressApi(address.id, payload);
            console.log("response", response);
            onDone?.();
            navigation.goBack();
        } catch (err) {
            console.log("Edit address error:", err);
            Alert.alert("Error", "Could not update address. Please try again.");
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
                    {/* ── Section: Address Info ── */}
                    <SectionCard number="1" title="Address Information">
 
                        <Field
                            ref={refs.full_address}
                            label="Full Address *"
                            placeholder="e.g. 20 Cooper Square, New York"
                            value={form.full_address}
                            onChangeText={(t: string) => handleChange("full_address", t)}
                            error={errors.full_address}
                            returnKeyType="next"
                            onSubmitEditing={() => focusNext("label")}
                        />
 
                        <Field
                            ref={refs.label}
                            label="Label (Optional)"
                            placeholder="e.g. My Home, Office"
                            value={form.label}
                            onChangeText={(t: string) => handleChange("label", t)}
                            returnKeyType="next"
                            onSubmitEditing={() => focusNext("street")}
                        />
 
                        <Field
                            ref={refs.street}
                            label="Street (Optional)"
                            placeholder="Street name"
                            value={form.street}
                            onChangeText={(t: string) => handleChange("street", t)}
                            returnKeyType="next"
                            onSubmitEditing={() => focusNext("floor")}
                        />
 
                        <Field
                            ref={refs.floor}
                            label="Floor / Apartment (Optional)"
                            placeholder="Floor or apartment number"
                            value={form.floor}
                            onChangeText={(t: string) => handleChange("floor", t)}
                            returnKeyType="next"
                            onSubmitEditing={() => focusNext("instructions")}
                        />
 
                        <Field
                            ref={refs.instructions}
                            label="Delivery Instructions (Optional)"
                            placeholder="Any notes for delivery"
                            value={form.instructions}
                            onChangeText={(t: string) => handleChange("instructions", t)}
                            returnKeyType="next"
                            onSubmitEditing={() => focusNext("city")}
                            multiline
                        />
 
                        {/* City + State row */}
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
 
                        {/* Postal code + Country row */}
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
 
                        {/* Set as default */}
                        <TouchableOpacity
                            style={styles.defaultRow}
                            activeOpacity={0.7}
                            onPress={() => handleChange("is_default", !form.is_default)}
                        >
                            <View style={[styles.checkbox, form.is_default && styles.checkboxActive]}>
                                {form.is_default && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text style={styles.defaultLabel}>Set as default address</Text>
                        </TouchableOpacity>
 
                    </SectionCard>
 
                    {/* ── Buttons ── */}
                    <View style={styles.btnRow}>
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.saveBtn, loading && { opacity: 0.6 }]}
                            onPress={handleUpdate}
                            disabled={loading}
                        >
                            {loading
                                ? <ActivityIndicator color="#fff" />
                                : <Text style={styles.saveBtnText}>Update Address</Text>
                            }
                        </TouchableOpacity>
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
 
export default EditAddressScreen;
 
// ─── Styles — identical to AddAddressScreen ───────────────────
const styles = StyleSheet.create({
    container: { padding: 16, paddingBottom: 40 },
 
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
 
    defaultRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 4,
        marginBottom: 4,
    },
    checkbox: {
        width: 20, height: 20,
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: "#ddd",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fafafa",
    },
    checkboxActive: {
        backgroundColor: colors.primary.main,
        borderColor: colors.primary.main,
    },
    checkmark:    { color: "#fff", fontSize: 12, fontWeight: "700" },
    defaultLabel: { fontSize: 14, color: "#333", fontWeight: "500" },
 
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
 










