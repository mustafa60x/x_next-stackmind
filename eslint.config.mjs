import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",      // any tipini kullanmaya izin ver
      "@typescript-eslint/explicit-module-boundary-types": "off",  // export edilen fonksiyonlarda tip belirtmeyi zorunlu tutma
      "@typescript-eslint/no-unused-vars": ["warn", {  // kullanılmayan değişkenleri uyarı olarak göster
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
      }],
      "no-console": "warn",  // console.log kullanımını uyarı olarak göster
      "prefer-const": "warn",  // let yerine const kullanılabilecek yerleri uyarı olarak göster
    },
  },
];

export default eslintConfig;
