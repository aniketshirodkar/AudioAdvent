document.addEventListener('DOMContentLoaded', () => {
    const recommendedTracksContainer = document.getElementById('recommended-tracks');
 
    // Retrieve recommended tracks from local storage (assuming they were stored there in the generateRecommendations function)
    const recommendedTracks = JSON.parse(localStorage.getItem('recommendedTracks')) || [];
 
    if (recommendedTracks.length === 0) {
       recommendedTracksContainer.innerHTML = '<p class="no-tracks">No recommended tracks available.</p>';
    } else {
       recommendedTracks.forEach(recommendedTrack => {
          const recommendedTrackCard = createRecommendedTrackCard(recommendedTrack);
          recommendedTracksContainer.appendChild(recommendedTrackCard);
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
 