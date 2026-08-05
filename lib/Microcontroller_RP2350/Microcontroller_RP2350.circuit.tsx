import type { ChipProps, SubcircuitProps } from "@tscircuit/props"
import { RP2350A } from "./imports/RP2350A"
import { TYPE_C_16PIN_2MD_073_ } from "./imports/TYPE_C_16PIN_2MD_073_"
import { W25Q16JVUXIQ } from "./imports/W25Q16JVUXIQ"
import { AP2112K_3_3TRG1 } from "./imports/AP2112K_3_3TRG1"
import { X322512MSB4SI } from "./imports/X322512MSB4SI"
import { SKRPACE010 } from "./imports/SKRPACE010"
import { B5819W_SL } from "./imports/B5819W_SL"
import { XL_1608SURC_06 } from "./imports/XL_1608SURC_06"

const denseTraceProps = { thickness: "0.1mm" } as const
const gndLabel = { displayName: "GND", schDisplayLabel: "GND" } as const
const vbusLabel = { displayName: "VBUS", schDisplayLabel: "VBUS" } as const
const vsysLabel = { displayName: "VSYS", schDisplayLabel: "VSYS" } as const
const v3v3Label = { displayName: "V3V3", schDisplayLabel: "V3V3" } as const
const v1v1Label = { displayName: "V1V1", schDisplayLabel: "V1V1" } as const
const adcRefLabel = {
  displayName: "ADC_REF",
  schDisplayLabel: "ADC_REF",
} as const
// Keep every functional subset attached to one of the five visible sections so
// section bounds and dividers account for all schematic components.
const schSections = {
  rp2350: (name: string) => `${name}__rp2350`,
  usb: (name: string) => `${name}__usb`,
  power: (name: string) => `${name}__rp2350`,
  vreg: (name: string) => `${name}__vreg`,
  flash: (name: string) => `${name}__usb`,
  clock: (name: string) => `${name}__clock`,
  controls: (name: string) => `${name}__status`,
  display: (name: string) => `${name}__status`,
  status: (name: string) => `${name}__status`,
  debug: (name: string) => `${name}__status`,
} as const

export type MicrocontrollerRP2350Props = Omit<
  SubcircuitProps,
  "children" | "connections"
> & {
  connections?: ChipProps["connections"]
}

/**
 * Complete Pico 2-style RP2350A support circuit. Structurally this mirrors the
 * physically validated `Microcontroller_RP2040` module in @tscircuit/common,
 * with the RP2040-specific power section replaced by the RP2350's on-chip buck
 * converter network (VREG_VIN / VREG_LX / VREG_FB / VREG_AVDD) and the extra
 * DVDD3, QSPI_IOVDD and USB_OTP_VDD supply pins decoupled.
 *
 * Unlike the RP2040 module there are no 27 ohm USB series resistors: the RP2350
 * USB PHY has on-chip series termination, matching the Raspberry Pi Pico 2
 * reference design.
 */
export const Microcontroller_RP2350 = ({
  name = "Microcontroller_RP2350",
  connections,
  ...props
}: MicrocontrollerRP2350Props) => (
  <subcircuit name={name} {...props}>
    <schematicsection
      name={schSections.rp2350(name)}
      displayName="RP2350 & Power"
    />
    <schematicsection
      name={schSections.usb(name)}
      displayName="Programming USB-C & QSPI"
    />
    <schematicsection
      name={schSections.vreg(name)}
      displayName="Core Buck Regulator"
    />
    <schematicsection name={schSections.clock(name)} displayName="Clock" />
    <schematicsection
      name={schSections.status(name)}
      displayName="Status & SWD Debug"
    />

    {/* ---------------------------------------------------------------- */}
    {/* USB-C input, reverse-protection diode and 3V3 LDO                  */}
    {/* ---------------------------------------------------------------- */}
    <TYPE_C_16PIN_2MD_073_
      name="J_USB"
      schSectionName={schSections.usb(name)}
      pcbX={0}
      pcbY={31.0}
      pcbRotation={180}
      schX={10.5}
      schY={-5.3}
      schWidth={2.6}
      schHeight={1.8}
      schPinArrangement={{
        leftSide: [13, 15, 17, 18, 20, 22, 23, 25],
        rightSide: [14, 16, 28, 27, 26, 24, 21, 19],
      }}
    />
    <resistor
      name="R_CC1"
      resistance="5.1k"
      footprint="0402"
      schSectionName={schSections.usb(name)}
      pcbX={-0.2}
      pcbY={25.6}
      schX={7.2}
      schY={-7.5}
      schRotation={270}
    />
    <resistor
      name="R_CC2"
      resistance="5.1k"
      footprint="0402"
      schSectionName={schSections.usb(name)}
      pcbX={3.6}
      pcbY={26.5}
      schX={14.8}
      schY={-6.5}
      schRotation={270}
    />
    <capacitor
      name="C_VBUS"
      capacitance="10uF"
      footprint="0603"
      schSectionName={schSections.usb(name)}
      schOrientation="vertical"
      pcbX={-2.8}
      pcbY={26.3}
      pcbRotation={90}
      schX={9}
      schY={-2.2}
    />
    <B5819W_SL
      name="D_VBUS"
      schSectionName={schSections.power(name)}
      pcbX={-2}
      pcbY={21}
      pcbRotation={90}
      schX={3}
      schY={-5.8}
      schRotation={90}
    />
    <AP2112K_3_3TRG1
      name="U3"
      schSectionName={schSections.power(name)}
      pcbX={-7.2}
      pcbY={20.2}
      pcbRotation={180}
      schX={1.3}
      schY={-7.8}
      schHeight={0.6}
    />
    <resistor
      name="R_3V3_EN"
      resistance="100k"
      footprint="0402"
      schSectionName={schSections.power(name)}
      pcbX={-4.7}
      pcbY={17.3}
      pcbRotation={90}
      schX={3}
      schY={-7}
      schRotation={270}
    />
    <capacitor
      name="C_3V3"
      capacitance="10uF"
      footprint="0603"
      schSectionName={schSections.power(name)}
      schOrientation="vertical"
      pcbX={-8.5}
      pcbY={4.2}
      schX={4.1}
      schY={-7.8}
    />

    {/* ---------------------------------------------------------------- */}
    {/* RP2350A and its supply decoupling                                  */}
    {/* ---------------------------------------------------------------- */}
    <RP2350A
      name="U1"
      connections={connections}
      showPinAliases
      schSectionName={schSections.rp2350(name)}
      pcbX={0}
      pcbY={0.5}
      schX={-0.08}
      schY={-2.5}
      schWidth={2.8}
      schHeight={5.8}
    />

    {/* IOVDD1..IOVDD6 100nF decoupling, one cap per supply pin, each one
        placed next to the pin it serves. */}
    <capacitor
      name="C_IOVDD1"
      capacitance="100nF"
      footprint="0402"
      schSectionName={schSections.rp2350(name)}
      schOrientation="vertical"
      pcbX={5.3}
      pcbY={3.9}
      schX={-11.3}
      schY={-6.4}
    />
    <capacitor
      name="C_IOVDD2"
      capacitance="100nF"
      footprint="0402"
      schSectionName={schSections.rp2350(name)}
      schOrientation="vertical"
      pcbX={5.9}
      pcbY={0.5}
      schX={-9.6}
      schY={-6.4}
    />
    <capacitor
      name="C_IOVDD3"
      capacitance="100nF"
      footprint="0402"
      schSectionName={schSections.rp2350(name)}
      schOrientation="vertical"
      pcbRotation={270}
      pcbX={2.8}
      pcbY={-4.8}
      schX={-7.9}
      schY={-6.4}
    />
    <capacitor
      name="C_IOVDD4"
      capacitance="100nF"
      footprint="0402"
      schSectionName={schSections.rp2350(name)}
      schOrientation="vertical"
      pcbRotation={270}
      pcbX={-1.4}
      pcbY={-4.8}
      schX={-6.2}
      schY={-6.4}
    />
    <capacitor
      name="C_IOVDD5"
      capacitance="100nF"
      footprint="0402"
      schSectionName={schSections.rp2350(name)}
      schOrientation="vertical"
      pcbRotation={180}
      pcbX={-5.6}
      pcbY={-0.7}
      schX={-4.5}
      schY={-6.4}
    />
    <capacitor
      name="C_IOVDD6"
      capacitance="100nF"
      footprint="0402"
      schSectionName={schSections.rp2350(name)}
      schOrientation="vertical"
      pcbRotation={180}
      pcbX={-5.6}
      pcbY={3.5}
      schX={-2.8}
      schY={-6.4}
    />

    {/* DVDD1..DVDD3 are the 1.1V core rail pins (RP2350 has one more than the
        RP2040). */}
    <capacitor
      name="C_DVDD1"
      capacitance="100nF"
      footprint="0402"
      schSectionName={schSections.rp2350(name)}
      schOrientation="vertical"
      pcbX={5.3}
      pcbY={1.5}
      schX={-11.3}
      schY={-9}
    />
    <capacitor
      name="C_DVDD2"
      capacitance="100nF"
      footprint="0402"
      schSectionName={schSections.rp2350(name)}
      schOrientation="vertical"
      pcbRotation={270}
      pcbX={0}
      pcbY={-4.8}
      schX={-9.6}
      schY={-9}
    />
    <capacitor
      name="C_DVDD3"
      capacitance="100nF"
      footprint="0402"
      schSectionName={schSections.rp2350(name)}
      schOrientation="vertical"
      pcbRotation={180}
      pcbX={-5.6}
      pcbY={1}
      schX={-7.9}
      schY={-9}
    />

    {/* QSPI_IOVDD and USB_OTP_VDD are RP2350-only supply pins. */}
    <capacitor
      name="C_QSPI_VDD"
      capacitance="100nF"
      footprint="0402"
      schSectionName={schSections.flash(name)}
      schOrientation="vertical"
      pcbX={-2}
      pcbY={6.2}
      pcbRotation={90}
      schX={16.8}
      schY={-1.7}
    />
    <capacitor
      name="C_USB_VDD"
      capacitance="100nF"
      footprint="0402"
      schSectionName={schSections.usb(name)}
      schOrientation="vertical"
      pcbX={-0.6}
      pcbY={6.2}
      pcbRotation={90}
      schX={7.2}
      schY={-2.2}
    />

    {/* ADC reference: ferrite bead from 3V3 plus local decoupling. */}
    <inductor
      name="L_AVDD"
      inductance="600ohm@100MHz"
      footprint="0603"
      schSectionName={schSections.power(name)}
      pcbX={8.5}
      pcbY={-1.8}
      supplierPartNumbers={{ jlcpcb: ["C1002"] }}
      pcbRotation={90}
      schX={3.7}
      schY={-9.2}
    />
    <capacitor
      name="C_ADC"
      capacitance="100nF"
      footprint="0402"
      schSectionName={schSections.power(name)}
      schOrientation="vertical"
      pcbX={5.9}
      pcbY={2.7}
      schX={1.3}
      schY={-9.2}
    />

    {/* ---------------------------------------------------------------- */}
    {/* RP2350 on-chip buck converter support network                      */}
    {/* ---------------------------------------------------------------- */}
    <inductor
      name="L_CORE"
      inductance="3.3uH"
      footprint="0805"
      schSectionName={schSections.vreg(name)}
      pcbX={3.4}
      pcbY={7.6}
      pcbRotation={90}
      schX={-9}
      schY={-15}
    />
    <capacitor
      name="C_VREG_IN"
      capacitance="4.7uF"
      footprint="0402"
      schSectionName={schSections.vreg(name)}
      schOrientation="vertical"
      pcbX={0.9}
      pcbY={6.1}
      pcbRotation={90}
      schX={-13}
      schY={-16}
    />
    <capacitor
      name="C_VREG_OUT"
      capacitance="4.7uF"
      footprint="0402"
      schSectionName={schSections.vreg(name)}
      schOrientation="vertical"
      pcbX={3.4}
      pcbY={10.8}
      pcbRotation={90}
      schX={-6}
      schY={-16}
    />
    <resistor
      name="R_VREG_AVDD"
      resistance="33ohm"
      footprint="0402"
      schSectionName={schSections.vreg(name)}
      pcbX={5.4}
      pcbY={7.0}
      pcbRotation={270}
      schX={-11}
      schY={-12}
    />
    <capacitor
      name="C_VREG_AVDD"
      capacitance="4.7uF"
      footprint="0402"
      schSectionName={schSections.vreg(name)}
      schOrientation="vertical"
      pcbX={6.9}
      pcbY={7.0}
      pcbRotation={90}
      schX={-9}
      schY={-11}
    />

    {/* ---------------------------------------------------------------- */}
    {/* QSPI flash                                                         */}
    {/* ---------------------------------------------------------------- */}
    <W25Q16JVUXIQ
      name="U2"
      schSectionName={schSections.flash(name)}
      pcbX={-3.4}
      pcbY={10.5}
      pcbRotation={90}
      schX={17}
      schY={-4}
      schHeight={2}
      schPinArrangement={{
        leftSide: [8, 1, 2, 3, 5, 6, 7, 4, 9],
      }}
    />

    {/* ---------------------------------------------------------------- */}
    {/* Crystal                                                            */}
    {/* ---------------------------------------------------------------- */}
    <X322512MSB4SI
      name="Y1"
      schSectionName={schSections.clock(name)}
      pcbX={-0.5}
      pcbY={-9}
      schX={1.2}
      schY={-12.5}
    />
    <capacitor
      name="C_XIN"
      capacitance="18pF"
      footprint="0402"
      schSectionName={schSections.clock(name)}
      schOrientation="vertical"
      pcbX={-2.6}
      pcbY={-12}
      schX={0.4}
      schY={-14.2}
    />
    <capacitor
      name="C_XOUT"
      capacitance="18pF"
      footprint="0402"
      schSectionName={schSections.clock(name)}
      schOrientation="vertical"
      pcbX={1.6}
      pcbY={-12}
      schX={2.2}
      schY={-14.2}
    />

    {/* ---------------------------------------------------------------- */}
    {/* BOOTSEL / RUN controls                                             */}
    {/* ---------------------------------------------------------------- */}
    <SKRPACE010
      name="SW_BOOT"
      schSectionName={schSections.controls(name)}
      pcbX={8.6}
      pcbY={21.8}
      schX={8.6}
      schY={-12}
    />
    <SKRPACE010
      name="SW_RUN"
      schSectionName={schSections.controls(name)}
      pcbX={5.5}
      pcbY={-12.5}
      pcbRotation={90}
      schX={12.8}
      schY={-12}
    />
    <resistor
      name="R_BOOT"
      resistance="10k"
      footprint="0402"
      schSectionName={schSections.controls(name)}
      pcbX={12}
      pcbY={17.8}
      pcbRotation={90}
      schX={8.6}
      schY={-13.5}
      schRotation={90}
    />
    <resistor
      name="R_RUN"
      resistance="10k"
      footprint="0402"
      schSectionName={schSections.controls(name)}
      pcbX={10.4}
      pcbY={-5.5}
      schX={12.8}
      schY={-13.5}
      schRotation={90}
    />

    {/* ---------------------------------------------------------------- */}
    {/* Status LEDs                                                        */}
    {/* ---------------------------------------------------------------- */}
    <XL_1608SURC_06
      name="D1"
      color="green"
      schSectionName={schSections.status(name)}
      pcbX={10}
      pcbY={4.2}
      pcbRotation={90}
      schX={10.4}
      schY={-13.2}
      schRotation={270}
    />
    <resistor
      name="R_LED"
      resistance="330"
      footprint="0402"
      schSectionName={schSections.status(name)}
      pcbX={8}
      pcbY={4.2}
      pcbRotation={90}
      schX={10.4}
      schY={-12.2}
      schRotation={270}
    />
    <XL_1608SURC_06
      name="D_PWR"
      color="green"
      schSectionName={schSections.status(name)}
      pcbX={-9.8}
      pcbY={24.8}
      pcbRotation={90}
      schX={14.5}
      schY={-13.4}
      schRotation={270}
    />
    <resistor
      name="R_PWR_LED"
      resistance="330"
      footprint="0402"
      schSectionName={schSections.status(name)}
      pcbX={-6.2}
      pcbY={24.8}
      pcbRotation={90}
      schX={14.5}
      schY={-12.2}
      schRotation={270}
    />

    {/* ---------------------------------------------------------------- */}
    {/* SWD test points                                                    */}
    {/* ---------------------------------------------------------------- */}
    <testpoint
      name="TP_SWCLK"
      footprintVariant="pad"
      padShape="circle"
      padDiameter="1.1mm"
      schSectionName={schSections.debug(name)}
      pcbX={-6}
      pcbY={-19}
      schX={8.6}
      schY={-16.5}
    />
    <testpoint
      name="TP_GND"
      footprintVariant="pad"
      padShape="circle"
      padDiameter="1.1mm"
      schSectionName={schSections.debug(name)}
      pcbX={-2}
      pcbY={-19}
      schX={10.4}
      schY={-16.5}
    />
    <testpoint
      name="TP_SWDIO"
      footprintVariant="pad"
      padShape="circle"
      padDiameter="1.1mm"
      schSectionName={schSections.debug(name)}
      pcbX={2}
      pcbY={-19}
      schX={12.2}
      schY={-16.5}
    />
    <testpoint
      name="TP_3V3"
      footprintVariant="pad"
      padShape="circle"
      padDiameter="1.1mm"
      schSectionName={schSections.debug(name)}
      pcbX={6}
      pcbY={-19}
      schX={14}
      schY={-16.5}
    />

    {/* ================================================================= */}
    {/* Connectivity                                                       */}
    {/* ================================================================= */}

    {/* USB-C connector */}
    <trace name="VBUS_A" from=".J_USB > .A4B9" to="net.VBUS" {...vbusLabel} />
    <trace name="VBUS_B" from=".J_USB > .B4A9" to="net.VBUS" {...vbusLabel} />
    <trace
      {...denseTraceProps}
      name="USB_DM_A"
      from=".J_USB > .A7"
      to=".U1 > .USB_DM"
    />
    <trace
      {...denseTraceProps}
      name="USB_DM_B"
      from=".J_USB > .B7"
      to=".U1 > .USB_DM"
    />
    <trace
      {...denseTraceProps}
      name="USB_DP_A"
      from=".J_USB > .A6"
      to=".U1 > .USB_DP"
    />
    <trace
      {...denseTraceProps}
      name="USB_DP_B"
      from=".J_USB > .B6"
      to=".U1 > .USB_DP"
    />
    <trace
      {...denseTraceProps}
      name="CC1"
      from=".J_USB > .A5"
      to=".R_CC1 > .pin1"
    />
    <trace
      {...denseTraceProps}
      name="CC2"
      from=".J_USB > .B5"
      to=".R_CC2 > .pin1"
    />
    <trace name="CC1_G" from=".R_CC1 > .pin2" to="net.GND" {...gndLabel} />
    <trace name="CC2_G" from=".R_CC2 > .pin2" to="net.GND" {...gndLabel} />
    <trace
      {...denseTraceProps}
      name="USB_G"
      from=".J_USB > .A1B12"
      to="net.GND"
      {...gndLabel}
    />
    <trace
      {...denseTraceProps}
      name="USB_G_B"
      from=".J_USB > .B1A12"
      to="net.GND"
      {...gndLabel}
    />
    <trace
      {...denseTraceProps}
      name="USB_EH1"
      from=".J_USB > .EH1"
      to="net.GND"
      {...gndLabel}
    />
    <trace
      {...denseTraceProps}
      name="USB_EH1_ALT"
      from=".J_USB > .pin13_alt1"
      to="net.GND"
      {...gndLabel}
    />
    <trace
      {...denseTraceProps}
      name="USB_EH2"
      from=".J_USB > .EH2"
      to="net.GND"
      {...gndLabel}
    />
    <trace
      {...denseTraceProps}
      name="USB_EH2_ALT"
      from=".J_USB > .pin14_alt1"
      to="net.GND"
      {...gndLabel}
    />
    <trace name="VBUS_C" from="net.VBUS" to=".C_VBUS > .pin1" {...vbusLabel} />
    <trace name="VBUS_G" from=".C_VBUS > .pin2" to="net.GND" {...gndLabel} />

    {/* VBUS -> VSYS -> 3V3 */}
    <trace name="VBUS_D" from="net.VBUS" to=".D_VBUS > .anode" {...vbusLabel} />
    <trace
      name="D_VSYS"
      from=".D_VBUS > .cathode"
      to="net.VSYS"
      {...vsysLabel}
    />
    <trace name="VSYS_IN" from="net.VSYS" to=".U3 > .VIN" {...vsysLabel} />
    <trace
      name="EN_VSYS"
      from=".R_3V3_EN > .pin1"
      to="net.VSYS"
      {...vsysLabel}
    />
    <trace name="EN_R" from=".R_3V3_EN > .pin2" to=".U3 > .EN" />
    <trace name="REG_3V3" from=".U3 > .VOUT" to="net.V3V3" {...v3v3Label} />
    <trace name="REG_G" from=".U3 > .GND" to="net.GND" {...gndLabel} />
    <trace name="C3V3_P" from=".C_3V3 > .pin1" to="net.V3V3" {...v3v3Label} />
    <trace name="C3V3_G" from=".C_3V3 > .pin2" to="net.GND" {...gndLabel} />

    {/* RP2350 supply pins */}
    <trace
      {...denseTraceProps}
      name="IOVDD1_P"
      from=".U1 > .IOVDD1"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace
      {...denseTraceProps}
      name="IOVDD2_P"
      from=".U1 > .IOVDD2"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace
      {...denseTraceProps}
      name="IOVDD3_P"
      from=".U1 > .IOVDD3"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace
      {...denseTraceProps}
      name="IOVDD4_P"
      from=".U1 > .IOVDD4"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace
      {...denseTraceProps}
      name="IOVDD5_P"
      from=".U1 > .IOVDD5"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace
      {...denseTraceProps}
      name="IOVDD6_P"
      from=".U1 > .IOVDD6"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace
      {...denseTraceProps}
      name="QSPI_IOVDD_P"
      from=".U1 > .QSPI_IOVDD"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace
      {...denseTraceProps}
      name="USB_OTP_VDD_P"
      from=".U1 > .USB_OTP_VDD"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace
      {...denseTraceProps}
      name="DVDD1_P"
      from=".U1 > .DVDD1"
      to="net.V1V1"
      {...v1v1Label}
    />
    <trace
      {...denseTraceProps}
      name="DVDD2_P"
      from=".U1 > .DVDD2"
      to="net.V1V1"
      {...v1v1Label}
    />
    <trace
      {...denseTraceProps}
      name="DVDD3_P"
      from=".U1 > .DVDD3"
      to="net.V1V1"
      {...v1v1Label}
    />
    <trace name="GND_G" from=".U1 > .GND" to="net.GND" {...gndLabel} />

    {/* IOVDD decoupling */}
    <trace
      name="IO1_3V3"
      from=".C_IOVDD1 > .pin1"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace name="IO1_G" from=".C_IOVDD1 > .pin2" to="net.GND" {...gndLabel} />
    <trace
      name="IO2_3V3"
      from=".C_IOVDD2 > .pin1"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace name="IO2_G" from=".C_IOVDD2 > .pin2" to="net.GND" {...gndLabel} />
    <trace
      name="IO3_3V3"
      from=".C_IOVDD3 > .pin1"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace name="IO3_G" from=".C_IOVDD3 > .pin2" to="net.GND" {...gndLabel} />
    <trace
      name="IO4_3V3"
      from=".C_IOVDD4 > .pin1"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace name="IO4_G" from=".C_IOVDD4 > .pin2" to="net.GND" {...gndLabel} />
    <trace
      name="IO5_3V3"
      from=".C_IOVDD5 > .pin1"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace name="IO5_G" from=".C_IOVDD5 > .pin2" to="net.GND" {...gndLabel} />
    <trace
      name="IO6_3V3"
      from=".C_IOVDD6 > .pin1"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace name="IO6_G" from=".C_IOVDD6 > .pin2" to="net.GND" {...gndLabel} />

    {/* Core rail decoupling */}
    <trace
      name="DV1_1V1"
      from=".C_DVDD1 > .pin1"
      to="net.V1V1"
      {...v1v1Label}
    />
    <trace name="DV1_G" from=".C_DVDD1 > .pin2" to="net.GND" {...gndLabel} />
    <trace
      name="DV2_1V1"
      from=".C_DVDD2 > .pin1"
      to="net.V1V1"
      {...v1v1Label}
    />
    <trace name="DV2_G" from=".C_DVDD2 > .pin2" to="net.GND" {...gndLabel} />
    <trace
      name="DV3_1V1"
      from=".C_DVDD3 > .pin1"
      to="net.V1V1"
      {...v1v1Label}
    />
    <trace name="DV3_G" from=".C_DVDD3 > .pin2" to="net.GND" {...gndLabel} />

    {/* QSPI_IOVDD / USB_OTP_VDD decoupling */}
    <trace
      name="QVDD_3V3"
      from=".C_QSPI_VDD > .pin1"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace
      name="QVDD_G"
      from=".C_QSPI_VDD > .pin2"
      to="net.GND"
      {...gndLabel}
    />
    <trace
      name="UVDD_3V3"
      from=".C_USB_VDD > .pin1"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace name="UVDD_G" from=".C_USB_VDD > .pin2" to="net.GND" {...gndLabel} />

    {/* ADC reference */}
    <trace name="AVDD_IN" from=".L_AVDD > .pin1" to="net.V3V3" {...v3v3Label} />
    <trace
      name="AVDD"
      from=".L_AVDD > .pin2"
      to="net.ADC_VREF"
      {...adcRefLabel}
    />
    <trace
      name="ADC_AVDD"
      from=".U1 > .ADC_AVDD"
      to="net.ADC_VREF"
      {...adcRefLabel}
    />
    <trace
      name="ADC_REF"
      from=".C_ADC > .pin1"
      to="net.ADC_VREF"
      {...adcRefLabel}
    />
    <trace name="ADC_G" from=".C_ADC > .pin2" to="net.GND" {...gndLabel} />

    {/* On-chip buck converter: 3V3 -> VREG_VIN, VREG_LX -> L_CORE -> V1V1,
        VREG_FB senses V1V1, VREG_AVDD gets an RC-filtered 3V3 feed. */}
    <trace
      name="VREG_VIN"
      from=".U1 > .VREG_VIN"
      to="net.V3V3"
      thickness="0.3mm"
      {...v3v3Label}
    />
    <trace
      name="VREG_IN_C"
      from=".C_VREG_IN > .pin1"
      to="net.V3V3"
      thickness="0.3mm"
      {...v3v3Label}
    />
    <trace
      name="VREG_IN_C_G"
      from=".C_VREG_IN > .pin2"
      to="net.GND"
      {...gndLabel}
    />
    <trace
      name="VREG_LX"
      from=".U1 > .VREG_LX"
      to=".L_CORE > .pin1"
      thickness="0.3mm"
    />
    <trace
      name="VREG_L_OUT"
      from=".L_CORE > .pin2"
      to="net.V1V1"
      thickness="0.3mm"
      {...v1v1Label}
    />
    <trace name="VREG_FB" from=".U1 > .VREG_FB" to="net.V1V1" {...v1v1Label} />
    <trace
      name="VREG_OUT_C"
      from=".C_VREG_OUT > .pin1"
      to="net.V1V1"
      thickness="0.3mm"
      {...v1v1Label}
    />
    <trace
      name="VREG_OUT_C_G"
      from=".C_VREG_OUT > .pin2"
      to="net.GND"
      {...gndLabel}
    />
    <trace
      name="VREG_PGND"
      from=".U1 > .VREG_PGND"
      to="net.GND"
      thickness="0.3mm"
      {...gndLabel}
    />
    <trace
      name="VREG_AVDD_R_IN"
      from=".R_VREG_AVDD > .pin1"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace
      name="VREG_AVDD_R_OUT"
      from=".R_VREG_AVDD > .pin2"
      to=".C_VREG_AVDD > .pin1"
    />
    <trace
      name="VREG_AVDD_C"
      from=".C_VREG_AVDD > .pin1"
      to=".U1 > .VREG_AVDD"
    />
    <trace
      name="VREG_AVDD_C_G"
      from=".C_VREG_AVDD > .pin2"
      to="net.GND"
      {...gndLabel}
    />

    {/* QSPI flash */}
    <trace
      {...denseTraceProps}
      name="QSPI_SS"
      from=".U1 > .QSPI_SS"
      to=".U2 > .CS"
      schDisplayLabel="QSPI_SS"
    />
    <trace
      {...denseTraceProps}
      name="QSPI_SD0"
      from=".U1 > .QSPI_SD0"
      to=".U2 > .pin5"
      schDisplayLabel="QSPI_SD0"
    />
    <trace
      {...denseTraceProps}
      name="QSPI_SD1"
      from=".U1 > .QSPI_SD1"
      to=".U2 > .pin2"
      schDisplayLabel="QSPI_SD1"
    />
    <trace
      {...denseTraceProps}
      name="QSPI_SD2"
      from=".U1 > .QSPI_SD2"
      to=".U2 > .pin3"
      schDisplayLabel="QSPI_SD2"
    />
    <trace
      {...denseTraceProps}
      name="QSPI_SD3"
      from=".U1 > .QSPI_SD3"
      to=".U2 > .pin7"
      schDisplayLabel="QSPI_SD3"
    />
    <trace
      {...denseTraceProps}
      name="QSPI_SCLK"
      from=".U1 > .QSPI_SCLK"
      to=".U2 > .CLK"
      schDisplayLabel="QSPI_SCLK"
    />
    <trace name="FLSH_GND" from=".U2 > .GND" to="net.GND" {...gndLabel} />
    <trace name="FLSH_VCC" from=".U2 > .VCC" to="net.V3V3" {...v3v3Label} />
    <trace name="FLSH_EP" from=".U2 > .EP" to="net.GND" {...gndLabel} />

    {/* Crystal */}
    <trace name="XIN" from=".Y1 > .pin1" to=".U1 > .XIN" />
    <trace name="XOUT" from=".Y1 > .pin3" to=".U1 > .XOUT" />
    <trace name="CXIN" from=".C_XIN > .pin1" to=".Y1 > .pin1" />
    <trace name="CXIN_G" from=".C_XIN > .pin2" to="net.GND" {...gndLabel} />
    <trace name="CXOUT" from=".C_XOUT > .pin1" to=".Y1 > .pin3" />
    <trace name="CXOUT_G" from=".C_XOUT > .pin2" to="net.GND" {...gndLabel} />
    <trace name="Y1_G1" from=".Y1 > .pin2" to="net.GND" {...gndLabel} />
    <trace name="Y1_G2" from=".Y1 > .pin4" to="net.GND" {...gndLabel} />

    {/* BOOTSEL and RUN */}
    <trace name="BOOT_SW" from=".SW_BOOT > .pin1" to=".U1 > .QSPI_SS" />
    <trace name="BOOT_G" from=".SW_BOOT > .pin3" to="net.GND" {...gndLabel} />
    <trace name="BOOT_R" from=".R_BOOT > .pin1" to=".U1 > .QSPI_SS" />
    <trace
      name="BOOT_3V3"
      from=".R_BOOT > .pin2"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace
      {...denseTraceProps}
      name="RUN_R"
      from=".R_RUN > .pin1"
      to=".U1 > .RUN"
    />
    <trace name="RUN_3V3" from=".R_RUN > .pin2" to="net.V3V3" {...v3v3Label} />
    <trace name="RUN_SW" from=".SW_RUN > .pin1" to=".U1 > .RUN" />
    <trace name="RUN_G" from=".SW_RUN > .pin4" to="net.GND" {...gndLabel} />

    {/* Status LEDs */}
    <trace name="LED_GP25" from=".U1 > .GPIO25" to=".R_LED > .pin1" />
    <trace name="LED_D1" from=".R_LED > .pin2" to=".D1 > .anode" />
    <trace name="LED_G" from=".D1 > .cathode" to="net.GND" {...gndLabel} />
    <trace
      name="PLED_3V3"
      from="net.V3V3"
      to=".R_PWR_LED > .pin1"
      {...v3v3Label}
    />
    <trace name="PLED_D" from=".R_PWR_LED > .pin2" to=".D_PWR > .anode" />
    <trace name="PLED_G" from=".D_PWR > .cathode" to="net.GND" {...gndLabel} />

    {/* SWD */}
    <trace name="SWCLK" from=".U1 > .SWCLK" to=".TP_SWCLK > .pin1" />
    <trace name="SWD" from=".U1 > .SWDIO" to=".TP_SWDIO > .pin1" />
    <trace name="TP_G" from=".TP_GND > .pin1" to="net.GND" {...gndLabel} />
    <trace name="TP3V3_T" from=".TP_3V3 > .pin1" to="net.V3V3" {...v3v3Label} />

    <silkscreentext text="BOOT" fontSize="0.8mm" pcbX={12.4} pcbY={21.8} />
    <silkscreentext text="RUN" fontSize="0.8mm" pcbX={9.6} pcbY={-12.5} />
    <silkscreentext text="PWR" fontSize="0.8mm" pcbX={-9.8} pcbY={27.4} />
    <silkscreentext text="USB-C" fontSize="0.9mm" pcbX={0} pcbY={25} />
    <silkscreentext text="SWCLK" fontSize="0.7mm" pcbX={-6} pcbY={-20.5} />
    <silkscreentext text="GND" fontSize="0.7mm" pcbX={-2} pcbY={-20.5} />
    <silkscreentext text="SWDIO" fontSize="0.7mm" pcbX={2} pcbY={-20.5} />
    <silkscreentext text="3V3" fontSize="0.7mm" pcbX={6} pcbY={-20.5} />
  </subcircuit>
)
