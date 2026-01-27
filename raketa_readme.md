# 🚀 Rocket Build Plan: Kozep-Szarny Modular System

**Project Name:** Modular Fin Rocket
**Date:** 2023-10-27
**Status:** Ready for Print/Assembly

## 📋 Project Overview
This project consists of a modular rocket design featuring a main body ("Kozep") with detachable or separate fin assemblies ("Szarny") connected via a specific structural link.

### 🧩 Component Dictionary
*   **Middle:** (Hungarian: *Közép*) The main fuselage/body of the rocket including the nose cone.
*   **Wing:** (Hungarian: *Szárny*) The stabilizing fins.
*   **Connector:** (Hungarian:*Csatlakozó*) The interface piece that joins the fins to the body.

---

## 1. Bill of Materials (Files)

| Part Name | File Name | Quantity Needed | Description |
| :--- | :--- | :--- | :--- |
| **Main Body** | `kozep.stl` | 1 | The main orange fuselage with integrated mounting ports. |
| **Fin/Wing** | `szarny.stl` | *x* (Likely 3 or 4) | The aerodynamic fins (quantity depends on body mounts). |
| **Connector** | `connector.stl` | *x* (Same as fins) | The red hexagonal link piece. |

**Additional Hardware Required:**
*   [ ] CA Glue (Superglue) or Epoxy
*   [ ] Sandpaper (200-400 grit)
*   [ ] Rocket Motor (Size to fit internal diameter)
*   [ ] Recovery Wadding & Parachute

---

## 2. 🖨️ 3D Printing Instructions

### General Settings
*   **Material:** PLA+ or PETG (Recommended for impact resistance).
*   **Layer Height:** 0.2mm (Standard) or 0.16mm (High Quality).

### Specific Part Settings

#### A. The Body (Kozep)
*   **Orientation:** Print vertically (Nose cone pointing up).
*   **Infill:** 15-20% (Grid or Gyroid).
*   **Walls:** 3 perimeters (for structural integrity).
*   **Supports:** Required only under the protruding mounting lugs.

#### B. The Connector
*   **Orientation:** Lay flat on the print bed.
*   **Infill:** **100% (Solid)**. This part takes the most stress.
*   **Brim:** Recommended to prevent warping.

#### C. The Fins (Szarny)
*   **Orientation:** Lay flat for strongest layer adhesion.
*   **Infill:** 20-30%.
*   **Walls:** 3 perimeters.

---

## 3. 🛠️ Assembly Instructions

### Step 1: Preparation
1.  Remove all support material from the **Kozep** mounting lugs.
2.  Test fit the **Connector** into the square hole on the **Kozep**. It should be a tight friction fit. If it is too tight, sand the connector edges slightly.

### Step 2: Wing Assembly
1.  Apply a small amount of glue to one end of the **Connector**.
2.  Insert the **Connector** into the **Szarny** (Fin).
3.  *Wait 5 minutes for the glue to set.*

### Step 3: Final Integration
1.  Apply glue to the exposed end of the **Connector** (now attached to the fin).
2.  Insert the assembly into the mounting port on the **Kozep** (Main Body).
3.  Ensure the fin is perfectly straight (aligned with the rocket body).
4.  Repeat for all remaining fins.

---

## 4. ⚠️ Pre-Flight Safety Check
*   **Stability:** Ensure the fins are not loose. Wiggle them gently; there should be no movement.
*   **Surface:** Check that the mounting lugs do not create significant drag (sand smooth if necessary).
*   **CG/CP:** Ensure the Center of Gravity (CG) is ahead of the Center of Pressure (CP). Since the fins are added separately, verify the balance point after assembly.

---

> **Note:** This plan is generated based on visual inspection of the CAD files. Always perform a swing test before launching a 3D printed rocket.