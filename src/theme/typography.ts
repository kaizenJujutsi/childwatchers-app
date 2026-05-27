import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const Typography = StyleSheet.create({
  display:   { fontSize: 40, fontWeight: '900', color: Colors.black, lineHeight: 48, letterSpacing: -1 },
  h1:        { fontSize: 28, fontWeight: '700', color: Colors.black, lineHeight: 34, letterSpacing: -0.5 },
  h2:        { fontSize: 22, fontWeight: '700', color: Colors.black, lineHeight: 28, letterSpacing: -0.3 },
  h3:        { fontSize: 18, fontWeight: '600', color: Colors.black, lineHeight: 24, letterSpacing: 0 },
  h4:        { fontSize: 16, fontWeight: '600', color: Colors.black, lineHeight: 22, letterSpacing: 0 },
  body:      { fontSize: 15, fontWeight: '400', color: Colors.grey800, lineHeight: 22, letterSpacing: 0 },
  bodySmall: { fontSize: 13, fontWeight: '400', color: Colors.grey600, lineHeight: 18, letterSpacing: 0 },
  caption:   { fontSize: 11, fontWeight: '400', color: Colors.grey400, lineHeight: 15, letterSpacing: 0 },
  label:     { fontSize: 12, fontWeight: '600', color: Colors.grey600, lineHeight: 16, letterSpacing: 0.5 },
  price:     { fontSize: 20, fontWeight: '700', color: Colors.primary, lineHeight: 26, letterSpacing: 0 },
  badge:     { fontSize: 11, fontWeight: '700', lineHeight: 14, letterSpacing: 0.3 },
  overline:  { fontSize: 10, fontWeight: '700', color: Colors.grey400, lineHeight: 14, letterSpacing: 1.5 },
});
