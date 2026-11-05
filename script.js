<script>  
let lastResponse = "Hello. I am JARVIS.";  
  
async function send() {  
  const input = document.getElementById("message");  
  const responseBox = document.getElementById("response");  
  const status = document.getElementById("status");  
  
  const msg = input.value.trim();  
  if (!msg) return;  
  
  responseBox.textContent = "JARVIS is thinking...";  
  status.textContent = "CONNECTING TO AI...";  
  
  try {  
    const response = await fetch("/.netlify/functions/chat", {  
      method: "POST",  
      headers: {  
        "Content-Type": "application/json"  
      },  
      body: JSON.stringify({ message: msg })  
    });  
  
    const data = await response.json();  
  
    if (!response.ok) {  
      throw new Error(data.error || "AI connection failed");  
    }  
  
    lastResponse = data.reply;  
    responseBox.textContent = lastResponse;  
    status.textContent = "JARVIS AI ONLINE";  
  
  } catch (error) {  
    responseBox.textContent = "Connection error: " + error.message;  
    status.textContent = "CONNECTION ERROR";  
  }  
}  
  
function speak() {  
  if ("speechSynthesis" in window) {  
    speechSynthesis.cancel();  
    speechSynthesis.speak(  
      new SpeechSynthesisUtterance(lastResponse)  
    );  
  }  
}  
  
function listen() {  
  const Speech =  
    window.SpeechRecognition ||  
    window.webkitSpeechRecognition;  
  
  if (!Speech) {  
    document.getElementById("status").textContent =  
      "VOICE INPUT NOT SUPPORTED";  
    return;  
  }  
  
  const recognition = new Speech();  
  recognition.lang = "en-IN";  
  
  recognition.onstart = () => {  
    document.getElementById("status").textContent =  
      "LISTENING...";  
  };  
  
  recognition.onresult = (e) => {  
    document.getElementById("message").value =  
      e.results[0][0].transcript;  
    send();  
  };  
  
  recognition.onend = () => {  
    document.getElementById("status").textContent =  
      "SYSTEM ONLINE";  
  };  
  
  recognition.start();  
}  
</script>
