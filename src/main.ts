import { codeLookup, getSongResults, submitRSVP } from './api';
import { generateSVGs, qS, qA, toggle, on } from './utils';
import './main.scss';

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
            const minlength = toNumber(input.getAttribute('minlength')) || 3;

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

            on(input, 'input', (e) => {
                const value = (e.target as HTMLInputElement).value;
                const isValid = value.length >= minlength;
                input.classList.toggle('loading', isValid);
                input.dispatchEvent(new CustomEvent(isValid ? 'search' : 'search-cancel'));
            });
        }
    }
);

generateSVGs({
    sad: `<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 467.276 467.276"
    fill="currentColor"
>
    <path d="M379.284 51.144C348.258 24.297 309.568 13.46 269.579 8.672 163.069-25.3 68.062 44.959 26.578 142.38c-44.712 105.002-23.435 222.217 73.516 287.698 98.98 66.846 235.022 39.369 310.942-48.627 82.985-96.177 62.505-248.732-31.752-330.307zM196.853 432.703c-56.157-7.993-110.636-42.543-139.091-91.805-25.438-44.047-25.225-99.203-13.82-147.312 17.527-73.96 70.566-140.71 139.886-156.686.104.005.193.035.297.035 24.943.739 51.291.782 77.045 3.567 2.438.764 4.875 1.523 7.333 2.42 4.058 1.48 7.611 1.29 10.582.071 27.787 4.677 54.319 13.579 76.957 31.392 50.079 39.405 76.479 110.461 75.032 172.696-2.721 117.308-123.1 201.435-234.221 185.622z" />
    <path d="M169.279 211.913c23.28 0 23.28-36.104 0-36.104-23.28-.001-23.28 36.104 0 36.104zM293.832 213.715c23.287 0 23.287-36.102 0-36.102-23.277 0-23.277 36.102 0 36.102zM134.855 300.254c-17.034 15.935 8.549 41.411 25.532 25.527 43.302-40.497 99.102-44.783 142.351-1.803 16.524 16.422 42.062-9.1 25.527-25.532-57.345-56.979-135.789-52.074-193.41 1.808z" />
</svg>`,
    circle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1240 600" fill="currentColor">
    <path d="M460.3 531c-106.7-3.3-217.2-12.7-315.6-56.5C88 448.7 32.7 394.4 37 327.8c3.2-36 29-64 53.5-88.3C191.8 144.2 332.1 108 465.9 86.2c164-25.2 332-22.5 495.8 2.7 15.7.9 175 34.4 136.2 49.7 73.3 30.4 139 103 86.1 181.7-32.6 46.3-85.7 73.2-135.4 97.6C963 457 870.8 479.5 779 498.6c-104.8 21.1-211.5 35-318.5 32.5Zm28.5-16.5c155.2 2.7 623.7-69.6 687.7-223.9 28.8-82.1-66-134.7-132.5-153a1727.2 1727.2 0 0 0-139-33.7c-6.6-1.8-18.7-1-17.8-10.6-216.3-22.4-493-11.6-689 89.6-56.6 31.2-163.8 103-138.7 178.2 13.4 45.7 52 79.2 94 98.8 105 45.6 222.2 53.2 335.3 54.6Z"></path>
</svg>`,

    circle2: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" fill="currentColor">
    <path d="M753.7 376.2c-8-61.2-39.1-117.5-73.6-167.8C607.5 111 479.5 60.9 359.8 78.3c-44 7.4-86.4 24.5-125.2 46.5-44.6 27.8-81.2 68-109.3 112a615 615 0 0 0-74.8 185.7C39.8 464 47 506.8 65.8 544.6c-5.8 4-.5 11.4 2.3 15.9 18.2 33.5 41.2 64.9 71.3 88.7 115.6 90 280.3 96 415 49.6C695 653.3 773.3 521.5 753.8 376.3Zm-239.5 316c-136.6 36.5-312.7 20.6-407.9-94.6 4-2.6 3.8-8.5 1.4-12.2-6.2-9.5-12-19.3-17.4-29.3a281 281 0 0 1-19.7-46.9C48.6 450.9 90.6 351 116 296c32.7-66.4 80.7-129.6 148-163.3a319 319 0 0 1 395.5 76.1c41.3 55 75.8 119.9 78.9 189.7 7.8 149-82 257.8-224.2 293.8Z"></path>
</svg>`,
    search: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
    <path d="M416 208c0 45.9-14.9 88.3-40 122.7l126.6 126.7c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0s208 93.1 208 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
</svg>`,
    send: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 -10.03 112 112">
  <path id="paper-plane" d="M474.5,187.338c.341,1.637,1.09,2.864.989,4.941-.746.244-.131,1.847-.329,2.631-.509.482-.29,1.689-.328,2.635-.744.247-.13,1.849-.332,2.635-.78.205.05,2.026-.659,2.3.12,1.984-.775,2.955-.655,4.939-.719,1.261-.829,3.126-1.32,4.609-.272,1.592-.933,2.8-.987,4.61-.821,1.156-.6,3.354-1.316,4.61.042,1.906-.623,3.11-.661,4.938-1.015,6.772-2.116,13.468-3.62,19.755-1.048,6.633-2.014,13.348-4.939,18.108-.569,1.12.252,1.93,0,3.621-.624.693-1.893.739-2.306,1.646-.785.418-1.211,1.2-2.634.988-2.112.249-2.379-1.351-3.618-1.976-.572-1.184-1.875-1.639-2.636-2.633-2.2-.982-4.011-2.355-6.255-3.293a65.362,65.362,0,0,0-6.586-2.964c-4.168-2.194-8.9-3.828-13.168-5.925-1.723.473-2.171,2.218-3.621,2.962-1.038,1.051-1.719,2.455-2.964,3.292a66.934,66.934,0,0,1-6.257,6.256c-.52,1.455-1.636,2.313-2.3,3.621-.594,1.275-1.785,1.95-2.308,3.293-2.169,1.561-2.939,4.524-7.241,3.951-.83-.926-2.337-1.175-1.976-3.291v-4.94c-.215-3.5.57-6.016.328-9.549.247-6.339.837-12.333,1.32-18.436.19-1.289-1.355-.84-1.648-1.647-.826-.271-1.29-.9-2.307-.987-1.05-1.035-2.9-1.268-3.947-2.3-3.415-.869-5.784-2.779-9.219-3.622-2.721-1.562-6.37-2.193-8.891-3.951-2.8-1.481-6.542-2.017-8.558-4.279-.3-1.832.768-2.3,1.646-2.965a3.142,3.142,0,0,1,2.961-1.645c.841-.693,2.56-.514,3.3-1.317a11.339,11.339,0,0,0,3.289-.988c4.939-.987,8.687-3.168,13.827-3.951.734-.8,2.453-.623,3.293-1.317,1.424,0,2.093-.764,3.623-.658,1.84-1.123,4.8-1.127,6.583-2.3a35.973,35.973,0,0,0,6.916-1.976,32.507,32.507,0,0,0,3.619-.987c1.037-.389,2.487-.37,3.294-.988,4.866-1.06,9.037-2.817,13.5-4.279,4.693-1.233,8.425-3.425,13.168-4.611,1.937-1.024,4.31-1.616,6.255-2.633,2.436-.526,4.2-1.724,6.584-2.3a30.249,30.249,0,0,1,6.257-2.634c.68-.857,2.129-.945,2.961-1.647,1.035-.392,1.744-1.112,2.964-1.317.533.093.566-.311.99-.329C470.385,185.967,473.291,185.808,474.5,187.338Zm-6.915,12.183a20.691,20.691,0,0,0-2.3,2.634c-.618.681-2.607,2.462-2.632,2.964-.036.636-.745.72-.99.987-.958,1.049-1.457,1.994-2.3,2.962-.455.525-1.149.616-1.318,1.318-3.382,3.53-6.31,7.517-9.874,10.866-3.054,3.861-6.725,7.1-9.549,11.2-1.663,1.737-2.877,3.927-4.611,5.6-1.083,2.433-3.813,3.21-4.607,5.927.656,2.085,1.665,3.821,2.3,5.926,1.877.433,3.146,1.465,4.94,1.976,1-.428.773-2.082,2.635-1.647.982.664.844,2.448,1.315,3.621,2.728.676,4.474,2.332,7.244,2.964a12.052,12.052,0,0,0,3.294,1.976c1.16.6,1.909,1.6,3.293,1.974a54.392,54.392,0,0,0,2.3-12.511,8.069,8.069,0,0,0,1.644-2.962,228.328,228.328,0,0,0,4.284-23.049c1.142-8.073,3.661-14.773,5.266-22.387C467.943,199.715,467.813,199.373,467.587,199.521Zm-10.2,1.975c-2.19.553-3.185,2.3-5.269,2.963-1.32,1.316-3.324,1.949-4.611,3.293-1.916.719-3.3,1.965-4.938,2.963a8.291,8.291,0,0,1-2.3,1.647c-.862.454-1.132,1.5-2.3,1.646a23.426,23.426,0,0,1-4.607,3.62,30.113,30.113,0,0,1-4.285,3.624c-2.833,2.433-5.7,4.835-8.557,7.243-.794.415-1.991.423-2.635.986-2.215,1.846-4.05,4.069-6.253,5.928-1.254.723-2.718,1.234-3.622,2.3-1.276.7-3.088.864-3.953,1.977-1.364,3.392-.617,7.441-1.316,11.851v11.2c.315,1.109-1.007,2.249,0,2.963.66-1.046,1.2-2.218,1.973-3.293.086-.115.613-.229.662-.329.066-.156-.107-.53,0-.659.52-.65,1.361-.943,1.973-1.647.521-.592.817-1.479,1.317-1.974.352-.345.983-.372,1.317-.657,1.719-1.476,3.384-4.367,5.268-6.257,1.638.321,1.962-.673,2.961-.988,3.46-3.9,5.453-9.256,9.224-12.838.391-1.475,1.8-1.931,2.3-3.3,1.25-.505,1.384-2.127,2.634-2.633.853-1.011,1.434-2.3,2.635-2.963.524-1.231,2.046-1.464,2.3-2.962,7.331-7.263,13.323-15.869,20.084-23.707C457.859,201.295,457.347,201.1,457.384,201.5Zm-17.122,2.963c-1.96.268-3.728,1.306-5.6,1.977-1.8.644-3.792,1.048-5.6,1.646-.111.038,0,.311-.327.329-.516.028-.583.2-.986.329-1.394.445-2.677.8-4.283,1.317a21.015,21.015,0,0,0-5.269,1.975c.761.669.887,1.971.989,3.293-.234,2.178.138,4.965-2.3,4.938-2.883-.409-2.249-4.333-2.3-7.573-1.234.3-2.328.746-3.621.989v7.242a15.541,15.541,0,0,0,1.644,5.6c1.543-.544,2.331-1.841,3.623-2.633a35.7,35.7,0,0,0,3.294-2.965c2.423-1.747,4.539-3.8,6.91-5.6,4.355-3.88,9.2-7.262,13.831-10.866C440.741,204.258,440.227,204.064,440.262,204.459Zm-31.608,23.706c-.191-.685-.692-1.066-.989-1.646-.947-3.338-.046-7.4,0-11.525-.07-.255-.273-.381-.657-.327-1.315.882-3.325,1.062-4.939,1.644a20.427,20.427,0,0,0,.333,5.269c-.055,4.443-.286,9.062,2.3,10.867,2.119-.736,3.2-2.51,5.269-3.3C410.074,228.285,409.284,228.3,408.654,228.165Zm-10.2-10.537c-.074-.255-.276-.381-.66-.327a13.088,13.088,0,0,1-4.935,1.316c1.268,3.558,1.18,8.476,2.3,12.182,1.253.505,2.188,1.325,3.624,1.648C397.526,228.465,398.221,222.167,398.449,217.628Zm-11.523,2.635v5.927c.865,1.66,2.9,2.152,4.606,2.962a82.457,82.457,0,0,1,.331-9.876C389.758,219.148,388.845,220.209,386.926,220.263Zm-7.244,1.647c-.773.874-3.033.259-3.622,1.317,2.728.454,4.557,1.807,7.243,2.3-.192-1.727.579-2.492.331-4.279C381.985,221.139,381.332,222.022,379.682,221.91Zm46.094,25.351c1.009.086,1.48.714,2.3.987.072-1.059-.581-1.393-.327-2.634C426.659,245.731,426.323,246.6,425.776,247.261Z" transform="translate(-363.5 -185.035)" fill-rule="evenodd"/>
</svg>`,
});

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

    const rsvpContainer = qS('#rsvp')!;

    function statusGo(status: string) {
        const [name, value] = status!.split('-');
        rsvpContainer.dataset[name] = value;
    }

    qA('[data-go]').forEach((el) => {
        on(el, 'click', () => {
            statusGo(el.dataset.go!);
        });
    });

    on(rsvpContainer, 'click', (e) => {
        if (!rsvpContainer.classList.contains('busy')) {
            return;
        }
        e.preventDefault();
        return;
    });

    // code
    (() => {
        const codeForm = qS('#code')!;
        const fieldset = codeForm.querySelector<HTMLElement>('fieldset')!;
        const input = fieldset.querySelector<HTMLInputElement>('input')!;

        on(input, 'search', async () => {
            input.classList.toggle('loading', true);
            const codeResult = await codeLookup(input.value);
            input.classList.toggle('loading', false);

            fieldset.classList.toggle('hasError', !codeResult);

            if (codeResult) {
                window.location.href = '#rsvp';

                statusGo('code-success');

                qS('[data-name-display] span')!.innerText = codeResult.name;

                Object.entries(codeResult).forEach(([key, value]) => {
                    if (key === 'guests') return;
                    const el = qS<HTMLInputElement>(`[name="${key}"]`);
                    if (el) el.value = value as string;
                });

                const guestCount = codeResult.guests || codeResult.estimated_guests;
                const guests = qS<HTMLInputElement>(`[name="guests"][value="${guestCount}"]`);
                if (guests) guests.checked = true;
            }
        });
    })();

    // response
    (() => {
        const responseForm = document.forms.namedItem('response')!;

        const guestsInput = qA<HTMLInputElement>('[name="guests"]');

        on(responseForm, 'change', function (event) {
            if ((event.target as HTMLInputElement)?.name === 'attending') {
                guestsInput.forEach((el) => {
                    el.required = responseForm['attending'].value === 'yes';
                });
                toggle('[data-group="attending-fields"]', responseForm['attending'].value === 'yes');
            }
        });

        on(responseForm, 'submit', (e) => {
            e.preventDefault();

            responseForm.classList.add('submitted');

            if (!responseForm.checkValidity()) {
                return;
            }

            const formData: any = Object.fromEntries(new FormData(responseForm));

            rsvpContainer.classList.add('busy');

            submitRSVP(formData).then((response) => {
                rsvpContainer.classList.remove('busy');

                statusGo(response?.error ? 'submit-error' : 'submit-success');
                console.log(response);
            });
        });
    })();

    // song search
    (() => {
        const openSpotify = qS('[data-open-spotify]');

        on(openSpotify, 'click', () => {
            toggle('#spotify', true);
            qS('#spotify input')?.focus();
        });

        on(openSpotify, 'keydown', (e) => {
            e.preventDefault();
            toggle('#spotify', true);
            qS('#spotify input')?.focus();
        });

        let debouncedTimeout: ReturnType<typeof setTimeout>;
        let results: { name: string; artist: string; id: string }[] = [];
        let resultsCancelled = false;

        const resultsContainer = qS('#spotify .results');
        const searchInput = qS<HTMLInputElement>('#song-search-input');
        const instructions = qS('#spotify .instructions');
        const noResults = qS('#spotify .no-results');

        on(searchInput, 'search', () => {
            handleSearch(searchInput.value.toLowerCase());
        });

        on(resultsContainer, 'click', (e) => {
            const button = (e.target as HTMLElement).closest('button');
            if (!button) return;

            const { name, artist, id } = results[Number(button.value)];
            qS<HTMLInputElement>('#song').value = `${name} by ${artist}`;
            qS<HTMLInputElement>('#song_id').value = id;

            toggle('#song-select-description', false);
            toggle('#song-select-selected', true);

            toggle('#spotify', false);
        });

        function handleSearch(search: string) {
            clearTimeout(debouncedTimeout);

            if (search.length < 3) {
                results = [];
                resultsContainer.innerHTML = '';
                toggle(instructions, false);
                toggle(noResults, false);
                resultsCancelled = true;
                searchInput?.classList.toggle('loading', false);
                return;
            }

            resultsCancelled = false;
            searchInput?.classList.toggle('loading', true);

            debouncedTimeout = setTimeout(async () => {
                if (resultsCancelled) return;
                const code = qS<HTMLInputElement>('[name="code"]').value;
                results = await getSongResults(code, search);
                searchInput?.classList.toggle('loading', false);

                resultsContainer.innerHTML = results
                    .map(
                        (result, i) => `
                    <button type="button" value="${i}">
                        <p>${result.name}</>
                        <p>${result.artist}</p>
                    </button>`
                    )
                    .join('');

                toggle(instructions, !!results?.length);

                toggle(noResults, !results?.length);
            }, 1000);
        }
    })();

    return;
    setTimeout(function test() {
        const actions = [
            () => {
                qS('#rsvp').scrollIntoView();
            },
            () => qA('[data-toggle-code]')[0].click(),
            () => qS('[value="yes"]').click(),
            () => qS('#song').click(),
        ];
        const int = setInterval(() => {
            if (actions.length) actions.shift()!();
            else {
                clearInterval(int);
                console.log('test done');
            }
        }, 500);
    }, 1000);
});
