import { NextResponse } from 'next/server';


export async function GET(request, { params }) {
    
    const pathSegments = params.path || [];


    if (pathSegments.length === 0) {

        console.error('API Route Error: pathSegments array is empty. Check context.params.');
        return NextResponse.json({ message: 'API endpoint not specified' }, { status: 400 });
    }

    const apiPath = pathSegments.join('/');   // Reconstructs to 'search/collection'

    const queryString = request.nextUrl.search;

    // --- TMDB API CONFİGURATİON ---
    const API_BASE_URL = "https://api.themoviedb.org/3";
    const accessToken = process.env.TMDB_ACCESS_TOKEN;

    // Validate Access Token (Good practice)
    if (!accessToken) {
        console.error("API Route Error: Fetching data is failed.")
        return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
    }

    // Construct the target API URL
    const targetUrl = `${API_BASE_URL}/${apiPath}${queryString}`;

    try {
        const apiResponse = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                Authorization: ` Bearer ${accessToken} `,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            // Caching Strategy (important!)
            cache: 'default'
        });

        // Check if the API request was successful
        if (!apiResponse.ok) {
            // Declare errorDetails *before* trying to read the body
            let errorDetails = `Status: ${apiResponse.status}, StatusText: ${apiResponse.statusText}. Failed to read response body.`; // Default message

            try {
                const errorData = await apiResponse.json();
                errorDetails = errorData.status_message || JSON.stringify(errorData);
            } catch (e) {
                // If JSON parsing fails, try to read as text
                try {
                    const errorText = await apiResponse.text();
                    // Only assign if text is not empty, otherwise keep the default
                    if (errorText) {
                        errorDetails = errorText;
                    }

                } catch (textErr) {
                    // Log if reading text also fails, errorDetails keeps the default message
                    console.error("API Route: Failed to read error response body as text:", textErr);

                }
            }

            // Now errorDetails is guaranteed to be defined here
            console.error(`API Route: TMDB API Error for ${targetUrl}: ${errorDetails}`);

            return NextResponse.json(
                { message: 'Failed to fetch data from external API.', details: errorDetails },
                { status: apiResponse.status }
            );
        }


        // -- Parse the successfull JSON response from API
        const data = await apiResponse.json()

        // Return the data
        return NextResponse.json(data);


    } catch (error) {
        // Handle network errors or other issues during the fetch process itself
        console.error(`API Route: Network or fetch error for ${targetUrl}:`, error); // Log the actual error object
        return NextResponse.json(
            // Send a more informative message if possible, but avoid leaking sensitive details
            { message: 'Internal Server Error while contacting external API.', details: error.message || 'Unknown fetch error' },
            { status: 500 }
        );
    }
};