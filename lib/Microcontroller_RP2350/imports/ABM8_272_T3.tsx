import type { CrystalProps } from "@tscircuit/props"

type ABM8_272_T3Props = Omit<
  CrystalProps,
  "frequency" | "loadCapacitance" | "pinVariant"
>

/**
 * 12MHz crystal Raspberry Pi specifically recommends for RP2350 designs (also
 * used on Pico and Pico 2). 30ppm tolerance, 50ohm max ESR, 10pF load.
 */
export const ABM8_272_T3 = (props: ABM8_272_T3Props) => {
  return (
    <crystal
      frequency="12MHz"
      loadCapacitance="10pF"
      pinVariant="four_pin"
      supplierPartNumbers={{
        jlcpcb: ["C20625731"],
      }}
      manufacturerPartNumber="ABM8-272-T3"
      footprint="crystal"
      cadModel={{
        objUrl:
          "https://modelcdn.tscircuit.com/easyeda_models/assets/C20625731.obj?uuid=02485e56ba8d4732a26526d2983fc729",
        stepUrl:
          "https://modelcdn.tscircuit.com/easyeda_models/assets/C20625731.step?uuid=02485e56ba8d4732a26526d2983fc729",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0, z: 0 },
      }}
      {...props}
    />
  )
}
