# Theme Update - Color Mapping Guide

## New Modern Light Theme

### Color Palette

**Backgrounds:**
- `#F8FAFC` → `#E2E8F0` - Main gradient background (light gray-blue)
- `#FFFFFF` - Card/surface backgrounds
- `#1E293B` → `#0F172A` - Sidebar gradient (dark slate)

**Text Colors:**
- `#1E293B` - Primary text (dark slate)
- `#64748B` - Muted/secondary text (medium slate)
- `#FFFFFF` - Text on dark backgrounds

**Accent Colors:**
- `#3B82F6` / `#2563EB` - Primary blue (buttons, links, highlights)
- `#10B981` / `#059669` - Success green
- `#EF4444` / `#DC2626` - Danger/error red
- `#64748B` / `#475569` - Secondary gray

**Borders:**
- `#E2E8F0` - Light borders
- `#CBD5E1` - Medium borders
- `#94A3B8` - Darker borders

---

## Component Update Map

### Replace Dark Colors → Light Colors

| Old Dark Theme | New Light Theme | Usage |
|---|---|---|
| `bg-[#0D0D0D]` | `bg-gradient-to-br from-slate-50 to-slate-100` | Main background |
| `bg-[#222222]` | `bg-white` | Cards, surfaces |
| `bg-[#2E2E2E]` | `bg-slate-100` | Hover states |
| `bg-[#1E1E1E]` | `bg-slate-50` | Input backgrounds |
| `text-[#F5F5F5]` | `text-slate-900` | Primary text |
| `text-[#D1D5DB]` | `text-slate-600` | Secondary text |
| `text-[#6B7280]` | `text-slate-500` | Muted text |
| `border-[#2E2E2E]` | `border-slate-200` | Borders |
| `border-[#3E3E3E]` | `border-slate-300` | Darker borders |
| `bg-[#1D4ED8]` | `bg-blue-600` or `bg-gradient-to-r from-blue-600 to-blue-500` | Primary buttons |
| `hover:bg-[#3B82F6]` | `hover:bg-blue-700` | Button hovers |

### Sidebar Colors
- Background: Keep dark `bg-gradient-to-b from-slate-800 to-slate-900`
- Text: `text-slate-200`
- Active item: `bg-blue-600`
- Hover: `hover:bg-slate-700`

### Navbar Colors
- Background: `bg-white border-b border-slate-200`
- Text: `text-slate-900`
- Icons: `text-slate-600`

---

## Files to Update

1. ✅ `client/src/index.css` - Base styles (DONE)
2. ⏳ `client/src/components/Sidebar.jsx`
3. ⏳ `client/src/components/TopNavbar.jsx`
4. ⏳ `client/src/components/Layout.jsx`
5. ⏳ `client/src/pages/Login.jsx`
6. ⏳ All dashboard pages
7. ⏳ All newly created pages

---

## Quick Find & Replace Patterns

```
bg-\[#222222\] → bg-white
bg-\[#2E2E2E\] → bg-slate-100
bg-\[#1E1E1E\] → bg-slate-50
text-\[#F5F5F5\] → text-slate-900
text-\[#D1D5DB\] → text-slate-600
text-\[#6B7280\] → text-slate-500
border-\[#2E2E2E\] → border-slate-200
border-\[#3E3E3E\] → border-slate-300
```
