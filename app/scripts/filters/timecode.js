(function(){
  function timecode(){
    return function(seconds){
      return output;
    };
  }

  angular
    .module('blocJams')
    .filter('timecode', timecode);
})();
