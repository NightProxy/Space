document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname === '/g') {
        fetch('g.json')
            .then(response => response.json())
            .then(data => {
                const gameContainer = document.querySelector('.gameContain');
                data.forEach(game => {
                    const gameLink = document.createElement('a');
                    gameLink.href = `/&?q=${encodeURIComponent(game.name)}`;
                    const gameImage = document.createElement('img');
                    gameImage.src = game.img;
                    gameImage.alt = game.name;
                    gameLink.appendChild(gameImage);
                    gameContainer.appendChild(gameLink);
                });
            })
            .catch(error => console.error('Error loading game data:', error));
    }
});
