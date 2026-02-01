# Routing Plan Validation

## Target (from plan)

- **Tabs**: Four visible tabs — feed, stats, notifications, menu.
- **Secondary routes**: locations, taps, devices, beverages, flow-sensor, profile — reachable from any tab via shared routes; Back returns to originating tab.
- **Nux**: Under (tabs), hidden from tab bar; flow: location → wifi → device → tap → finish.

## Implemented Structure

### Root

- `_layout.tsx`: Stack with `(tabs)` and `(auth)`; auth guard controls which is shown.
- No root-level nux (nux lives under (tabs) per request).

### (tabs)

- **Tabs layout** lists only: `(feed)`, `(stats)`, `(notifications)`, `(menu)`, `nux` (nux with `href: null`).
- **Tab groups** (each with Stack + index):
  - `(feed)/` — feed home
  - `(stats)/` — stats home
  - `(notifications)/` — notifications home
  - `(menu)/` — menu home + settings, help, my-profile, payments, write-nfc, my-friends, profile/[id]
- **Shared secondary routes** in `(feed,stats,notifications,menu)/`:
  - locations, taps, devices, beverages, flow-sensor, profile (same files, one URL e.g. `/locations`).
- **Nux** at `(tabs)/nux/`: \_layout + location, wifi, device, tap, finish.

### Navigation

- From menu: use `/(tabs)/(menu)/locations` (etc.) so Back returns to menu.
- Nux: `/(tabs)/nux/location` or `/nux/location`; internal steps use `/nux/wifi`, `/nux/device`, etc.
- CustomTabBar uses `state.routes[0..3]` for the four tabs (unchanged).
- MainTabBar (if used) looks up routes by name `(feed)`, `(stats)`, `(notifications)`, `(menu)`.

## Validation Checklist

| Item                                                                                                                                 | Status  |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| Tabs layout lists (feed), (stats), (notifications), (menu), nux                                                                      | Done    |
| No duplicate flat routes (index, stats, menu, notifications, locations, taps, devices, beverages, flow-sensor, profile) under (tabs) | Removed |
| Shared group (feed,stats,notifications,menu) contains locations, taps, devices, beverages, flow-sensor, profile                      | Done    |
| Nux under (tabs), hidden from tab bar                                                                                                | Done    |
| MainTabBar route names updated to (feed), (stats), (notifications), (menu)                                                           | Done    |

## Known Issues (unrelated to routing)

- TypeScript: Module `"constants"` resolves to Node’s constants instead of app constants (path/alias).
- E2E test: `timeout` not in `TestDetails` type.

These do not affect the routing structure above.
