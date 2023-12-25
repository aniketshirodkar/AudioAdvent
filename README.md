# Audio Advent

This web application recommends songs for users based on their favorite tracks.

## Features

- **Home Page (`index.html`):**
  - Search, preview, and save tracks.

- **Saved Tracks Page (`saved.html`):**
  - View and manage saved tracks.
  - Generate recommendations dynamically using the Spotify API.

- **Recommended Tracks Page (`recommendations.html`):**
  - View recommended tracks based on saved tracks.

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/aniketshirodkar/AudioAdvent.git
   
2. **Obtain Spotify API credentials:**
   - Create a [Spotify Developer account](https://developer.spotify.com/) and create a new application.
   - Replace `clientId` and `clientSecret` in `saved.js` and `script.js` with your own credentials.
  
3. **Open the index.html file in a web browser.**

# Usage

- **Home Page:**
  - Enter your favorite song titles in the search bar and click "Search."
  - Preview tracks or view them on spotify
  - Save tracks
  - Generate recommendations based on your saved tracks

# Dependencies

- **Axios:** A promise-based HTTP client for making requests.

