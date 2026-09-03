import { convertControlDef, LaunchpadDevice, useDevice } from '@mixxx-launch/launchpad-common'
import def from '../controls'
import { sendSysexMsg } from '@mixxx-launch/mixxx'
import { MidiControlDef } from '@mixxx-launch/common/midi'
import { Color } from '@mixxx-launch/launch-common'
import { RGBColor } from '@mixxx-launch/common/color'

const colors = {
  [Color.Black]: 0,
  [Color.WhiteHi]: 113,
  [Color.WhiteLow]: 1,
  [Color.GrayHi]: 70,
  [Color.GrayLow]: 71,
  [Color.RedHi]: 5,
  [Color.RedLow]: 7,
  [Color.OrangeHi]: 84,
  [Color.OrangeLow]: 11,
  [Color.YellowHi]: 13,
  [Color.YellowLow]: 15,
  [Color.GrassHi]: 17,
  [Color.GrassLow]: 19,
  [Color.GreenHi]: 17,
  [Color.GreenLow]: 19,
  [Color.CyanHi]: 33,
  [Color.CyanLow]: 39,
  [Color.AmberHi]: 41,
  [Color.AmberLow]: 43,
  [Color.BlueHi]: 45,
  [Color.BlueLow]: 47,
  [Color.VioletHi]: 69,
  [Color.VioletLow]: 51,
  [Color.PurpleHi]: 53,
  [Color.PurpleLow]: 55,
  [Color.PinkHi]: 95,
  [Color.PinkLow]: 55,
  [Color.BrownHi]: 108,
  [Color.BrownLow]: 83,
}

class LaunchpadMK2Device extends LaunchpadDevice {
  supportsRGBColors = true
  controls: { [key: string]: MidiControlDef } = Object.fromEntries(
    Object.entries(def().controls).map(([k, v]) => [k, convertControlDef(k, v as [number, number])]),
  )
  colors = colors

  sendRGBColor(control: MidiControlDef, color: RGBColor) {
    sendSysexMsg([240, 0, 32, 41, 2, 24, 11, control.midino, ...color.map((x) => ~~(x / 4)), 247])
  }
}

export default useDevice(new LaunchpadMK2Device())
