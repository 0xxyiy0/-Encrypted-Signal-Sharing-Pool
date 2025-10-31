#!/bin/bash

# 🚀 GitHub Upload Preparation Script
# This script helps prepare the project for GitHub upload

echo "🔍 Checking repository status..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "⚠️  Git repository not initialized. Run 'git init' first."
    exit 1
fi

# Check for sensitive files
echo ""
echo "🔒 Checking for sensitive files..."

SENSITIVE_FILES=(
    ".env"
    "frontend/.env.local"
    "deployments/"
    "scripts/test-wallet-info.json"
    "test-wallet-info.json"
)

FOUND_SENSITIVE=0
for file in "${SENSITIVE_FILES[@]}"; do
    if git ls-files --error-unmatch "$file" &>/dev/null; then
        echo "❌ FOUND: $file (should be in .gitignore)"
        FOUND_SENSITIVE=1
    fi
done

if [ $FOUND_SENSITIVE -eq 0 ]; then
    echo "✅ No sensitive files found in staging area"
else
    echo ""
    echo "⚠️  Please remove sensitive files before committing!"
    exit 1
fi

# Check .gitignore
echo ""
echo "📋 Checking .gitignore coverage..."
if git check-ignore -q .env frontend/.env.local deployments/; then
    echo "✅ Sensitive files are properly ignored"
else
    echo "⚠️  Some sensitive files may not be ignored. Check .gitignore"
fi

# Show what will be committed
echo ""
echo "📦 Files that will be committed:"
git status --short | head -20

echo ""
echo "✅ Ready for GitHub upload!"
echo ""
echo "Next steps:"
echo "  1. Review the files above"
echo "  2. git add ."
echo "  3. git commit -m 'Initial commit'"
echo "  4. git push -u origin main"

