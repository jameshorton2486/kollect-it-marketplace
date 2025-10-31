#!/bin/bash
# scripts/verify-fixes.sh

set -euo pipefail

echo "🔍 Verifying critical fixes..."

# 1. Check TypeScript
echo -e "\n1️⃣ TypeScript check..."
npm run type-check

# 2. Check ESLint
echo -e "\n2️⃣ ESLint check..."
npm run lint

# 3. Test contrast script
echo -e "\n3️⃣ Contrast checker..."
npm run check:contrast

echo -e "\n✅ All checks complete!"