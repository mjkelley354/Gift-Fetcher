$("#signout-button").on("click", function(){
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        // redirect to logon 
        window.location.replace("/logon");
    });
});
      