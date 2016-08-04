(function(){
  function SongPlayer($rootScope, Fixtures){
    // @desc Song Player service
    // @type {Object}
    var SongPlayer = {};

    // @desc Use Fixtures service to get the currentAlbum being played or paused
    // @type {Object}
    var currentAlbum = Fixtures.getAlbum();

    // @desc Buzz object audio filter
    // @type {Object}
    var currentBuzzObject = null;

    // @function setSong
    // @desc Stops currently playing song and loads new audio file as currentBuzzObject
    // @param {Object} song
    var setSong = function(song){
      if(currentBuzzObject){
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      currentBuzzObject.bind('timeupdate', function(){
        $rootScope.$apply(function(){
          SongPlayer.currentTime = currentBuzzObject.getTime();
        });
      });

      currentBuzzObject.bind('volumeupdate', function(){
        $rootScope.$apply(function(){
          SongPlayer.volume = currentBuzzObject.getVolume();
        });
      });

      SongPlayer.currentSong = song;
    };

    // @function playSong
    // @desc Plays the currentBuzzObject
    // @param {Object} song
    var playSong = function(song){
      song.playing = true;
      currentBuzzObject.setVolume(SongPlayer.volume);
      currentBuzzObject.play();
    };

    // @function playSong
    // @desc Stops the currentBuzzObject
    // @param {Object} song
    var stopSong = function(song){
      song = song || SongPlayer.currentSong;
      song.playing = null;
      currentBuzzObject.stop();
    };

    // @function getSongIndex
    // @desc Returns the index of the song in the currentAlbum
    // @param {Object} song
    var getSongIndex = function(song){
      return currentAlbum.songs.indexOf(song);
    };

    // @desc Currently playing or paused song
    // @type {Object}
    SongPlayer.currentSong = null;

    // @desc Current playback time (in seconds) of currently playing song
    // @type {Number}
    SongPlayer.currentTime = null;

    SongPlayer.volume = 30;

    // @function SongPlayer.play
    // @desc Sets the current song and plays it
    // @param {Object} song
    SongPlayer.play = function(song){
      song = song || SongPlayer.currentSong;
      if(SongPlayer.currentSong !== song){
        setSong(song);

        playSong(song);

      } else if(SongPlayer.currentSong === song){
        if(currentBuzzObject.isPaused()){
          currentBuzzObject.play();
        }
      }
    };

    // @function SongPlayer.pause
    // @desc Pauses the currently playing song
    // @param {Object} song
    SongPlayer.pause = function(song){
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    };

    // @function SongPlayer.previous
    // @desc Changes the currentSong to the previous song on the album
    SongPlayer.previous = function(){
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;

      if(currentSongIndex < 0){
        stopSong();
      } else{
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    // @function SongPlayer.next
    // @desc Changes the currentSong to the next song on the album
    SongPlayer.next = function(){
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex++;

      if(currentSongIndex >= currentAlbum.songs.length){
        stopSong();
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    // @function setCurrentTime
    // @desc Set current time (in seconds) of currently playing song
    // @param {Number} time
    SongPlayer.setCurrentTime = function(time){
      if(currentBuzzObject){
        currentBuzzObject.setTime(time);
      }
    };

    // @function setVolume
    // @desc Sets the volume on the songPlayer and currentBuzzObject if one exists
    // @param {Number} value
    SongPlayer.setVolume = function(value){
      SongPlayer.volume = value;
      if(currentBuzzObject){
        currentBuzzObject.setVolume(value);
      }
    };

    return SongPlayer;
  };

  angular
    .module('blocJams')
    .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
