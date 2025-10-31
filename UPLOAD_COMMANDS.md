# 📋 Complete Upload Commands

Copy and paste these commands one by one:

---

## 1️⃣ Check Current Status

```powershell
# Check if git is initialized
Test-Path .git

# Check what files would be committed
git status --short | Select-Object -First 20
```

---

## 2️⃣ Initialize Git (If Needed)

```powershell
# Initialize git repository
git init

# Add remote repository
git remote add origin https://github.com/0xxyiy0/-Encrypted-Signal-Sharing-Pool.git

# Verify remote
git remote -v
```

---

## 3️⃣ Prepare README

```powershell
# Backup Chinese README (optional)
Copy-Item README.md README_CN.md -ErrorAction SilentlyContinue

# Replace with English version
Copy-Item README_EN.md README.md -Force
```

---

## 4️⃣ Verify Safety

```powershell
# Check for sensitive files (should return nothing)
git ls-files .env
git ls-files frontend/.env.local
git ls-files deployments/

# Or run the preparation script
.\prepare_for_github.bat
```

---

## 5️⃣ Stage All Files

```powershell
# Add all files (respecting .gitignore)
git add .

# Review what will be committed
git status
```

---

## 6️⃣ Create Initial Commit

```powershell
git commit -m "Initial commit: Encrypted Signal Sharing Pool

- Privacy-preserving trading signal aggregation using Zama FHEVM
- Dual contract architecture (Mock + FHE)
- React frontend with real-time dashboard
- Complete documentation and deployment guides
- Built for Zama Developer Program"
```

---

## 7️⃣ Push to GitHub

```powershell
# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

**When prompted:**
- Username: `0xxyiy0`
- Password: `[Your GitHub Personal Access Token]`

---

## 🔄 If You Need to Update

```powershell
# After making changes
git add .
git commit -m "Your commit message"
git push
```

---

## 🛠️ Troubleshooting

### If "remote origin already exists":
```powershell
git remote remove origin
git remote add origin https://github.com/0xxyiy0/-Encrypted-Signal-Sharing-Pool.git
```

### If "authentication failed":
- Make sure you're using a Personal Access Token, not your password
- Token must have `repo` scope

### If "refusing to merge unrelated histories":
```powershell
git pull origin main --allow-unrelated-histories
```

---

**All commands are ready to use! 🚀**

