import { expect, test } from "bun:test"
import { Circuit } from "tscircuit"
import { Microcontroller_RP2350 } from "../index"

test("Microcontroller_RP2350 creates a named, positionable subcircuit", () => {
  const element = Microcontroller_RP2350({
    name: "MCU",
    pcbX: 12,
    pcbY: -4,
    pcbRotation: 90,
  }) as any

  expect(element.type).toBe("subcircuit")
  expect(element.props.name).toBe("MCU")
  expect(element.props.pcbX).toBe(12)
  expect(element.props.pcbY).toBe(-4)
  expect(element.props.pcbRotation).toBe(90)

  const children = Array.isArray(element.props.children)
    ? element.props.children
    : [element.props.children]
  expect(children.some((child: any) => child?.type === "board")).toBe(false)
})

test("Microcontroller_RP2350 renders its complete support circuit", async () => {
  const circuit = new Circuit()

  circuit.add(
    <board width="30mm" height="70mm" routingDisabled>
      <Microcontroller_RP2350
        name="MCU"
        connections={{ GPIO0: "net.USER_IO" }}
      />
    </board>,
  )

  await circuit.renderUntilSettled()

  const circuitJson = circuit.getCircuitJson() as any[]

  expect(circuit.db.source_group.getWhere({ name: "MCU" })).toBeDefined()
  expect(
    circuit.db.source_component
      .list()
      .some((component) => component.manufacturer_part_number === "RP2350A"),
  ).toBe(true)
  expect(circuit.db.pcb_component.list().length).toBeGreaterThan(0)
  expect(circuit.db.source_net.getWhere({ name: "USER_IO" })).toBeDefined()
  expect(
    circuitJson.filter((element) => element.type.endsWith("_error")),
  ).toEqual([])
  expect(
    circuitJson.filter(
      (element) => element.type === "schematic_element_outside_sheet_warning",
    ),
  ).toEqual([])
})

test("Microcontroller_RP2350 wires the on-chip buck converter network", async () => {
  const circuit = new Circuit()

  circuit.add(
    <board width="30mm" height="70mm" routingDisabled>
      <Microcontroller_RP2350 name="MCU" />
    </board>,
  )

  await circuit.renderUntilSettled()

  const portFor = (componentName: string, portName: string) => {
    const component = circuit.db.source_component.getWhere({
      name: componentName,
    })!
    return circuit.db.source_port
      .list()
      .find(
        (port) =>
          port.source_component_id === component.source_component_id &&
          (port.name === portName || port.port_hints?.includes(portName)),
      )!
  }
  const netIdFor = (sourcePortId: string) =>
    circuit.db.source_trace
      .list()
      .find((trace) => trace.connected_source_port_ids.includes(sourcePortId))
      ?.connected_source_net_ids?.[0]
  const netNameFor = (sourcePortId: string) => {
    const netId = netIdFor(sourcePortId)
    return netId
      ? circuit.db.source_net.getWhere({ source_net_id: netId })?.name
      : undefined
  }

  // 3V3 feeds VREG_VIN, the switching node runs through L_CORE, and the
  // regulated 1.1V core rail comes back on V1V1.
  expect(netNameFor(portFor("U1", "VREG_VIN").source_port_id)).toBe("V3V3")
  expect(netNameFor(portFor("L_CORE", "pin2").source_port_id)).toBe("V1V1")
  expect(netNameFor(portFor("U1", "VREG_FB").source_port_id)).toBe("V1V1")
  expect(netNameFor(portFor("U1", "VREG_PGND").source_port_id)).toBe("GND")

  // VREG_LX is a direct point-to-point trace to the inductor, not a net.
  const lxTrace = circuit.db.source_trace
    .list()
    .find((trace) =>
      trace.connected_source_port_ids.includes(
        portFor("U1", "VREG_LX").source_port_id,
      ),
    )!
  expect(lxTrace.connected_source_port_ids).toContain(
    portFor("L_CORE", "pin1").source_port_id,
  )

  // All three DVDD core-supply pins sit on the buck output.
  for (const dvdd of ["DVDD1", "DVDD2", "DVDD3"]) {
    expect(netNameFor(portFor("U1", dvdd).source_port_id)).toBe("V1V1")
  }

  // The RP2350-only supply pins are on 3V3 and each has a local decoupler.
  for (const supply of ["QSPI_IOVDD", "USB_OTP_VDD"]) {
    expect(netNameFor(portFor("U1", supply).source_port_id)).toBe("V3V3")
  }
  expect(
    circuit.db.source_component.getWhere({ name: "C_QSPI_VDD" }),
  ).toBeDefined()
  expect(
    circuit.db.source_component.getWhere({ name: "C_USB_VDD" }),
  ).toBeDefined()

  // USB data lines go straight to the chip: the RP2350 PHY has on-chip series
  // termination, so there are no 27 ohm resistors like on the RP2040 module.
  expect(
    circuit.db.source_component.getWhere({ name: "R_USB1" }),
  ).toBeUndefined()
  expect(
    circuit.db.source_component.getWhere({ name: "R_USB2" }),
  ).toBeUndefined()
})
