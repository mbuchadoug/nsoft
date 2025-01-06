importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyDVT1YYuMqBl1SMOw07Nv2DS9uiK62liLI",
    authDomain: "pushnot-f1f03.firebaseapp.com",
    projectId: "pushnot-f1f03",
    storageBucket: "pushnot-f1f03.firebasestorage.app",
    messagingSenderId: "642936146229",
    appId: "1:642936146229:web:565280568db4b136aae47c",
    measurementId: "G-EMJP3MJKFH"
  };

   firebase.initializeApp(firebaseConfig);
   
   const messaging = firebase.messaging()
   messaging.setBackgroundMessageHandler(function (payload) {
    console.log('Handling background message ', payload);
  
    return self.registration.showNotification('Niyonsoft', {
      body: 'Test',
      icon: 'https://joldrillingsolutions.co.zw/kambuchaLogo.jpeg',
      data: 'https://niyonsoft.org',
    });
  });

