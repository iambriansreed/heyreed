import { generateSVGs, qS, toggle, on } from './utils';
import './main.scss';
import svgs from './svgs';

const toNumber = (value: string | null | undefined): number | null => {
    const str = value?.replace(/\D/g, '');
    return str?.length ? Number(str) : null;
};

customElements.define(
    'a-modal',
    class extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            this.innerHTML = `
<div class="backdrop" data-close></div>
<div class="body">
    <button type="button" class="close" data-close>&#x2715;</button>
    ${this.innerHTML}
</div>`;

            this.style.display = 'none';

            this.querySelectorAll('[data-close]').forEach((el) =>
                on(el, 'click', () => {
                    toggle(this, false);
                })
            );

            on(this, 'hide', () => {
                document.body.classList.remove('modal-open');
            });

            on(this, 'show', () => {
                document.body.classList.add('modal-open');
            });
        }
    }
);

customElements.define(
    'search-input',
    class extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            this.innerHTML =
                this.innerHTML +
                `<div class="loader"><div class="loading-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div></div>`;

            const input = this.querySelector('input')!;

            const pattern = input.getAttribute('pattern');
            const maxlength = toNumber(input.getAttribute('maxlength'));

            if (pattern)
                on(input, 'keydown', async (e: KeyboardEvent) => {
                    if (!new RegExp(pattern).test(e.key)) {
                        e.preventDefault();
                        return;
                    }

                    if (maxlength !== null && input.value.length > maxlength) {
                        e.preventDefault();
                        return;
                    }
                });
        }
    }
);

generateSVGs(svgs);

document.addEventListener('DOMContentLoaded', function onLoad() {
    const isApple = /iPad|iPhone|iPod|Mac OS/.test(navigator.userAgent);

    if (isApple)
        qS('#map-link')?.setAttribute('href', 'https://maps.apple.com/?q=2513+Shorehaven+Drive+23454');

    on(window, 'scroll', () => {
        const header = qS('#header')!;
        toggle(header, window.innerHeight / 2 < window.scrollY);
    });

    // [...document.forms].forEach((form) => {
    //     form.onsubmit = (e) => {
    //         const formData = new FormData(form);
    //         e.preventDefault();
    //         form.classList.add('submitted');
    //         console.log(...formData);
    //     };
    // });

    // const rsvpContainer = qS('#rsvp')!;

    // function setStatus(status: string) {
    //     const [name, value] = status!.split('-');
    //     rsvpContainer.dataset[name] = value;
    // }

    // qA('[data-go]').forEach((el) => {
    //     on(el, 'click', () => {
    //         setStatus(el.dataset.go!);
    //     });
    // });

    // on(rsvpContainer, 'click', (e) => {
    //     if (!rsvpContainer.classList.contains('busy')) {
    //         return;
    //     }
    //     e.preventDefault();
    //     return;
    // });

    // const responseForm = document.forms.namedItem('response')!;

    // const responseFormOnUpdate = () => {
    //     guestsInput.forEach((el) => {
    //         el.required = responseForm['attending'].value === 'yes';
    //     });

    //     toggle('[data-group="attending-fields"]', responseForm['attending'].value === 'yes');
    // };

    // const guestsInput = qA<HTMLInputElement>('[name="guests"]');

    // const codeFormField = qS<HTMLElement>('#code fieldset')!;
    // const codeFormInput = qS<HTMLInputElement>('#code input')!;

    // if (window.location.pathname.match(/\/[\d]+/)) {
    //     window.location.hash = 'rsvp';
    //     const code = window.location.pathname.substring(1);
    //     codeFormInput.value = code;
    //     setTimeout(() => {
    //         codeFormInput.dispatchEvent(new Event('input', { bubbles: true }));
    //     }, 500);
    // }

    // on(codeFormInput, 'input', async () => {
    //     const value = codeFormInput.value;

    //     codeFormInput.classList.remove('loading');
    //     codeFormField.classList.remove('hasError');

    //     if (value.length !== 4) {
    //         return;
    //     }

    //     codeFormInput.classList.add('loading');
    //     const response = await codeLookup(codeFormInput.value);
    //     codeFormInput.classList.remove('loading');

    //     if (response.code !== codeFormInput.value) return;

    //     if (!response.result) {
    //         codeFormField.classList.add('hasError');
    //         return;
    //     }

    //     window.location.href = '#rsvp';

    //     setStatus('code-success');

    //     const { name, email, message, song, song_id, guests, estimated_guests, attending, code } =
    //         response.result;

    //     qS('[data-name-display] span')!.innerText = name;

    //     qS<HTMLInputElement>('[name="code"]')!.value = code || '';
    //     qS<HTMLInputElement>('[name="email"]')!.value = email || '';
    //     qS<HTMLInputElement>('[name="message"]')!.value = message || '';
    //     qS<HTMLInputElement>('[name="name"]')!.value = name || '';
    //     qS<HTMLInputElement>('[name="song"]')!.value = song || '';
    //     qS<HTMLInputElement>('[name="song_id"]')!.value = song_id || '';

    //     const guestCount = guests || estimated_guests;
    //     const guestRadio = qS<HTMLInputElement>(`[name="guests"][value="${guestCount}"]`);
    //     if (guestRadio) guestRadio.checked = true;

    //     const attendingRadio = qS<HTMLInputElement>(`[name="attending"][value="${attending}"]`);
    //     if (attendingRadio) attendingRadio.checked = true;

    //     responseFormOnUpdate();
    // });

    // on(responseForm, 'change', responseFormOnUpdate);

    // on(responseForm, 'submit', (e) => {
    //     e.preventDefault();

    //     responseForm.classList.add('submitted');

    //     if (!responseForm.checkValidity()) {
    //         return;
    //     }

    //     const formData: any = Object.fromEntries(new FormData(responseForm));

    //     rsvpContainer.classList.add('busy');

    //     submitRSVP(formData).then((response) => {
    //         rsvpContainer.classList.remove('busy');

    //         setStatus(response?.error ? 'submit-error' : 'submit-success');
    //         console.log(response);
    //     });
    // });

    // // song search
    // (() => {
    //     const openSpotify = qS('[data-open-spotify]')!;

    //     on(openSpotify, 'click', () => {
    //         toggle('#spotify', true);
    //         qS('#spotify input')?.focus();
    //     });

    //     on(openSpotify, 'keydown', (e) => {
    //         e.preventDefault();
    //         toggle('#spotify', true);
    //         qS('#spotify input')?.focus();
    //     });

    //     let debouncedTimeout: ReturnType<typeof setTimeout>;
    //     let results: { name: string; artist: string; id: string }[] = [];
    //     let resultsCancelled = false;

    //     const resultsContainer = qS('#spotify .results')!;
    //     const searchInput = qS<HTMLInputElement>('#song-search-input')!;
    //     const instructions = qS('#spotify .instructions')!;
    //     const noResults = qS('#spotify .no-results')!;

    //     on(searchInput, 'input', () => {
    //         handleSearch(searchInput.value.toLowerCase());
    //     });

    //     on(resultsContainer, 'click', (e) => {
    //         const button = (e.target as HTMLElement).closest('button');
    //         if (!button) return;

    //         const { name, artist, id } = results[Number(button.value)];
    //         qS<HTMLInputElement>('#song')!.value = `${name} by ${artist}`;
    //         qS<HTMLInputElement>('#song_id')!.value = id;

    //         toggle('#song-select-description', false);
    //         toggle('#song-select-selected', true);

    //         toggle('#spotify', false);
    //     });

    //     function handleSearch(search: string) {
    //         clearTimeout(debouncedTimeout);

    //         if (search.length < 3) {
    //             results = [];
    //             resultsContainer.innerHTML = '';
    //             toggle(instructions, false);
    //             toggle(noResults, false);
    //             resultsCancelled = true;
    //             searchInput?.classList.toggle('loading', false);
    //             return;
    //         }

    //         resultsCancelled = false;
    //         searchInput?.classList.toggle('loading', true);

    //         debouncedTimeout = setTimeout(async () => {
    //             if (resultsCancelled) return;
    //             const code = qS<HTMLInputElement>('[name="code"]')?.value || '';
    //             results = await getSongResults(code, search);
    //             searchInput?.classList.toggle('loading', false);

    //             resultsContainer.innerHTML = results
    //                 .map(
    //                     (result, i) => `
    //                 <button type="button" value="${i}">
    //                     <p>${result.name}</p>
    //                     <p>${result.artist}</p>
    //                 </button>`
    //                 )
    //                 .join('');

    //             toggle(instructions, !!results?.length);

    //             toggle(noResults, !results?.length);
    //         }, 500);
    //     }
    // })();

    return;
});
