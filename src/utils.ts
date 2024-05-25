const elements: Record<string, HTMLElement | HTMLElement[] | null> = {};

/**
 * document.querySelector with typing and caching
 * @param selector
 * @returns HTMLElement
 */
export function qS<TElement extends HTMLElement = HTMLElement>(selector: string) {
    if (!selector) return new HTMLElement() as TElement;

    if (!elements[selector]) elements[selector] = document.querySelector<TElement>(selector);
    return elements[selector] ? (elements[selector] as TElement) : null;
}

/**
 * document.querySelectorAll with typing, caching, and array return
 * @param selector
 * @returns Array of elements
 */
export function qA<TElement extends HTMLElement = HTMLElement>(selector: string) {
    if (!selector) return [new HTMLElement()] as TElement[];

    if (!elements[selector]) elements[selector] = [...document.querySelectorAll(selector)] as TElement[];
    return elements[selector] as TElement[];
}

export function on<T, E extends Event = Event>(
    selector: string | HTMLElement | Element | Window,
    type: keyof HTMLElementEventMap | T,
    listener: (e: E) => void
) {
    const element = typeof selector === 'string' ? qS(selector) : (selector as HTMLElement);
    if (element) element.addEventListener(type as any, listener as any);
}

export function toggle(selector: string | HTMLElement, show?: boolean) {
    const element = typeof selector === 'string' ? qS(selector) : (selector as HTMLElement);

    if (!element) return null;

    if (typeof show !== 'boolean') show = getComputedStyle(element).display === 'none';

    element.style.display = show ? '' : 'none';

    element.dispatchEvent(new CustomEvent(show ? 'show' : 'hide'));

    return show;
}

export function generateSVGs(set: Record<string, string>) {
    Object.entries(set).forEach(([name, svg]) => {
        customElements.define(
            'svg-' + name,
            class extends HTMLElement {
                constructor() {
                    super();
                }
                connectedCallback() {
                    this.classList.add('svg');
                    this.innerHTML = svg;
                }
            }
        );
    });
}
