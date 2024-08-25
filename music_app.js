let popSongLeft = document.getElementById('pop_song_left');
let popSongRight = document.getElementById('pop_song_right');
let popSong = document.getElementsByClassName('recommended_List_Mian_conatiner')[0];

popSongRight.addEventListener('click', () => {
    popSong.scrollLeft += 330;
    console.log("song clicked");
});

popSongLeft.addEventListener('click', () => {
    popSong.scrollLeft -= 330;
    console.log("song clicked");
});

let songId = 2;
let musicDataArray = [];
let music = new Audio();

function getAPIData() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("http://localhost:8080/music/songs/all", requestOptions)
        .then(response => response.json())
        .then(data => {
            data.forEach(song => {
                formUI(song);
            });
            generateRandomSongs();
            right_container();
        })
        .catch(error => {
            console.error('Error fetching API data:', error);
        });
}

getAPIData();

function formUI(song) {
    let musicObj = new ApiData();
    musicObj.song_id = song.id;
    musicObj.song_album_link = song.album_LINK;
    musicObj.song_movie = song.movie;
    musicObj.song_artist = song.artist;
    musicObj.song_link = song.song_LINK;
    musicObj.song_name = song.song;

    musicDataArray.push(musicObj);
}

function ApiData() {
    this.song_id = "";
    this.song_album_link = "";
    this.song_movie = "";
    this.song_artist = "";
    this.song_link = "";
    this.song_name = "";
}

function generateRandomSongs() {
    let recommended_List_Mian_conatiner = document.getElementById('recommended_List_Mian_conatiner');
    
    for (let i = 0; i < 20; i++) 
    {
        let randomIndex = Math.floor(Math.random() * musicDataArray.length);
        let recommended_List = document.createElement('div');
        recommended_List.className = 'recommended_List';

        let recommended_List_image = document.createElement('img');
        recommended_List_image.src = musicDataArray[randomIndex].song_album_link;

        let recommended_List_h1 = document.createElement('h1');
        recommended_List_h1.innerHTML = musicDataArray[randomIndex].song_name;

        let recommended_List_h2 = document.createElement('h2');
        recommended_List_h2.innerHTML = musicDataArray[randomIndex].song_movie;

        recommended_List.appendChild(recommended_List_image);
        recommended_List.appendChild(recommended_List_h1);
        recommended_List.appendChild(recommended_List_h2);

        recommended_List_Mian_conatiner.appendChild(recommended_List);

        recommended_List.addEventListener('click', () => {
            songId = randomIndex;
            right_container(songId);
            music.play();
            wave.classList.add('active');
            masterPlay.classList.remove('fa-play');
            masterPlay.classList.add('fa-pause');
            console.log("song clicked");
        });
    }
}


let current_start = document.getElementById('current_start');
let current_end = document.getElementById('current_end');
let seek = document.getElementById('seek');
let bar_2 = document.getElementById('bar_2');
let dot = document.getElementById('dot');

function right_container(songId) {
    let masterPlay = document.getElementById('masterPlay');

    let container_1 = document.getElementById('container_1');
    container_1.innerHTML = '';

    let song_details = document.createElement('div');
    song_details.id = 'song_details';

    let song_details_h1_song_name = document.createElement('h1');
    song_details_h1_song_name.innerHTML = musicDataArray[songId].song_name;

    let song_details_h2_movie_name = document.createElement('h2');
    song_details_h2_movie_name.innerHTML = musicDataArray[songId].song_movie;

    let song_details_h2_artist_name = document.createElement('h2');
    song_details_h2_artist_name.innerHTML = musicDataArray[songId].song_artist;

    let heart = document.createElement('i');
    
    let favButton = document.createElement('button');
    favButton.innerHTML = 'Favorites'; 
    // favButton.className = 'fa-heart';

    favButton.addEventListener('click', () => {
        addToFavorites(songId);
    });
   


    let song_image = document.createElement('div');
    song_image.id = 'song_image';

    let song_image_src = document.createElement('img');
    song_image_src.src = musicDataArray[songId].song_album_link;

    song_details.appendChild(song_details_h1_song_name);
    song_details.appendChild(song_details_h2_movie_name);
    song_details.appendChild(song_details_h2_artist_name);
    song_details.appendChild(favButton);

    container_1.appendChild(song_details);

    song_image.appendChild(song_image_src);
    container_1.appendChild(song_image);

    favButton.addEventListener('click', ()=>
    {


    })

    if (music) {
        music.pause();
        masterPlay.classList.add('fa-play');
        masterPlay.classList.remove('fa-pause');
        music.currentTime = 0;
    }

    music = new Audio(musicDataArray[songId].song_link);

    music.addEventListener('timeupdate', () => {
        let music_duration = music.duration;
        let music_current = music.currentTime;

        let end_min = Math.floor(music_duration / 60);
        let end_sec = Math.floor(music_duration % 60);

        if (end_sec < 10) {
            end_sec = `0${end_sec}`;
        }

        current_end.innerHTML = `${end_min}:${end_sec}`;

        let start_min = Math.floor(music_current / 60);
        let start_sec = Math.floor(music_current % 60);

        if (start_sec < 10) {
            start_sec = `0${start_sec}`
        }

        current_start.innerHTML = `${start_min}:${start_sec}`;


        let progress;
        if (music_current > 0) {
            progress = parseInt((music_current / music_duration) * 100);
        } else {
            progress = 0;
        }
        seek.value = progress;
        let seekbar = seek.value;
        bar_2.style.width = `${seekbar}%`;
        dot.style.left = `${seekbar}%`;


    });

    music.addEventListener('loadedmetadata', function () {
        seek.addEventListener('input', function () {
            let seekToTime = (seek.value * music.duration) / 100;
            music.currentTime = seekToTime;
        });
    });

    let wave = document.getElementById('wave');



    masterPlay.addEventListener('click', playPauseHandler);


    let vol_icon = document.getElementById('vol_icon');
    let vol = document.getElementById('vol');
    let vol_bar = document.getElementsByClassName('vol_bar')[0];
    let vol_dot = document.getElementById('vol_dot');

    vol.addEventListener('change', () => {
        if (vol.value == 0) {
            vol_icon.classList.remove('fa-volume-high');
            vol_icon.classList.add('fa-volume-off');
        }

        let vol_a = vol.value;
        vol_bar.style.width = `${vol_a}%`;
        vol_dot.style.left = `${vol_a}%`;

        music.volume = vol_a / 100;

    });

    poster_changing(songId);


}

let favoriteSongs = [];


function addToFavorites(songId) {
    if (!favoriteSongs.some(song => song.song_id === musicDataArray[songId].song_id)) {
        favoriteSongs.push(musicDataArray[songId]);
        updateFavoritesUI();
    }
}

function updateFavoritesUI()
{
    let left_container_song_list_container = document.getElementById('left_container_song_list_container');
    left_container_song_list_container.innerHTML = '';


    let song_list_main_container = document.createElement('div');
    song_list_main_container.className = 'song_list_main_container';

    let song_list_main_container_img = document.createElement('img');
    song_list_main_container_img.src = musicDataArray[songId].song_album_link;

    let song_list_main_container_movie_details = document.createElement('div');
    song_list_main_container_movie_details.className = 'song_list_main_container_movie_details';

    let song_list_main_container_movie_details_h1 = document.createElement('h1');
    song_list_main_container_movie_details_h1.innerHTML = musicDataArray[songId].song_name;

    let song_list_main_container_movie_details_h2 = document.createElement('h2');
    song_list_main_container_movie_details_h2. innerHTML = musicDataArray[songId].song_artist;


    left_container_song_list_container.appendChild(song_list_main_container_div);

    song_list_main_container_div.appendChild(song_list_main_container_img);
    song_list_main_container_div.appendChild(song_list_main_container_movie_details);
    song_list_main_container_movie_details.appendChild(song_list_main_container_movie_details_h1);
    song_list_main_container_movie_details.appendChild(song_list_main_container_movie_details_h2);



}

function playPauseHandler() 
{
    if (music.paused || music.currentTime <= 0) {
        music.play();
        wave.classList.add('active');
        masterPlay.classList.remove('fa-play');
        masterPlay.classList.add('fa-pause');
    } else {
        music.pause();
        wave.classList.remove('active');
        masterPlay.classList.add('fa-play');
        masterPlay.classList.remove('fa-pause');
    }
}


function poster_changing(songId) 
{
    let poster_img = document.getElementById('poster');
    let bottom_title = document.getElementById('bottom_title');
    poster_img.src = musicDataArray[songId].song_album_link;
    bottom_title.innerHTML = musicDataArray[songId].song_name;

}








