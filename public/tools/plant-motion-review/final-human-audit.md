# V31 Final PNG Human Audit — Round 3

**Result: PASS**  
**Reviewed PNG count: 3360 / 3360**  
**Scope:** 30 plants × 8 directions × (idle 8 frames + attack 6 frames).  
**Asset root:** `/Users/zeta/Code/garden-cats/assets/garden_route_motion_v8`

## Exact counts

| Level | Reviewed | Passed | Failed |
|---|---:|---:|---:|
| Final PNG frames | 3360 | 3360 | 0 |
| Clips | 480 | 480 | 0 |
| Directions | 240 | 240 | 0 |
| Plants | 30 | 30 | 0 |

The JSON companion contains exactly **3360 `frame_reviews`**, **480 `clip_reviews`**, **240 `direction_reviews`**, and **30 `plant_reviews`**. Every idle frame 0–7 and every attack frame 0–5 is represented separately. No asset was edited.

## Review method and decision rule

Every final PNG was rendered on a checkerboard in a per-plant 8-row × 14-column board: idle 0–7 followed by attack 0–5. Each frame was visually compared with the same direction's idle/0 identity reference, its adjacent animation frames, all other directions, and its mirror counterpart. The review covered visual size and mass, internal alpha/color erosion, missing/new/duplicated body parts, direction and face/mouth semantics, base anchoring, hard crop/canvas escape, detached low-alpha debris, body-carried payload rules, and attack timing/naturalness.

Any doubtful frame would fail the whole clip and direction. None remained doubtful in this pass.

As supporting checks, all 3360 files were measured at alpha thresholds 16, 64, and 128. No file touches the canvas edge at alpha≥64 and no file has more than one connected component at alpha≥64. All **1260** derived mirror-frame pairs are exact horizontal pixel mirrors after cropping to their transparent content envelope.

## Findings

- No visible internal transparency hole, half-transparent color erosion, missing organ, unexplained new organ, duplicated body part, or broken outline was found.
- No direction changes identity or violates the face/mouth visibility established by that exact direction's idle/0.
- Idle loops remain grounded and continuous through frames 6 and 7; neither frame was omitted from review.
- Attack clips preserve a single anticipation → release peak → recovery arc. Strong compression, extension, or silhouette rotation remains anatomically coherent rather than scaling the whole character.
- Chestnut, dew, and pollen legitimately release their already-attached payload at the peak. No unrelated projectile, water/fire/wind/electric/spore effect is baked into any body animation.
- Mirror products preserve anatomy and action semantics. Derived directions 3, 4, and 5 trace to authored directions 1, 0, and 7 respectively.
- Thirty-eight images have one isolated one-pixel component below alpha 64 inside the subject envelope. It disappears at alpha≥64 and is not visibly distinguishable as debris; each affected frame remains PASS. Exact frame IDs and measurements are in JSON.

## Per-plant result

| Plant | PNGs | Passed directions | Failed directions | Result |
|---|---:|---:|---:|---|
| `capacitor` | 112 | 8 | 0 | PASS |
| `chestnut` | 112 | 8 | 0 | PASS |
| `chili` | 112 | 8 | 0 | PASS |
| `dandelion` | 112 | 8 | 0 | PASS |
| `dew` | 112 | 8 | 0 | PASS |
| `echo` | 112 | 8 | 0 | PASS |
| `electric` | 112 | 8 | 0 | PASS |
| `frost` | 112 | 8 | 0 | PASS |
| `furnace` | 112 | 8 | 0 | PASS |
| `gourd` | 112 | 8 | 0 | PASS |
| `graft` | 112 | 8 | 0 | PASS |
| `leaf` | 112 | 8 | 0 | PASS |
| `lure` | 112 | 8 | 0 | PASS |
| `mender` | 112 | 8 | 0 | PASS |
| `mirror` | 112 | 8 | 0 | PASS |
| `pea` | 112 | 8 | 0 | PASS |
| `pine` | 112 | 8 | 0 | PASS |
| `pollen` | 112 | 8 | 0 | PASS |
| `pumpkin` | 112 | 8 | 0 | PASS |
| `relay` | 112 | 8 | 0 | PASS |
| `resin` | 112 | 8 | 0 | PASS |
| `rubber` | 112 | 8 | 0 | PASS |
| `splitter` | 112 | 8 | 0 | PASS |
| `spore` | 112 | 8 | 0 | PASS |
| `spring` | 112 | 8 | 0 | PASS |
| `sunflower` | 112 | 8 | 0 | PASS |
| `thorn` | 112 | 8 | 0 | PASS |
| `vacuum` | 112 | 8 | 0 | PASS |
| `vine` | 112 | 8 | 0 | PASS |
| `wind` | 112 | 8 | 0 | PASS |

## Regeneration list

None. There are no failed frames, clips, directions, or authored directions in this audit.

## Machine-readable record

See `final-v31-human-audit-r3.json`. It includes per-frame paths, idle/0 references, alpha/bbox metrics, authored-direction traceability, and the complete clip/direction/plant rollups.
