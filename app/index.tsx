// Neshnabé Connect | Wolf Flow Solutions LLC 2026

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Colors, GlassCard, Spacing, BorderRadius } from '@/constants/theme';

export default function LoginScreen() {
  const [tribalId, setTribalId] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    checkExistingSession();
  }, []);

  async function checkExistingSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/(tabs)');
      }
    } catch (err) {
      console.error('Session check error:', err);
    } finally {
      setCheckingSession(false);
    }
  }

  async function handleSignIn() {
    if (!tribalId.trim() || !pin.trim()) {
      setError('Please enter your Tribal ID and PIN.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const email = `${tribalId.toLowerCase().trim()}@nhbp.member`;
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: pin,
      });

      if (signInError) {
        setError('Invalid Tribal ID or PIN. Please try again.');
      } else {
        router.replace('/(tabs)');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.amber} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>Neshnabe Connect</Text>
          <Text style={styles.companyName}>Wolf Flow Solutions LLC</Text>
          <Text style={styles.tribeName}>
            Nottawaseppi Huron Band of the Potawatomi
          </Text>
        </View>

        {/* Login Card */}
        <View style={styles.loginCard}>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.welcomeSubtitle}>
            Enter your Tribal ID and PIN to access your member account.
          </Text>

          {/* Tribal ID Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>TRIBAL ID</Text>
            <TextInput
              style={styles.input}
              value={tribalId}
              onChangeText={(text) => {
                setTribalId(text);
                setError('');
              }}
              placeholder="NHBP-2026-XXXX"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>

          {/* PIN Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PIN</Text>
            <TextInput
              style={styles.input}
              value={pin}
              onChangeText={(text) => {
                setPin(text);
                setError('');
              }}
              placeholder="Enter your PIN"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          {/* Error Message */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.signInButton, loading && styles.signInButtonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#1A1A1A" />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Help Text */}
          <Text style={styles.helpText}>
            {"Forgot your PIN? Contact Membership Services\n269.704.4000"}
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Neshnabe Connect | Wolf Flow Solutions LLC 2026
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  companyName: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.amber,
    marginTop: 4,
  },
  tribeName: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  loginCard: {
    ...GlassCard,
    padding: Spacing.lg,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  input: {
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  errorText: {
    color: Colors.error,
    fontSize: 13,
    marginBottom: Spacing.sm,
  },
  signInButton: {
    height: 48,
    backgroundColor: Colors.amber,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  signInButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  helpText: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: 18,
  },
  footer: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
