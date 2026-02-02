// src/theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      primary: '#FFD700',
      accent: 'green',
      lightBg: '#F0F8FF',
      darkText: 'orange',
    },
  },
  fonts: {
    heading: "'Fredoka', system-ui, sans-serif",
    body: "'Poppins', sans-serif",
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'full',
        fontWeight: 'bold',
      },
    },
    Card: {
      baseStyle: {
        borderRadius: '2xl',
        boxShadow: 'md',
        overflow: 'hidden',
      },
    },
  },
});

export default theme;
