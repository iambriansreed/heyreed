const apiUrl = 'https://api.heyreed.com';

const cachedResults: Record<string, any> = {};

const cacheFetch = async (url: string, options?: RequestInit) => {
    if (!(url in cachedResults)) {
        try {
            const response = await (await fetch(url, options)).json();

            cachedResults[url] = response.error ? null : response;
        } catch {
            cachedResults[url] = null;
        }
    }

    return cachedResults[url];
};

export async function codeLookup(code: string): Promise<{
    code: string;
    result: any;
}> {
    return {
        code,
        result: code.length !== 4 ? null : await cacheFetch(`${apiUrl}/rsvp-check?id=${code}`),
    };
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
        const response = await fetch(`${apiUrl}/rsvp-submit`, {
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
    return await fetch(`${apiUrl}/rsvp-song`, {
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
