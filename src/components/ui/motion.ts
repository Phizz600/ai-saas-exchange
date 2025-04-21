
// This is a simplified motion component to replace framer-motion imports
// It provides animation utility classes through CSS instead of framer-motion
// to avoid React context errors

export const motion = {
  div: 'div',
  section: 'section',
  article: 'article',
  button: 'button',
  a: 'a',
  p: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  span: 'span',
  img: 'img',
};

export const variants = {
  fadeIn: {
    className: 'animate-fade-in'
  },
  fadeInUp: {
    className: 'animate-fade-in-up'
  },
  fadeInDown: {
    className: 'animate-fade-in-down'
  },
  fadeInLeft: {
    className: 'animate-fade-in-left'
  },
  fadeInRight: {
    className: 'animate-fade-in-right'
  },
};
