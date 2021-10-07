export function getElement(selector: string | Element): HTMLElement {
  const el =
    typeof selector === "string"
      ? globalThis.document.querySelector(selector)
      : selector

  if (!(el instanceof HTMLElement)) {
    throw new Error("Invalid container")
  }

  return el
}
