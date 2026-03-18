import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StyleSheet
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addFarmReviewApi } from '../../store/services/Services';
import { colors } from '../../theme/colors';

const WriteReviewScreen = () => {
    const route = useRoute();
    const { vendorId } = route.params;
    const navigation = useNavigation<any>();

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            return Alert.alert("Error", "Please select a rating.");
        }

        const payload = {
            vendor_id: vendorId,
            rating,
            review
        };

        try {
            setLoading(true);

            const resp = await addFarmReviewApi(payload);
            console.log("Review Response:", resp);

            // Alert.alert("Success", "Your review has been submitted!");
            navigation.goBack();
        } catch (err) {
            console.log("Review Error:", err);
            Alert.alert("Error", "Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Write a Review</Text>

            {/* Rating Stars */}
            <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map(num => (
                    <TouchableOpacity key={num} onPress={() => setRating(num)}>
                        <Text style={[
                            styles.star,
                            { color: rating >= num ? "#FFD700" : "#bbb" }
                        ]}>
                            ★
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Review Text Input */}
            <TextInput
                value={review}
                onChangeText={setReview}
                placeholder="Write your review..."
                style={styles.input}
                multiline
            />

            {/* Submit Button */}
            <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.submitText}>Submit Review</Text>
                )}
            </TouchableOpacity>

        </View>
    );
};

export default WriteReviewScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff"
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20
    },
    ratingRow: {
        flexDirection: "row",
        marginBottom: 15
    },
    star: {
        fontSize: 32,
        marginRight: 10
    },
    input: {
        height: 120,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        textAlignVertical: "top",
        marginBottom: 20
    },
    submitBtn: {
        backgroundColor: colors.primary.main,
        padding: 15,
        borderRadius: 10,
        alignItems: "center"
    },
    submitText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    }
});  