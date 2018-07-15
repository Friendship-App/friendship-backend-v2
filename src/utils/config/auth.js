export default {
  secret: process.env.SECRET || 'really_secret_key',
  saltRounds: 10,
  options: {
    algorithms: ['HS256'],
    expiresIn: '24h',
  },
};
