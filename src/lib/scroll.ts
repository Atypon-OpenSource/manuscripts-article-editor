export const scrollIntoViewIfNeeded = (element: Element) => {
  const rect = element.getBoundingClientRect()
  if (rect.bottom > window.innerHeight || rect.top < 150) {
    element.scrollIntoView();
  }
}
