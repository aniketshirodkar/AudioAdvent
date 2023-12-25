document.addEventListener('DOMContentLoaded', () => {
   const recommendedTracksContainer = document.getElementById('recommended-tracks');

   // Retrieve recommended tracks from local storage
   const recommendedTracks = JSON.parse(localStorage.getItem('recommendedTracks')) || [];

   if (recommendedTracks.length === 0) {
       recommendedTracksContainer.innerHTML = '<p class="no-tracks">No recommended tracks available.</p>';
   } else {
       recommendedTracks.forEach(recommendedTrack => {
           const recommendedTrackCard = createRecommendedTrackCard(recommendedTrack);
           recommendedTracksContainer.appendChild(recommendedTrackCard);

           // Add click event listener to each recommended track card
           recommendedTrackCard.addEventListener('click', () => {
               showRecommendedTrackDetails(recommendedTrack);
           });
       });
   }
});

function createRecommendedTrackCard(recommendedTrack) {
   const trackCard = document.createElement('div');
   trackCard.classList.add('track-card');

   const albumArt = document.createElement('img');
   albumArt.src = recommendedTrack.album.images.length > 0 ? recommendedTrack.album.images[0].url : 'placeholder-image.jpg';
   albumArt.alt = 'Album Art';
   albumArt.classList.add('album-art');

   const trackDetails = document.createElement('div');
   trackDetails.classList.add('track-details');

   const trackName = document.createElement('h3');
   trackName.textContent = recommendedTrack.name;

   const artistName = document.createElement('p');
   artistName.textContent = `Artist(s): ${recommendedTrack.artists.map(artist => artist.name).join(', ')}`;

   const albumName = document.createElement('p');
   albumName.textContent = `Album: ${recommendedTrack.album.name}`;

   const releaseDate = document.createElement('p');
   releaseDate.textContent = `Release Date: ${recommendedTrack.album.release_date}`;

   trackDetails.appendChild(trackName);
   trackDetails.appendChild(artistName);
   trackDetails.appendChild(albumName);
   trackDetails.appendChild(releaseDate);

   trackCard.appendChild(albumArt);
   trackCard.appendChild(trackDetails);

   return trackCard;
}

function showRecommendedTrackDetails(recommendedTrack) {
   const modal = document.createElement('div');
   modal.classList.add('modal');

   const modalContent = document.createElement('div');
   modalContent.classList.add('modal-content');

   const albumArt = document.createElement('img');
   albumArt.src = recommendedTrack.album.images.length > 0 ? recommendedTrack.album.images[0].url : 'placeholder-image.jpg';
   albumArt.alt = 'Album Art';
   albumArt.classList.add('album-art');

   const audioPreview = document.createElement('audio');
   audioPreview.controls = true;

   if (recommendedTrack.preview_url) {
       audioPreview.src = recommendedTrack.preview_url;
   } else {
       audioPreview.innerHTML = 'No preview available';
   }

   const detailsMessage = `
       <h2>${recommendedTrack.name}</h2>
       <p>Artist(s): ${recommendedTrack.artists.map(artist => artist.name).join(', ')}</p>
       <p>Album: ${recommendedTrack.album.name}</p>
       <p>Release Date: ${recommendedTrack.album.release_date}</p>
   `;

   modalContent.appendChild(albumArt);
   modalContent.appendChild(audioPreview);
   modalContent.innerHTML += detailsMessage;

   const viewOnSpotifyButton = document.createElement('button');
   viewOnSpotifyButton.textContent = 'View on Spotify';
   viewOnSpotifyButton.addEventListener('click', () => {
       viewOnSpotify(recommendedTrack.external_urls.spotify);
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
   window.open(url, '_blank');
}
