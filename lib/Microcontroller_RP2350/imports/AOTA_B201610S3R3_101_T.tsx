import type { InductorProps } from "@tscircuit/props"

type AOTA_B201610S3R3_101_TProps = Omit<InductorProps, "inductance">

/**
 * 3.3uH 0806 (2016 metric) inductor for the RP2350 on-chip switching regulator.
 * Abracon produces this part with a polarity dot because the core regulator is
 * sensitive to which way the coil is wound relative to the output capacitor —
 * see "Hardware design with RP2350", section 2.1.
 */
export const AOTA_B201610S3R3_101_T = (props: AOTA_B201610S3R3_101_TProps) => {
  return (
    <inductor
      inductance="3.3uH"
      supplierPartNumbers={{
        jlcpcb: ["C42411119"],
      }}
      manufacturerPartNumber="AOTA-B201610S3R3-101-T"
      footprint="res_p2mm_pw1mm_ph1.6mm"
      cadModel={{
        objUrl:
          "https://modelcdn.tscircuit.com/easyeda_models/assets/C42411119.obj?uuid=1fea8f9ef5b64dc68dc98052e0860c3b",
        stepUrl:
          "https://modelcdn.tscircuit.com/easyeda_models/assets/C42411119.step?uuid=1fea8f9ef5b64dc68dc98052e0860c3b",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0, z: -0.05 },
      }}
      {...props}
    />
  )
}
