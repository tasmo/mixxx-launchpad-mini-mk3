import type { MidiMessage } from '@mixxx-launch/common/midi'
import { Component } from '@mixxx-launch/common/component'
import { LaunchpadDevice, Pad } from './device'
import { ModifierState, Modifier } from '@mixxx-launch/common/modifier'
import { Color } from '@mixxx-launch/launch-common'

export default class ModifierSidebar extends Component implements Modifier {
  shift: Pad
  ctrl: Pad
  state: ModifierState
  shiftListener: (_: MidiMessage) => void
  ctrlListener: (_: MidiMessage) => void

  constructor(device: LaunchpadDevice) {
    super()
    this.shift = new Pad(device, device.controls.solo)
    this.ctrl = new Pad(device, device.controls.arm)

    this.state = ModifierState.None

    const makeListener = (button: Pad) => (message: MidiMessage) => {
      const { value } = message

      this.state ^= button.control.name === device.controls.solo.name ? ModifierState.Shift : ModifierState.Ctrl
      this.emit('update', this.state)
      if (button.control.name === device.controls.solo.name) {
        this.state ^= ModifierState.Shift
        this.emit('update', this.state)
        if (value) {
          button.sendColor(Color.BlueHi)
        } else {
          button.sendColor(Color.BlueLow)
        }
      } else {
        this.state ^= ModifierState.Ctrl
        this.emit('update', this.state)
        if (value) {
          button.sendColor(Color.BrownHi)
        } else {
          button.sendColor(Color.BrownLow)
        }
      }
    }
    this.shiftListener = makeListener(this.shift)
    this.shift.sendColor(Color.BlueLow)
    this.ctrlListener = makeListener(this.ctrl)
    this.ctrl.sendColor(Color.BrownLow)
  }

  override onMount() {
    this.shift.mount()
    this.ctrl.mount()

    this.shift.on('midi', this.shiftListener)
    this.ctrl.on('midi', this.ctrlListener)
  }

  override onUnmount() {
    this.shift.removeListener('midi', this.shiftListener)
    this.ctrl.removeListener('midi', this.ctrlListener)

    this.shift.unmount()
    this.ctrl.unmount()
  }

  getState() {
    return this.state
  }
}
