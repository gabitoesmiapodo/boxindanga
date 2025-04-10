export const keys: Record<string, boolean> = {}

export const initKeys = () => {
  document.addEventListener('keydown', (e) => {
    keys[e.key] = true
  })

  document.addEventListener('keyup', (e) => {
    keys[e.key] = false
  })
}
