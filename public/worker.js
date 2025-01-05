console.log("Service Worker Loaded...,fuckkk");

self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: "Notified by Niyonsoft!",
    icon: "https://joldrillingsolutions.co.zw/kambuchaLogo.jpeg"
  });
});
