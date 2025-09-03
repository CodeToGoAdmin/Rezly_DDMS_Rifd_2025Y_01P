# Project Starter Repository

This is a simple starter repository with **development (dev)**, **testing (test)**, and **production (main)** branches.

- `dev_env` → development (feature branches merge here)
- `test_space` → staging/testing (promote from dev)
- `main` → production (protected; final deploys)

# Rezly_DDMS_Rifd_2025Y_01P
# Rezly DDMS — Rifd Project 2025

Rezly is a **Data Driven Management System (DDMS)** designed to simplify managment, decision-making, and scaling workflows for modern businesses.  
This repository provides the official source code, workflows, and automation for Rezly’s platform under the **Rifd 2025 initiative**.

---

## 🌐 Business Vision

Rezly’s mission is to provide organizations with:
- ✅ **Seamless appointment & booking management**  
- ✅ **Automation & smart reminders** to reduce no-shows  
- ✅ **Client management & subscriptions** with loyalty programs  
- ✅ **Data-driven forecasting & AI analysis** to grow revenue  
- ✅ **Transparent financial statistics & auditing** for decision-making  
- ✅ **Engaging messaging & evaluation systems** to improve customer satisfaction  

Outcome: Rezly enables businesses to **increase efficiency, maximize customer retention, and scale with confidence**.

---

## 📑 Core Functional Requirements

Rezly delivers the following modules:contentReference[oaicite:1]{index=1}:

1. **Booking & Appointment Scheduling**  
   - Manage services, prices, and schedules.  
   - Clients & staff can view, add, modify, or cancel bookings.  

2. **Subscription & Client Management**  
   - Manage subscriptions, staff roles, and client history.  
   - Track attendance and integrate training/nutrition plans.  

3. **Financial Statistics & Auditing**  
   - Automatic revenue logging, expense management, and reports.  
   - Exportable dashboards and audit logs.  

4. **Records & Archiving**  
   - Archive expired data, restore records, and maintain full change history.  

5. **Smart Appointment Reminders**  
   - Automated + manual reminders via email/SMS.  
   - Fully customizable templates.  

6. **Messaging System**  
   - Secure communication between staff and clients.  
   - Notifications and exportable chat history.  

7. **Customer Evaluation & Loyalty**  
   - Ratings, feedback, loyalty points, and reward system.  

8. **Forecasting System**  
   - Attendance prediction, revenue forecasting, and demand analysis.  

9. **Smart Waiting List**  
   - Automated waiting list promotions for overbooked sessions.  

10. **AI Analysis System**  
    - Detect client churn, high-value clients, fraud patterns, and campaign recommendations.  

---

## 🔄 Branch Workflow

- **`development`**  
  - Day-to-day work happens here  
  - PRs require **1 reviewer + Code Owner**  
  - CodeQL scan must pass with **no high severity issues**  

- **`testing`**  
  - Used for **QA & staging**  
  - Same rules as `development`  
  - Auto-deploys to staging environment  

- **`main` (production)**  
  - Final production-ready branch  
  - PRs require **2 reviewers**  
  - All conversations must be resolved  
  - CodeQL scan must pass with **no issues at all**  
  - Strictly protected: no force pushes, no deletions  

---

## 🔒 Branch Protections (Summary)

| Branch       | Reviews Required | Code Owner Review | CodeQL Alerts Allowed | Other Rules                        |
|--------------|-----------------|------------------|-----------------------|------------------------------------|
| development  | 1               | ✅ Required       | None ≥ High           | Signed commits, linear history     |
| testing      | 1               | ✅ Required       | None ≥ High           | Signed commits, linear history     |
| main         | 2               | ❌ Not required   | None (all must pass)  | Signed commits, linear history, resolve all threads |

---

## ⚙️ GitHub Actions (CI/CD)

- **CI (ci.yml)** → Runs on PRs into `development` & `testing`  
- **Staging Deploy (staging-deploy.yml)** → Auto-deploys `testing` → staging env  
- **Production Deploy (prod-deploy.yml)** → Auto-deploys `main` → production env  
- **Release (release.yml)** → Tags create a new GitHub Release  

---

## 👩‍💻 Team Workflow

1. **Feature Development**  
   - Branch off `development` → `feature/my-feature`  
   - Open PR → needs **1 reviewer + Code Owner**  

2. **Staging Testing**  
   - Merge into `testing` → deploys to staging env  
   - QA tests & validates  

3. **Production Release**  
   - Merge into `main` → requires **2 approvals + resolved threads**  
   - Deploys to production  

---

## 📌 Why These Rules?
Rezly is designed for teams that need:  
- **Security-first development** (signed commits, mandatory reviews)  
- **Traceable history** (no force pushes, linear commits)  
- **Quality gates** (CodeQL scans on all branches)  
- **Confidence in production** (extra reviews & stricter scanning on `main`)  

---

✅ With these protections, Rezly ensures code is **secure, reviewed, tested, and approved** before reaching production.
