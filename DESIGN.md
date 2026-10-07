# Stoker — Design System

**Companion to:** `PRD.md`, `ARCHITECTURE.md`  
**Status:** v2.0 (FleetTrack Light Design Specification)  
**Applies to:** Stoker Boilers Console (web), Stoker Field (mobile), and Mobile Simulator  
**Implementation:** Tailwind CSS v4 tokens, CSS variables in `globals.css`  

---

## 1. Design Direction: Modern Fleet & Asset Management

The interface borrows from high-end fleet and equipment management dashboards (FleetTrack style):
- **Ultra-clean light canvas:** Crisp white cards (`#FFFFFF`) on subtle light gray (`#F3F4F7`).
- **Industrial Orange Signature Accent:** Energetic flame orange (`#FF6600` / `#F97316`) used for key callouts, selected equipment borders, and primary actions.
- **Charcoal Pill Navigation:** Premium dark pill containers (`#181B20`) with clean contrast.
- **4-Column Equipment Grid:** Clean 4x2 responsive equipment card arrangement with status pill badges.
- **Product Machinery Imagery:** Clean, isolated industrial boiler equipment renders displaying realistic mechanical detail.

---

## 2. Color Palette & Tokens

### Core Color Palette

| Token | Hex | Role |
| :--- | :--- | :--- |
| `--bg` | `#F3F4F7` | Clean light gray background |
| `--surface` | `#FFFFFF` | Card containers, panels, modals |
| `--surface-sunk` | `#EBEDF2` | Search inputs, wells, table insets |
| `--line` | `#E5E7EB` | Subtle card borders, dividers |
| `--line-strong` | `#D1D5DB` | Emphasized control borders |
| `--ink` | `#111827` | Primary dark typography |
| `--ink-2` | `#4B5563` | Secondary text, descriptions |
| `--ink-3` | `#9CA3AF` | Meta text, timestamps, placeholders |
| `--primary` | `#FF6600` | Signature brand orange, selected highlights |
| `--primary-hover` | `#E65C00` | Button hover state |
| `--ok` | `#10B981` | Operational status, positive trend badges |
| `--warn` | `#F59E0B` | In Maintenance status |
| `--danger` | `#EF4444` | Issue Detected status |
| `--info` | `#3B82F6` | Standby status, info pills |

---

## 3. UI Component Patterns

### 3.1 Fleet KPI Stat Cards
Compact rectangular cards at the top of the dashboard:
- Circular icon badge on the left.
- Numeric value and label on the right with a percentage trend badge (`↑ 3.5%`).

### 3.2 4-Column Boiler Equipment Cards
- **Card Header:** Boiler model name, serial code, and colored status pill (`Operational`, `In Maintenance`, `Standby`, `Issue Detected`).
- **Site Banner:** Location icon and client site name pill.
- **Center Image:** High-resolution industrial boiler render.
- **Worker Row:** Lead operator avatar, name, and "Last update: X min ago".
- **Timeline/Progress Bar:** Dual-colored progress bar with running cost (`$142/day`), steam capacity, and operating hours.
- **Selected Highlight:** Card is framed in an orange border (`border-[#FF6600] ring-2 ring-[#FF6600]/20`) when active or clicked.

### 3.3 Boiler Details Drawer / Modal
- Pops up upon clicking any boiler card.
- Displays full facility site address, status switcher, assigned staff with shift details, and today's running expenses with instant add forms.

### 3.4 Smartphone Field Simulator
- Embedded iPhone mockup (`max-w-[390px]`) running the mobile operator application.
- One-touch expense submission with instant sync to the head office console.
