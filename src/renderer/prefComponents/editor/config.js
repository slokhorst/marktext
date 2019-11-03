import { ENCODING_NAME_MAP } from 'common/encoding'

export const endOfLineOptions = [{
  label: 'Default',
  value: 'default'
}, {
  label: 'Carriage return and Line feed(CRLF)',
  value: 'crlf'
}, {
  label: 'Line feed(Lf)',
  value: 'lf'
}]

export const trimTrailingNewlineOptions = [{
  label: 'Trim trailing newlines',
  value: 0
}, {
  label: 'Ensure single trailing newline',
  value: 1
}, {
  label: 'Automatically detect',
  value: 2
}, {
  label: 'Disabled',
  value: 3
}]

export const textDirectionOptions = [{
  label: 'Left to Right',
  value: 'ltr'
}, {
  label: 'Right to Left',
  value: 'rtl'
}]

let defaultEncodingOptions = null
export const getDefaultEncodingOptions = () => {
  if (defaultEncodingOptions) {
    return defaultEncodingOptions
  }

  defaultEncodingOptions = []
  for (const [value, label] of Object.entries(ENCODING_NAME_MAP)) {
    defaultEncodingOptions.push({ label, value })
  }
  return defaultEncodingOptions
}
