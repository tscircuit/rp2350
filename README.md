# rp2350

A complete, Pico 2-style **RP2350A** microcontroller module built with
[tscircuit](https://tscircuit.com): USB-C programming port, QSPI flash, 12 MHz
crystal, BOOTSEL/RUN buttons, status LEDs, and SWD test points.

It is a direct counterpart to the physically validated `Microcontroller_RP2040`
module in [`@tscircuit/common`](https://github.com/tscircuit/common) — same
30 x 70 mm board, same floorplan, same net names — with the RP2040-specific
power section swapped for the RP2350's on-chip buck converter.

> ⚠️ This board has **not** been fabricated or physically validated yet. The
> RP2040 module it is derived from has been. Review before ordering.

## Snapshots

| PCB | Schematic |
| --- | --- |
| ![pcb](./__snapshots__/index.circuit-pcb.snap.svg) | ![schematic](./__snapshots__/index.circuit-schematic.snap.svg) |

## Usage

```tsx
import { Microcontroller_RP2350 } from "@tsci/tscircuit.rp2350"

export default () => (
  <board width="30mm" height="70mm" autorouter="auto_local">
    <Microcontroller_RP2350
      name="MCU"
      connections={{ GPIO0: "net.USER_IO" }}
    />
  </board>
)
```

`Microcontroller_RP2350` is a pure `<subcircuit />` — it renders no `<board />`
of its own, so it can be placed inside a larger design with `pcbX` / `pcbY` /
`pcbRotation` and `schX` / `schY`. Any `connections` you pass are forwarded to
the RP2350A chip, so GPIOs can be wired by name.

### Rails

| Net | Source |
| --- | --- |
| `VBUS` | USB-C `VBUS` |
| `VSYS` | `VBUS` through the `B5819W` reverse-protection diode |
| `V3V3` | AP2112K-3.3 LDO from `VSYS` |
| `V1V1` | RP2350 on-chip buck converter (`VREG_LX` → `L_CORE` → `V1V1`) |
| `ADC_VREF` | `V3V3` through a 600 Ω @ 100 MHz ferrite bead |
| `GND` | ground |

## Differences from the RP2040 module

- **Core rail.** The RP2040 has a linear core regulator (`VREG_IN`/`VREG_VOUT`
  with a single 1 µF cap). The RP2350 has a switching buck converter, so this
  module adds `L_CORE` (3.3 µH), `C_VREG_IN`/`C_VREG_OUT` (4.7 µF), and an
  RC-filtered `VREG_AVDD` feed (33 Ω + 4.7 µF) taken from `V3V3`.
- **Extra supply pins.** The RP2350A has `DVDD3`, `QSPI_IOVDD`, and
  `USB_OTP_VDD` on top of the RP2040's supply pins. Each gets its own 100 nF
  decoupler placed next to its pin.
- **No USB series resistors.** The RP2040 module uses 27 Ω series resistors on
  `USB_DM`/`USB_DP`. The RP2350 USB PHY has on-chip series termination, so
  `USB_DM`/`USB_DP` run straight from the connector to the chip, matching the
  Raspberry Pi Pico 2 reference design.
- **SWD test points** moved from y = -31 mm to y = -19 mm so that every ground
  pad has a ground neighbour within the autorouter's crystal-net length limit.

## Development

```bash
bun install
```

```bash
bun run dev
```

```bash
bun test
```

Regenerate the PCB and schematic snapshots after any layout change:

```bash
bun run snapshot:update
```

Check them without writing (this is what CI runs):

```bash
bun run snapshot
```

The checked-in **PCB** snapshots are generated on **x86_64**. The autorouter is
deterministic for a given CPU architecture but not across architectures, so an
arm64 machine (Apple Silicon, `ubuntu-24.04-arm`) produces different trace
geometry from x86_64 — same pad placement and same via count, different routes.
Measured on one commit with identical Bun and lockfile:

| | `index.circuit-pcb` | `index.circuit-schematic` |
| --- | --- | --- |
| Linux x86_64 | `b1591158` | `8aa18d70` |
| Linux arm64 | `f6e41275` | `8aa18d70` |
| macOS arm64 | `f6e41275` | `8aa18d70` |

The operating system is not a factor — Linux arm64 and macOS arm64 agree
exactly. Schematic snapshots are identical everywhere.

So on Apple Silicon, `bun run snapshot:update` will produce a PCB diff that CI
rejects. Regenerate on x86_64, or take CI's output. Also run
`bun install --frozen-lockfile` first: CI pins its Bun version and installs
frozen, and a drifting dependency tree changes the router too.

## Bill of materials

Every part carries a JLCPCB part number via its import in
`lib/Microcontroller_RP2350/imports/`, so the module is assembly-ready:

| Ref | Part | Note |
| --- | --- | --- |
| U1 | RP2350A (C42411118) | QFN-60, 7 x 7 mm |
| U2 | W25Q16JVUXIQ | 16 Mbit QSPI flash |
| U3 | AP2112K-3.3TRG1 | 600 mA 3.3 V LDO |
| J_USB | TYPE-C-16PIN-2MD-073 | USB-C receptacle |
| Y1 | ABM8-272-T3 (C20625731) | 12 MHz crystal specified by the RP2350 design guide |
| L_CORE | AOTA-B201610S3R3-101-T (C42411119) | 3.3 µH 0806 buck inductor, polarity-marked |
| L_AVDD | 600 Ω @ 100 MHz 0603 | ADC supply ferrite |
| SW_BOOT / SW_RUN | SKRPACE010 | tactile buttons |
| D_VBUS | B5819W SL | Schottky |
| D1 / D_PWR | XL-1608SURC-06 | status LEDs |
