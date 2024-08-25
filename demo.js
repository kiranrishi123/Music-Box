function getAPIData() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
  
    fetch("http://localhost:8080/music/songs/all", requestOptions)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => {
            console.error('Error fetching API data:', error);
        });
}

getAPIData();
