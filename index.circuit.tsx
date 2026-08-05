import { Microcontroller_RP2350 } from "./lib/Microcontroller_RP2350/Microcontroller_RP2350.circuit"

export default function MicrocontrollerRP2350WithUsbC() {
  return (
    <board
      width="30mm"
      height="70mm"
      autorouter="auto_local"
      autorouterEffortLevel="10x"
    >
      <Microcontroller_RP2350 name="MCU" />
    </board>
  )
}
