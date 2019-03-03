import 'whatwg-fetch';

export async function getDetailsFeed() {
    const formData = new FormData();
    formData.append('querystring', window.location.search);
    const data = {
        querystring: window.location.search
    };
    return sendPostRequest(
        `/~/sxa-peanuts/details-feed`,
        formData,
        true
    );
}

/**
 * Send a HTTP POST request
 * same as Get request
 *
 * @param {string} url
 * @param {Object|[]} body
 * @param {boolean} parseJson
 */
export async function sendPostRequest(url, body, parseJson = true) {
    try {
        const requestHeaders = {
            Accept: 'application/json',
        };
        if (!(body instanceof FormData)) {
            requestHeaders['Content-Type'] = 'application/json';
        }
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: new Headers(requestHeaders),
            body: body instanceof FormData ? body : JSON.stringify(body),
        });

        if (parseJson) {
            if (response.status === 200) {
                return response.json();
            } else if (response.headers.get('redirect-url')) {
                window.location = response.headers.get('redirect-url');
            } else {
                throw response;
            }
        } else if (response.headers.get('redirect-url')) {
            window.location = response.headers.get('redirect-url');
        }
        return response;
    } catch (error) {
        console.error('Something went wrong', error);
        throw error;
    }
}