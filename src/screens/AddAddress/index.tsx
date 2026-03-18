// import React, { useState } from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     TextInput,
//     TouchableOpacity,
//     ActivityIndicator,
//     ScrollView
// } from "react-native";
// import { colors } from "../../theme/colors";
// import { createOrderApi, intentPaymentStripeApi } from "../../store/services/Services";
// import {useStripe} from '@stripe/stripe-react-native';
// import { BASEURL } from "../../constants";
// import { post } from "../../store/services/Http";

// const AddAddress = ({ navigation, route }) => {

//     const {initPaymentSheet, presentPaymentSheet, retrievePaymentIntent} = useStripe();

//     const { items, vendor_id } = route.params;

//     const [loading, setLoading] = useState(false);

//     const [form, setForm] = useState({
//         full_name: "",
//         phone: "",
//         email: "",
//         address_line1: "",
//         address_line2: "",
//         city: "",
//         state: "",
//         postal_code: "",
//         country: ""
//     });

//     const [errors, setErrors] = useState({});

//     const handleChange = (key, value) => {
//         setForm({ ...form, [key]: value });

//         if (errors[key]) {
//             setErrors({ ...errors, [key]: undefined });
//         }
//     };

//     const validate = () => {
//         let newErrors = {};

//         if (!form.full_name) newErrors.full_name = "Full name required";
//         if (!form.phone) newErrors.phone = "Phone required";
//         if (!form.email) newErrors.email = "Email required";
//         if (!form.address_line1) newErrors.address_line1 = "Address required";
//         if (!form.city) newErrors.city = "City required";
//         if (!form.state) newErrors.state = "State required";
//         if (!form.postal_code) newErrors.postal_code = "Postal code required";
//         if (!form.country) newErrors.country = "Country required";

//         setErrors(newErrors);

//         return Object.keys(newErrors).length === 0;
//     };

//     const fetchClientSecret = async (payload) => {
//         try {
      
//         // //   const response = await fetch(`${BASEURL}/user/stripe/payment-intent/create`, {
//         // //     method: "POST",
//         // //     headers: {
//         // //       "Content-Type": "application/json",
//         // //     },
//         // //     body: JSON.stringify(payload),
//         // //   });
//         // const response = (data: any) => post(`/user/stripe/payment-intent/create`, JSON.stringify(data));
      
//         //   const data = await response.json();
      
//         //   console.log("data", data)
//         //   return data.client_secret;

//         const data = await intentPaymentStripeApi(payload);
//         console.log("data", data)
//         return data.client_secret;
      
//         } catch (error) {
//           console.log(error, error.response);
//         }
//     };

//     const openStripePayment = async (clientSecret, payload) => {

//         const {error} = await initPaymentSheet({
//           paymentIntentClientSecret: clientSecret,
//           merchantDisplayName: "Your Company",
//         });
      
//         if (error) {
//           console.log(error);
//           return;
//         }
      
//         const {error: paymentError} = await presentPaymentSheet({
//           clientSecret: clientSecret,
//         });
      
//         if (paymentError) {
//           console.log(paymentError);
//         } else {
      
//           const {paymentIntent} = await retrievePaymentIntent(clientSecret);
      
//           if (paymentIntent) {
//             console.log("Payment Success", paymentIntent);
//           }
      
//         }
      
//     };

//     const handleCreateOrder = async () => {

//         if (!validate()) return;

//         try {
//             setLoading(true);

//             const payload = {
//                 vendor_id: vendor_id,
//                 estimated_delivery_date: "2026-02-15",
//                 address: form,
//                 items: items.map((i) => ({
//                     product_id: i.product_id,
//                     vendor_product_id: i.vendor_product_id,
//                     quantity: i.quantity,
//                     unit: i.unitSuffix.replace("/", ""),
//                     unit_price: i.unitPrice,
//                     price: i.unitPrice
//                 }))

//             };

//             console.log("payload", payload)
//             // const data = await createOrderApi(payload);
//             // console.log("data", data)
//             const clientSecret = await fetchClientSecret(payload);

//             if (clientSecret) {
//                 await openStripePayment(clientSecret, payload);
//             }

//             // navigation.navigate("OrderSuccess");
//             navigation.goBack();

//         } catch (err) {
//             console.log("Order Error", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (

//         <ScrollView contentContainerStyle={styles.container}>

//             <Text style={styles.title}>Add Address</Text>

//             {/* FULL NAME */}

//             <View style={styles.inputGroup}>
//                 <Text style={styles.label}>Full Name</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Enter full name"
//                     value={form.full_name}
//                     onChangeText={(t) => handleChange("full_name", t)}
//                 />
//                 {errors.full_name && <Text style={styles.error}>{errors.full_name}</Text>}
//             </View>

//             {/* PHONE */}

//             <View style={styles.inputGroup}>
//                 <Text style={styles.label}>Phone</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Phone number"
//                     keyboardType="phone-pad"
//                     value={form.phone}
//                     onChangeText={(t) => handleChange("phone", t)}
//                 />
//                 {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}
//             </View>

//             {/* EMAIL */}

//             <View style={styles.inputGroup}>
//                 <Text style={styles.label}>Email</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Email"
//                     keyboardType="email-address"
//                     value={form.email}
//                     onChangeText={(t) => handleChange("email", t)}
//                 />
//                 {errors.email && <Text style={styles.error}>{errors.email}</Text>}
//             </View>

//             {/* ADDRESS 1 */}

//             <View style={styles.inputGroup}>
//                 <Text style={styles.label}>Address Line 1</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Street address"
//                     value={form.address_line1}
//                     onChangeText={(t) => handleChange("address_line1", t)}
//                 />
//             </View>

//             {/* ADDRESS 2 */}

//             <View style={styles.inputGroup}>
//                 <Text style={styles.label}>Address Line 2</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Apartment / landmark"
//                     value={form.address_line2}
//                     onChangeText={(t) => handleChange("address_line2", t)}
//                 />
//             </View>

//             {/* CITY */}

//             <View style={styles.inputGroup}>
//                 <Text style={styles.label}>City</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="City"
//                     value={form.city}
//                     onChangeText={(t) => handleChange("city", t)}
//                 />
//             </View>

//             {/* STATE */}

//             <View style={styles.inputGroup}>
//                 <Text style={styles.label}>State</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="State"
//                     value={form.state}
//                     onChangeText={(t) => handleChange("state", t)}
//                 />
//             </View>

//             {/* POSTAL CODE */}

//             <View style={styles.inputGroup}>
//                 <Text style={styles.label}>Postal Code</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Postal code"
//                     keyboardType="number-pad"
//                     value={form.postal_code}
//                     onChangeText={(t) => handleChange("postal_code", t)}
//                 />
//             </View>

//             {/* COUNTRY */}

//             <View style={styles.inputGroup}>
//                 <Text style={styles.label}>Country</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Country"
//                     value={form.country}
//                     onChangeText={(t) => handleChange("country", t)}
//                 />
//             </View>

//             <TouchableOpacity
//                 style={[styles.button, loading && { opacity: 0.6 }]}
//                 onPress={handleCreateOrder}
//                 disabled={loading}
//             >

//                 {loading
//                     ? <ActivityIndicator color="#fff" />
//                     : <Text style={styles.buttonText}>Create Order</Text>
//                 }

//             </TouchableOpacity>

//         </ScrollView>

//     );
// };

// export default AddAddress;

// const styles = StyleSheet.create({

//     container: {
//         padding: 20
//     },

//     title: {
//         fontSize: 24,
//         fontWeight: "bold",
//         marginBottom: 20
//     },

//     inputGroup: {
//         marginBottom: 15
//     },

//     label: {
//         fontSize: 14,
//         marginBottom: 6,
//         fontWeight: "500"
//     },

//     input: {
//         borderWidth: 1,
//         borderColor: "#ddd",
//         borderRadius: 8,
//         padding: 12
//     },

//     error: {
//         color: "red",
//         fontSize: 12,
//         marginTop: 4
//     },

//     button: {
//         // backgroundColor: "#4CAF50",
//         // padding: 16,
//         // borderRadius: 8,
//         // alignItems: "center",
//         // marginTop: 20
//         backgroundColor: colors.primary.main,
//         borderRadius: 16,
//         paddingVertical: 16,
//         alignItems: 'center',
//         justifyContent: 'center',
//         shadowColor: colors.primary.main,
//         shadowOffset: { width: 0, height: 8 },
//         shadowOpacity: 0.25,
//         shadowRadius: 12,
//         elevation: 6,
//     },

//     buttonText: {
//         color: "#fff",
//         fontWeight: "bold"
//     }

// });

// ============================================================
// FILE 1: AddAddress.js
// ============================================================

// import React, { useState } from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     TextInput,
//     TouchableOpacity,
//     ActivityIndicator,
//     ScrollView
// } from "react-native";
// import { colors } from "../../theme/colors";
// import { intentPaymentStripeApi } from "../../store/services/Services";
// import { useStripe } from '@stripe/stripe-react-native';

// const AddAddress = ({ navigation, route }) => {

//     const { initPaymentSheet, presentPaymentSheet, retrievePaymentIntent } = useStripe();
//     const { items, vendor_id } = route.params;

//     const [loading, setLoading] = useState(false);
//     const [form, setForm] = useState({
//         full_name: "",
//         phone: "",
//         email: "",
//         address_line1: "",
//         address_line2: "",
//         city: "",
//         state: "",
//         postal_code: "",
//         country: ""
//     });
//     const [errors, setErrors] = useState({});

//     const handleChange = (key, value) => {
//         setForm({ ...form, [key]: value });
//         if (errors[key]) setErrors({ ...errors, [key]: undefined });
//     };

//     const validate = () => {
//         let newErrors = {};
//         if (!form.full_name)    newErrors.full_name    = "Full name required";
//         if (!form.phone)        newErrors.phone        = "Phone required";
//         if (!form.email)        newErrors.email        = "Email required";
//         if (!form.address_line1) newErrors.address_line1 = "Address required";
//         if (!form.city)         newErrors.city         = "City required";
//         if (!form.state)        newErrors.state        = "State required";
//         if (!form.postal_code)  newErrors.postal_code  = "Postal code required";
//         if (!form.country)      newErrors.country      = "Country required";
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const fetchClientSecret = async (payload) => {
//         try {
//             const data = await intentPaymentStripeApi(payload);
//             console.log("client secret data:", data);
//             return data.client_secret;
//         } catch (error) {
//             console.log("fetchClientSecret error:", error);
//         }
//     };

//     const openStripePayment = async (clientSecret) => {
//         // 1. Init payment sheet
//         const { error: initError } = await initPaymentSheet({
//             paymentIntentClientSecret: clientSecret,
//             merchantDisplayName: "Your Company",
//             // returnURL: "myapp://stripe-redirect",
//             // allowsDelayedPaymentMethods: true,
//         });

//         if (initError) {
//             console.log("initPaymentSheet error:", initError);
//             return null;
//         }

//         // 2. Present payment sheet to user
//         const { error: paymentError } = await presentPaymentSheet();

//         if (paymentError) {
//             console.log("presentPaymentSheet error:", paymentError);
//             return null;
//         }

//         // 3. Retrieve payment intent after success
//         const { paymentIntent } = await retrievePaymentIntent(clientSecret);
//         return paymentIntent ?? null;
//     };

//     const handleCreateOrder = async () => {
//         if (!validate()) return;

//         try {
//             setLoading(true);

//             const payload = {
//                 vendor_id: vendor_id,
//                 estimated_delivery_date: "2026-02-15",
//                 address: form,
//                 items: items.map((i) => ({
//                     product_id: i.product_id,
//                     vendor_product_id: i.vendor_product_id,
//                     quantity: i.quantity,
//                     unit: i.unitSuffix.replace("/", ""),
//                     unit_price: i.unitPrice,
//                     price: i.unitPrice
//                 }))
//             };

//             console.log("payload:", payload);

//             // Step 1: Get client secret
//             const clientSecret = await fetchClientSecret(payload);
//             if (!clientSecret) {
//                 console.log("No client secret received");
//                 return;
//             }

//             // Step 2: Open Stripe, get paymentIntent
//             const paymentIntent = await openStripePayment(clientSecret);
//             console.log("pay", paymentIntent)

//             if (paymentIntent && paymentIntent.status === "Succeeded") {
//                 // Step 3: Navigate to Thank You screen with paymentIntent data
//                 navigation.replace("OrderSuccess", { paymentIntent });
//             }

//         } catch (err) {
//             console.log("Order Error:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <ScrollView contentContainerStyle={styles.container}>

//             {/* Header */}
//             <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
//                 <Text style={styles.backArrow}>←</Text>
//             </TouchableOpacity>
//             <Text style={styles.title}>Add Address</Text>

//             {/* Section 1: Recipients Info */}
//             <View style={styles.sectionCard}>
//                 <View style={styles.sectionHeader}>
//                     <View style={styles.sectionBadge}><Text style={styles.sectionBadgeText}>1</Text></View>
//                     <Text style={styles.sectionTitle}>Recipients Information</Text>
//                     <Text style={styles.required}>*Required fields.</Text>
//                 </View>

//                 <Field label="Full Name *" placeholder="Name and Surname"
//                     value={form.full_name} onChangeText={(t) => handleChange("full_name", t)}
//                     error={errors.full_name} />

//                 <Field label="Phone *" placeholder="Phone Number"
//                     keyboardType="phone-pad"
//                     value={form.phone} onChangeText={(t) => handleChange("phone", t)}
//                     error={errors.phone} />

//                 <Field label="Email Address *" placeholder="E-mail"
//                     keyboardType="email-address"
//                     value={form.email} onChangeText={(t) => handleChange("email", t)}
//                     error={errors.email} />
//             </View>

//             {/* Section 2: Shipping Address */}
//             <View style={styles.sectionCard}>
//                 <View style={styles.sectionHeader}>
//                     <View style={styles.sectionBadge}><Text style={styles.sectionBadgeText}>2</Text></View>
//                     <Text style={styles.sectionTitle}>Shipping Address</Text>
//                     <Text style={styles.required}>*Required fields.</Text>
//                 </View>

//                 <Field label="Address Line 1 *" placeholder="Street address"
//                     value={form.address_line1} onChangeText={(t) => handleChange("address_line1", t)}
//                     error={errors.address_line1} />

//                 <Field label="Address Line 2 (Optional)" placeholder="Apartment / landmark"
//                     value={form.address_line2} onChangeText={(t) => handleChange("address_line2", t)} />

//                 <View style={styles.row}>
//                     <View style={{ flex: 1, marginRight: 8 }}>
//                         <Field label="City *" placeholder="City"
//                             value={form.city} onChangeText={(t) => handleChange("city", t)}
//                             error={errors.city} />
//                     </View>
//                     <View style={{ flex: 1 }}>
//                         <Field label="State *" placeholder="State"
//                             value={form.state} onChangeText={(t) => handleChange("state", t)}
//                             error={errors.state} />
//                     </View>
//                 </View>

//                 <View style={styles.row}>
//                     <View style={{ flex: 1, marginRight: 8 }}>
//                         <Field label="Postal Code *" placeholder="Postal code"
//                             keyboardType="number-pad"
//                             value={form.postal_code} onChangeText={(t) => handleChange("postal_code", t)}
//                             error={errors.postal_code} />
//                     </View>
//                     <View style={{ flex: 1 }}>
//                         <Field label="Country *" placeholder="Country"
//                             value={form.country} onChangeText={(t) => handleChange("country", t)}
//                             error={errors.country} />
//                     </View>
//                 </View>
//             </View>

//             {/* Buttons */}
//             <View style={styles.btnRow}>
//                 <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
//                     <Text style={styles.cancelText}>Cancel</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     style={[styles.saveBtn, loading && { opacity: 0.6 }]}
//                     onPress={handleCreateOrder}
//                     disabled={loading}>
//                     {loading
//                         ? <ActivityIndicator color="#fff" />
//                         : <Text style={styles.saveBtnText}>Save & Pay</Text>
//                     }
//                 </TouchableOpacity>
//             </View>

//         </ScrollView>
//     );
// };

// // ---- Reusable Field Component ----
// const Field = ({ label, error, ...props }) => (
//     <View style={styles.inputGroup}>
//         <Text style={styles.label}>{label}</Text>
//         <TextInput style={[styles.input, error && { borderColor: "red" }]} {...props} />
//         {error && <Text style={styles.error}>{error}</Text>}
//     </View>
// );

// export default AddAddress;

// const styles = StyleSheet.create({
//     container: { padding: 20, paddingBottom: 40 },

//     backRow: { marginBottom: 4 },
//     backArrow: { fontSize: 22, color: "#111" },

//     title: { fontSize: 22, fontWeight: "700", color: "#111", marginBottom: 20 },

//     sectionCard: {
//         backgroundColor: "#fff",
//         borderRadius: 14,
//         padding: 16,
//         marginBottom: 16,
//         shadowColor: "#000",
//         shadowOpacity: 0.06,
//         shadowOffset: { width: 0, height: 2 },
//         shadowRadius: 8,
//         elevation: 3,
//     },
//     sectionHeader: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginBottom: 16,
//         gap: 8,
//     },
//     sectionBadge: {
//         width: 26, height: 26,
//         borderRadius: 13,
//         borderWidth: 1.5,
//         borderColor: colors.primary.main,
//         alignItems: "center", justifyContent: "center",
//     },
//     sectionBadgeText: { fontSize: 13, fontWeight: "700", color: colors.primary.main },
//     sectionTitle: { fontSize: 15, fontWeight: "600", color: "#111", flex: 1 },
//     required: { fontSize: 11, color: "#aaa" },

//     inputGroup: { marginBottom: 14 },
//     label: { fontSize: 12, color: "#888", marginBottom: 5 },
//     input: {
//         borderWidth: 1,
//         borderColor: "#e0e0e0",
//         borderRadius: 10,
//         padding: 12,
//         fontSize: 14,
//         color: "#111",
//         backgroundColor: "#fafafa",
//     },
//     error: { color: "red", fontSize: 11, marginTop: 3 },

//     row: { flexDirection: "row" },

//     btnRow: { flexDirection: "row", gap: 12, marginTop: 8 },
//     cancelBtn: {
//         flex: 1,
//         borderWidth: 1.5,
//         borderColor: "#ddd",
//         borderRadius: 16,
//         paddingVertical: 16,
//         alignItems: "center",
//     },
//     cancelText: { fontSize: 15, fontWeight: "600", color: "#555" },

//     saveBtn: {
//         flex: 2,
//         backgroundColor: colors.primary.main,
//         borderRadius: 16,
//         paddingVertical: 16,
//         alignItems: "center",
//         justifyContent: "center",
//         shadowColor: colors.primary.main,
//         shadowOffset: { width: 0, height: 8 },
//         shadowOpacity: 0.25,
//         shadowRadius: 12,
//         elevation: 6,
//     },
//     saveBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
// });

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
} from "react-native";
import { colors } from "../../theme/colors";
import { intentPaymentStripeApi } from "../../store/services/Services";
import { useStripe } from "@stripe/stripe-react-native";

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
const AddAddress = ({ navigation, route }) => {
    const { initPaymentSheet, presentPaymentSheet, retrievePaymentIntent } = useStripe();
    const { items, vendor_id } = route.params;

    const [loading, setLoading]         = useState(false);
    const [stateSheet, setStateSheet]   = useState(false);

    const [form, setForm] = useState({
        full_name:    "",
        phone:        "",
        email:        "",
        address_line1:"",
        address_line2:"",
        city:         "",
        state:        "",
        postal_code:  "",
        country:      "United States",   // default locked
    });

    const [errors, setErrors] = useState({});

    // ── Refs for next-field focus ──
    const refs = {
        full_name:     useRef(null),
        phone:         useRef(null),
        email:         useRef(null),
        address_line1: useRef(null),
        address_line2: useRef(null),
        city:          useRef(null),
        postal_code:   useRef(null),
    };

    const focusNext = (key) => refs[key]?.current?.focus();

    // ── Handlers ──
    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
    };

    const selectState = (state) => {
        handleChange("state", state);
        setStateSheet(false);
    };

    const validate = () => {
        const newErrors = {};
        if (!form.full_name)     newErrors.full_name     = "Full name required";
        if (!form.phone)         newErrors.phone         = "Phone required";
        if (!form.email)         newErrors.email         = "Email required";
        if (!form.address_line1) newErrors.address_line1 = "Address required";
        if (!form.city)          newErrors.city          = "City required";
        if (!form.state)         newErrors.state         = "State required";
        if (!form.postal_code)   newErrors.postal_code   = "Postal code required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ── Stripe ──
    const fetchClientSecret = async (payload) => {
        try {
            const data = await intentPaymentStripeApi(payload);
            return data.client_secret;
        } catch (e) {
            console.log("fetchClientSecret error:", e);
        }
    };

    const openStripePayment = async (clientSecret) => {
        const { error: initError } = await initPaymentSheet({
            paymentIntentClientSecret: clientSecret,
            merchantDisplayName: "Your Company",
            // returnURL: "myapp://stripe-redirect",
            // allowsDelayedPaymentMethods: true,
        });
        if (initError) { console.log(initError); return null; }

        const { error: paymentError } = await presentPaymentSheet();
        if (paymentError) { console.log(paymentError); return null; }

        const { paymentIntent } = await retrievePaymentIntent(clientSecret);
        return paymentIntent ?? null;
    };

    const handleCreateOrder = async () => {
        if (!validate()) return;
        try {
            setLoading(true);
            const payload = {
                vendor_id,
                estimated_delivery_date: "2026-02-15",
                address: form,
                items: items.map(i => ({
                    product_id:        i.product_id,
                    vendor_product_id: i.vendor_product_id,
                    quantity:          i.quantity,
                    unit:              i.unitSuffix.replace("/", ""),
                    unit_price:        i.unitPrice,
                    price:             i.unitPrice,
                })),
            };
            const clientSecret = await fetchClientSecret(payload);
            if (!clientSecret) return;

            const paymentIntent = await openStripePayment(clientSecret);
            console.log('payment', paymentIntent)
            if (paymentIntent?.status === "Succeeded") {
                navigation.replace("OrderSuccess", { paymentIntent });
            }
        } catch (err) {
            console.log("Order Error:", err);
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
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : -280}>

                {/* Header */}
                {/* <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Text style={styles.backArrow}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Add Address</Text>
                    <View style={{ width: 36 }} />
                </View> */}

                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}>

                    {/* ── Section 1: Recipients ── */}
                    <SectionCard number="1" title="Recipients Information">

                        <Field
                            ref={refs.full_name}
                            label="Full Name *"
                            placeholder="Name and Surname"
                            value={form.full_name}
                            onChangeText={t => handleChange("full_name", t)}
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
                            onChangeText={t => handleChange("phone", t)}
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
                            onChangeText={t => handleChange("email", t)}
                            error={errors.email}
                            returnKeyType="next"
                            onSubmitEditing={() => focusNext("address_line1")}
                        />

                    </SectionCard>

                    {/* ── Section 2: Shipping ── */}
                    <SectionCard number="2" title="Shipping Address">

                        <Field
                            ref={refs.address_line1}
                            label="Address Line 1 *"
                            placeholder="Street address"
                            value={form.address_line1}
                            onChangeText={t => handleChange("address_line1", t)}
                            error={errors.address_line1}
                            returnKeyType="next"
                            onSubmitEditing={() => focusNext("address_line2")}
                        />

                        <Field
                            ref={refs.address_line2}
                            label="Address Line 2 (Optional)"
                            placeholder="Apartment / landmark"
                            value={form.address_line2}
                            onChangeText={t => handleChange("address_line2", t)}
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
                                    onChangeText={t => handleChange("city", t)}
                                    error={errors.city}
                                    returnKeyType="next"
                                    onSubmitEditing={() => setStateSheet(true)}
                                />
                            </View>

                            {/* State — bottom sheet picker */}
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>State *</Text>
                                <TouchableOpacity
                                    style={[styles.selectBox, errors.state && { borderColor: "red" }]}
                                    onPress={() => setStateSheet(true)}
                                    activeOpacity={0.7}>
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
                                    onChangeText={t => handleChange("postal_code", t)}
                                    error={errors.postal_code}
                                    returnKeyType="done"
                                    onSubmitEditing={() => Keyboard.dismiss()}
                                />
                            </View>

                            {/* Country — locked to USA */}
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Country</Text>
                                <View style={[styles.selectBox, styles.lockedBox]}>
                                    <Text style={styles.selectValue}>🇺🇸 United States</Text>
                                </View>
                            </View>
                        </View>

                    </SectionCard>

                    {/* ── Buttons ── */}
                    <View style={styles.btnRow}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.saveBtn, loading && { opacity: 0.6 }]}
                            onPress={handleCreateOrder}
                            disabled={loading}>
                            {loading
                                ? <ActivityIndicator color="#fff" />
                                : <Text style={styles.saveBtnText}>Save & Pay</Text>
                            }
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* ── State Bottom Sheet ── */}
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
const SectionCard = ({ number, title, children }) => (
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
const Field = React.forwardRef(({ label, error, ...props }, ref) => (
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
const StateSheet = ({ visible, onClose, onSelect, selected }) => (
    <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={onClose}>
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
                        onPress={() => onSelect(item)}>
                        <Text style={[styles.stateText, item === selected && styles.stateTextActive]}>
                            {item}
                        </Text>
                        {item === selected && <Text style={{ color: colors.primary.main }}>✓</Text>}
                    </TouchableOpacity>
                )}
            />
        </View>
    </Modal>
);

export default AddAddress;

// ─── Styles ───────────────────────────────────────────────────
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
    backBtn:     { padding: 4, width: 36 },
    backArrow:   { fontSize: 22, color: "#111" },
    headerTitle: { fontSize: 17, fontWeight: "600", color: "#111" },

    container: { padding: 16, paddingBottom: 40 },

    // Section
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

    // Select Box
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
    lockedBox:          { backgroundColor: "#f0f0f0" },
    selectValue:        { fontSize: 14, color: "#111" },
    selectPlaceholder:  { fontSize: 14, color: "#bbb" },
    chevron:            { fontSize: 16, color: "#888" },

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

    // Bottom Sheet
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
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
    sheetTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#111",
        marginBottom: 12,
    },
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