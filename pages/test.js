import { useState } from 'react';
import Script from 'next/script';

export default function Home() {
    const [token, setToken] = useState(null);

    // Callback function when Turnstile generates a token
    const handleTurnstileToken = (newToken) => {
        setToken(newToken);
    };

    // Function to call an API route
    const handleSubmit = async () => {
        if (!token) {
            alert("Please complete the CAPTCHA first.");
            return;
        }

        const response = await fetch('/api/protected', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Turnstile-Token': token,
            },
        });

        const data = await response.json();
        console.log(data);
        if (data.success) {
            alert("Verification successful!");
        } else {
            alert("Verification failed.");
        }
    };

    return (
        <>
            <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                onLoad={() => {
                    window.turnstile?.render('#turnstile-widget', {
                        sitekey: "0x4AAAAAAAzbUXu9tBbouE2A",
                        callback: handleTurnstileToken,
                    });
                }}
            />
            <div>
                <div id="turnstile-widget"></div>
                <button onClick={handleSubmit} disabled={!token}>
                    Submit
                </button>
            </div>
        </>
    );
}
