export function codeLookup(code: string) {
    if (code.length !== 6) return null;

    return fetch(`https://api.heyreed.com/rsvp-check?id=${code}`)
        .then(async (response) => response?.json())
        .then((json) => (json.error ? null : json))
        .catch(() => null);
}

export async function submitRSVP(formData: {
    attending: 'yes' | 'no';
    code: string;
    email: string;
    guests: string;
    message: string;
    name: string;
    song: string;
    song_id: string;
}) {
    try {
        const response = await fetch('https://api.heyreed.com/rsvp-submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const json = await await response?.json();
        return json;
    } catch {
        return null;
    }
}

export async function getSongResults(
    code: string,
    query: string
): Promise<{ name: string; artist: string; id: string }[]> {
    return await fetch('https://api.heyreed.com/rsvp-song', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            code,
            query,
        }),
    })
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
            return json;
        })
        .catch(() => []);
}
