module.exports = {
  root: true,
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: true },
    ],
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // Vuex mutations
      ],
    }],
  },
};
