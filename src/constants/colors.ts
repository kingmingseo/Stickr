const common = {
  PINK_200: '#FAE2E9',
  PINK_400: '#EC87A5',
  PINK_500: '#BF5C79',
  PINK_700: '#C63B64',
  RED_300: '#FFB4B4',
  RED_500: '#FF5F5F',
  BLUE_400: '#B4E0FF',
  BLUE_500: '#0D8AFF',
  GREEN_400: '#CCE6BA',
  YELLOW_400: '#FFE594',
  YELLOW_500: '#FACC15',
  PURPLE_400: '#6D5EF5',
  MAIN_DARK_TEXT : '#333D4B',
  SUB_DARK_TEXT : '#8E8E93',
};

const colors = {
  light: {
    GRAY_100: '#F8F8F8',
    GRAY_200: '#E7E7E7',
    GRAY_300: '#D8D8D8',
    GRAY_400: '#8E8E8E',
    GRAY_500: '#575757',
    GRAY_700: '#2B2B2B',
    BLACK: '#000',
    WHITE: '#FFF',
    ...common,
  },
  dark: {
    WHITE: '#161616',
    BLACK: '#FFF',
    GRAY_100: '#2B2B2B',
    GRAY_200: '#575757',
    GRAY_300: '#8E8E8E',
    GRAY_400: '#D8D8D8',
    GRAY_500: '#E7E7E7',
    GRAY_700: '#F8F8F8',
    ...common,

  },
};
// 앱 전역 그라데이션 팔레트 (좌→우)
const gradients = {
  purpleBlue: ['#7C3AED', '#60A5FA', '#1D4ED8'],
} as const;

export {colors, gradients};
