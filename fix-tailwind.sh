#!/bin/bash

echo "Installing Tailwind CSS..."

# Install Tailwind and dependencies
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind config
npx tailwindcss init -p

# Update tailwind.config.js
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

# Update src/index.css with Tailwind directives
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

echo ""
echo "Tailwind CSS installed!"
echo "Now restart your dev server:"
echo "1. Stop the current server (Ctrl+C)"
echo "2. Run: npm run dev"
echo "3. Refresh your browser"