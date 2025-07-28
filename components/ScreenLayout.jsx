import React from 'react';
import { View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Footer from './Footer';

const ScreenLayout = ({
    children,
    footer = true,
    style = {},
    contentContainerStyle = {},
    edges = ['bottom', 'left', 'right'],
}) => {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={[{ flex: 1, backgroundColor: '#fff' }, style]} edges={edges}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                <View style={[{ flex: 1 }, contentContainerStyle]}>
                    {children}
                </View>
            </KeyboardAvoidingView>
            {footer && (
                <View style={{ paddingBottom: insets.bottom, backgroundColor: '#fff' }}>
                    <Footer />
                </View>
            )}
        </SafeAreaView>
    );
};

export default ScreenLayout;