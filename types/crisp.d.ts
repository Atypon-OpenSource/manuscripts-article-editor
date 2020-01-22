declare interface Window {
  CRISP_READY_TRIGGER?: () => void
  $crisp: {
    is?: (namespace: string) => boolean
    get?: (namespace: string) => unknown
    push: (
      value:
        | [string, string]
        | [string, string, (value?: unknown) => void]
        | [string, string, string[]]
        | [
            string,
            string,
            ['file', { name: string; url: string; type: string }]
          ]
    ) => void
  }
}
