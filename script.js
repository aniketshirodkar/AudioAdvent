let accessToken;
function getAccessToken(){

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
      // console.log('Access Token:', accessToken);

      // Use the access token in your Spotify API requests
      // ...
   })
   .catch(error => {
      console.error('Error obtaining access token:', error.response ? error.response.data : error.message);
   });
   
}
getAccessToken()

function generatePlaylist() {
    const searchInput = document.getElementById('search-input').value;
    const searchURL = `https://api.spotify.com/v1/search?q=${searchInput}&type=track`;
    // console.log(accessToken)
    fetch(searchURL, {
       method: 'GET',
       headers: {
          'Authorization': 'Bearer ' + accessToken,
       },
    })
    .then(response => response.json())
    .then(data => {
       displayPlaylist(data.tracks.items);
    })
    .catch(error => {
       console.error('Error:', error);
    });
 }
 
 function displayPlaylist(tracks) {
    const playlistResults = document.getElementById('playlist-results');
    playlistResults.innerHTML = '';
 
    if (tracks.length === 0) {
       playlistResults.innerHTML = '<p class="no-tracks">No tracks found. Try a different search.</p>';
       return;
    }
 
    tracks.forEach(track => {
       const trackCard = createTrackCard(track);
       playlistResults.appendChild(trackCard);
 
       // Add click event listener to each track card
       trackCard.addEventListener('click', () => {
          showTrackDetails(track);
       });
    });
 }
 
 function createTrackCard(track) {
    const trackCard = document.createElement('div');
    trackCard.classList.add('track-card');
 
    const albumArt = document.createElement('img');
    albumArt.src = track.album.images.length > 0 ? track.album.images[0].url : 'placeholder-image.jpg';
    albumArt.alt = 'Album Art';
 
    const trackDetails = document.createElement('div');
    trackDetails.classList.add('track-details');
 
    const trackName = document.createElement('h3');
    trackName.textContent = track.name;
 
    const artistName = document.createElement('p');
    artistName.textContent = `Artist: ${track.artists.map(artist => artist.name).join(', ')}`;
 
    trackDetails.appendChild(trackName);
    trackDetails.appendChild(artistName);
 
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', () => {
       saveTrack(track);
    });
 
    trackCard.appendChild(albumArt);
    trackCard.appendChild(trackDetails);
    trackCard.appendChild(saveButton);
 
    return trackCard;
 }
 
 function saveTrack(track) {
    // Retrieve saved tracks from local storage
    const savedTracks = JSON.parse(localStorage.getItem('savedTracks')) || [];
 
    // Check if the track is already saved
    const isAlreadySaved = savedTracks.some(savedTrack => savedTrack.id === track.id);
 
    if (!isAlreadySaved) {
       // Add the track to the savedTracks array
       savedTracks.push({
        id: track.id,
        name: track.name,
        artists: track.artists.map(artist => artist.name).join(', '),
        album: track.album.name,
        releaseDate: track.album.release_date,
        albumArt: track.album.images.length > 0 ? track.album.images[0].url : null,
     })
 
       // Save the updated savedTracks array to local storage
       localStorage.setItem('savedTracks', JSON.stringify(savedTracks));
 
       // Optionally, you can notify the user that the track has been saved
       alert('Track saved!');
    } else {
       // Optionally, you can notify the user that the track is already saved
       alert('Track is already saved.');
    }
 }
 
 
 function showTrackDetails(track) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
 
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
 
    const albumArt = document.createElement('img');
    albumArt.src = track.album.images.length > 0 ? track.album.images[0].url : 'placeholder-image.jpg';
    albumArt.alt = 'Album Art';
    albumArt.classList.add('album-art');
 
    const audioPreview = document.createElement('audio');
    audioPreview.controls = true;
 
    if (track.preview_url) {
       audioPreview.src = track.preview_url;
    } else {
       audioPreview.innerHTML = 'No preview available';
    }
 
    const detailsMessage = `
       <h2>${track.name}</h2>
       <p>Artist(s): ${track.artists.map(artist => artist.name).join(', ')}</p>
       <p>Album: ${track.album.name}</p>
       <p>Release Date: ${track.album.release_date}</p>
    `;
 
    modalContent.appendChild(albumArt);
    modalContent.appendChild(audioPreview);
    modalContent.innerHTML += detailsMessage;
 
    const viewOnSpotifyButton = document.createElement('button');
    viewOnSpotifyButton.textContent = 'View on Spotify';
    viewOnSpotifyButton.addEventListener('click', () => {
       viewOnSpotify(track.external_urls.spotify);
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

 
 