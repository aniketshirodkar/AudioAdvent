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
         'Authorization': 'Bearer ' + 'BQDjKoJdbPCoQWrxPmnaUfjkknnYIUgjvi1a8XAHy-9s0Ouowd-0CmsHocO2CU5NNQZP7UeEOLfJY_zc_yPKaVr2HMRwrjwa0AGDCvgqaoHCLUhJB-w', // Replace with your actual access token
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
