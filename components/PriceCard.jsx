import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { formatNumberWithDots } from '../utils/utils';
import { useRouter } from 'expo-router';
import Colors from '../constants/colors';
import { commonStyles } from '../styles/commonStyles';
import Label from './Label';
import { categoryColors } from '../constants/constants';

const PriceCard = ({ item, onLongPress, selected }) => {
    const router = useRouter();
    const [expanded, setExpanded] = useState(false);

    const handlePress = () => {
        setExpanded(!expanded);
    };

    const subElements = Array.isArray(item.sub_elementos)
        ? item.sub_elementos
        : JSON.parse(item.sub_elementos || '[]');

    const categoryColor = categoryColors[item.categoria?.toLowerCase()] || Colors.offWhite;

    return (
        <Pressable onPress={handlePress} onLongPress={() => onLongPress?.(item)}>
            <View style={[
                styles.card,
                { backgroundColor: categoryColor },
                selected && styles.cardSelected
            ]}>
                <Text style={styles.name}>{item.nombre}</Text>

                <View style={commonStyles.rowBetweenClose}>
                    <Text style={styles.description}>Categoría:</Text>
                    <Text style={[styles.description, { fontWeight: 'bold', fontStyle: 'italic' }]}>
                        {item.categoria}
                    </Text>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Label backgroundColor={Colors.lightGreen} textColor="white">
                        Gs. {formatNumberWithDots(item.precio)}
                    </Label>
                </View>

                {expanded && (
                    <View style={{ marginTop: 10 }}>
                        {item.descripcion !== '' && (
                            <>
                                <Text style={styles.subtitle}>Descripción:</Text>
                                <Text style={styles.subElement}>{item.descripcion}</Text>
                            </>
                        )}

                        {subElements.length > 0 && (
                            <>
                                <Text style={styles.subtitle}>Sub elementos:</Text>
                                <View style={styles.subElementsContainer}>
                                    {subElements.map((el, index) => (
                                        <View key={index} style={styles.label}>
                                            <Text style={styles.labelText}>{el}</Text>
                                        </View>
                                    ))}
                                </View>
                            </>
                        )}
                    </View>
                )}
            </View>
        </Pressable>
    );
};

export default PriceCard;


const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.offWhite,
        padding: 16,
        marginBottom: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
    },
    cardSelected: {
        backgroundColor: '#ffe6e6', // light red background
        borderColor: 'red',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    description: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },

    subElementsContainer: {
        paddingLeft: 8,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    subElement: {
        fontSize: 13,
        color: '#555',
        marginBottom: 2,
    },
    noData: {
        fontStyle: 'italic',
        color: '#999',
        padding: 10,
        textAlign: 'center',
    },

    label: {
        backgroundColor: Colors.lightBlue,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginRight: 6,
        marginBottom: 6,
        alignSelf: 'flex-start',
    },
    labelText: {
        fontSize: 13,
        color: '#0c5460',
    },
});
