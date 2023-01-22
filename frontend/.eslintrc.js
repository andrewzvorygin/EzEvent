module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:promise/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "prettier",
    "plugin:jest/recommended",
    "plugin:jest/style",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2019,
    sourceType: "module",
  },
  plugins: [
    "prettier",
    "react",
    "react-hooks",
    "@typescript-eslint",
    "promise",
    "import",
    "jest",
  ],
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        moduleDirectory: ["node_modules", "src/"],
      },
    },
  },
  rules: {
    "import/order": [
      "warn",
      {
        groups: [
          "external",
          "internal",
          "unknown",
          "builtin",
          "parent",
          "sibling",
          "index",
        ],
        "newlines-between": "always",
      },
    ],
    "import/first": "warn",
    "import/default": "off",
    "import/no-named-as-default-member": "off",
    "prettier/prettier": "warn",
    "react/prop-types": "off",
    "react-hooks/rules-of-hooks": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/array-type": "warn",
    "@typescript-eslint/explicit-member-accessibility": [
      "warn",
      {
        overrides: {
          constructors: "off",
        },
      },
    ],
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/prefer-for-of": "warn",
    "@typescript-eslint/prefer-function-type": "warn",
    "@typescript-eslint/no-this-alias": "warn",
    "@typescript-eslint/no-empty-function": "warn",
    "no-trailing-spaces": "warn",
    "prefer-const": "warn",
    "comma-dangle": ["warn", "always-multiline"],
    curly: "warn",
    "dot-notation": "warn",
    "no-var": "warn",
    "prefer-object-spread": "warn",
    "prefer-template": "warn",
    "promise/catch-or-return": "warn",
    "promise/always-return": "off",
    "max-params": "warn",
    radix: "warn",
    yoda: "warn",
    "jest/no-alias-methods": "off",
    "jest/no-standalone-expect": [
      "error",
      {
        additionalTestBlockFunctions: ["afterEach"],
      },
    ],
  },
  overrides: [
    {
      files: ["*.js"],
      env: {
        node: true,
      },
      rules: {
        "import/order": "off",
        "@typescript-eslint/no-var-requires": "off",
      },
    },
    {
      files: ["*.test.tsx", "*.test.ts"],
      rules: {
        "import/first": "off",
      },
    },
  ],
};
