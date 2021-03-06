import { EventStore } from './eventStore'
import { ScrollTo } from './scrollTo'

type Params = {
  root: HTMLElement
  scrollTo: ScrollTo
  slidesToScroll: number
}

export type SlideFocus = {
  addActivationEvents: (slides: HTMLElement[]) => void
  removeAllEvents: EventStore['removeAll']
}

export function SlideFocus(params: Params): SlideFocus {
  const { scrollTo, slidesToScroll, root } = params
  const eventStore = EventStore()
  const removeAllEvents = eventStore.removeAll
  let lastTabPressTime = 0

  function registerTabPress(event: Event): void {
    if ((event as KeyboardEvent).keyCode !== 9) return
    lastTabPressTime = new Date().getTime()
  }

  function addFocusEvent(slide: HTMLElement, index: number): void {
    const focus = (): void => {
      const nowTime = new Date().getTime()
      const diffTime = nowTime - lastTabPressTime
      if (diffTime > 10) return

      root.scrollLeft = 0
      const selectedIndex = Math.floor(index / slidesToScroll)
      scrollTo.index(selectedIndex, 0)
    }
    eventStore.add(slide, 'focus', focus, true)
  }

  function addActivationEvents(slides: HTMLElement[]): void {
    eventStore.add(document, 'keydown', registerTabPress, false)
    slides.forEach(addFocusEvent)
  }

  const self: SlideFocus = {
    addActivationEvents,
    removeAllEvents,
  }
  return self
}
