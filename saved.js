let accessToken;

function getAccessToken() {
    const clientId = '99290df53a324173a5f9f96f5c0634f2';
    const clientSecret = '1a0f733ffbe442c69928013bfa0f6147';

    // Spotify API endpoint for obtaining an access token
    const tokenEndpoint = 'https://accounts.spotify.com/api/token';

    // Form data for the request
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);

    // Make a POST request to obtain the access token
    axios.post(tokenEndpoint, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then(response => {
            accessToken = response.data.access_token;
        })
        .catch(error => {
            console.error('Error obtaining access token:', error.response ? error.response.data : error.message);
        });
}

getAccessToken();

document.addEventListener('DOMContentLoaded', () => {
    const savedTracksContainer = document.getElementById('saved-tracks');

    // Retrieve saved tracks from local storage
    const savedTracks = JSON.parse(localStorage.getItem('savedTracks')) || [];

    if (savedTracks.length === 0) {
        savedTracksContainer.innerHTML = '<p class="no-tracks">No tracks saved yet.</p>';
    } else {
        savedTracks.forEach(savedTrack => {
            const savedTrackCard = createSavedTrackCard(savedTrack);
            savedTracksContainer.appendChild(savedTrackCard);

            // Add click event listener to each saved track card
            savedTrackCard.addEventListener('click', () => {
                showSavedTrackDetails(savedTrack);
            });
        });
    }

    // Add a button to generate recommendations based on saved tracks
    const recommendButton = document.createElement('button');
    recommendButton.textContent = 'Generate Recommendations';
    recommendButton.addEventListener('click', () => {
        generateRecommendations(savedTracks);
    });

    savedTracksContainer.appendChild(recommendButton);
});

function generateRecommendations(savedTracks) {
    if (savedTracks.length === 0) {
        alert('No saved tracks to generate recommendations.');
        return;
    }

    // Extract track IDs from all saved tracks
    const seedTracks = savedTracks.map(savedTrack => savedTrack.id);

    // Make a request to Spotify API's recommendations endpoint using all seed tracks
    fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${seedTracks.join(',')}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken, // Replace with your actual access token
            },
        })
        .then(response => response.json())
        .then(data => {
            displayRecommendations(data.tracks);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayRecommendations(recommendedTracks) {
    // Save recommended tracks to local storage for access in the recommendations page
    localStorage.setItem('recommendedTracks', JSON.stringify(recommendedTracks));

    // Redirect to the recommendations page
    window.location.href = 'recommendations.html';
}

function createSavedTrackCard(savedTrack) {
    const trackCard = document.createElement('div');
    trackCard.classList.add('track-card');

    const albumArt = document.createElement('img');
    albumArt.src = savedTrack.albumArt || 'placeholder-image.jpg';
    albumArt.alt = 'Album Art';
    albumArt.classList.add('album-art');

    const trackDetails = document.createElement('div');
    trackDetails.classList.add('track-details');

    const trackName = document.createElement('h3');
    trackName.textContent = savedTrack.name;

    const artistName = document.createElement('p');
    artistName.textContent = `Artist(s): ${savedTrack.artists}`;

    const albumName = document.createElement('p');
    albumName.textContent = `Album: ${savedTrack.album}`;

    const releaseDate = document.createElement('p');
    releaseDate.textContent = `Release Date: ${savedTrack.releaseDate}`;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
        removeSavedTrack(savedTrack.id);
        // After removing the track, refresh the page to reflect the changes
        location.reload();
    });

    trackDetails.appendChild(trackName);
    trackDetails.appendChild(artistName);
    trackDetails.appendChild(albumName);
    trackDetails.appendChild(releaseDate);

    trackCard.appendChild(albumArt);
    trackCard.appendChild(trackDetails);
    trackCard.appendChild(removeButton);

    return trackCard;
}

function removeSavedTrack(trackId) {
    // Retrieve saved tracks from local storage
    const savedTracks = JSON.parse(localStorage.getItem('savedTracks')) || [];

    // Filter out the track with the specified ID
    const updatedSavedTracks = savedTracks.filter(savedTrack => savedTrack.id !== trackId);

    // Save the updated savedTracks array to local storage
    localStorage.setItem('savedTracks', JSON.stringify(updatedSavedTracks));
}
function showSavedTrackDetails(savedTrack) {
   const modal = document.createElement('div');
   modal.classList.add('modal');

   const modalContent = document.createElement('div');
   modalContent.classList.add('modal-content');

   const albumArt = document.createElement('img');
   albumArt.src = savedTrack.albumArt || 'placeholder-image.jpg';
   albumArt.alt = 'Album Art';
   albumArt.classList.add('album-art');

   const audioPreview = document.createElement('audio');
   audioPreview.controls = true;

   // Check if preview_url is available before setting it as the source
   if (savedTrack.preview_url) {
       audioPreview.src = savedTrack.preview_url;
   } else {
       audioPreview.innerHTML = 'No preview available';
   }

   const detailsMessage = `
       <h2>${savedTrack.name}</h2>
       <p>Artist(s): ${savedTrack.artists}</p>
       <p>Album: ${savedTrack.album}</p>
       <p>Release Date: ${savedTrack.releaseDate}</p>
   `;

   modalContent.appendChild(albumArt);
   modalContent.appendChild(audioPreview);
   modalContent.innerHTML += detailsMessage;

   const viewOnSpotifyButton = document.createElement('button');
   viewOnSpotifyButton.textContent = 'View on Spotify';
   viewOnSpotifyButton.addEventListener('click', () => {
       viewOnSpotify(savedTrack.external_urls.spotify);
   });

   const closeModalButton = document.createElement('button');
   closeModalButton.textContent = 'Close';
   closeModalButton.addEventListener('click', () => {
       modal.remove();
   });

   modalContent.appendChild(viewOnSpotifyButton);
   modalContent.appendChild(closeModalButton);
   modal.appendChild(modalContent);

   document.body.appendChild(modal);
}

function viewOnSpotify(url) {
    // Open the Spotify link in a new tab or window
    window.open(url, '_blank');
}
