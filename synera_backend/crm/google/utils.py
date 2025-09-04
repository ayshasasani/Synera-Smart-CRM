import base64
from bs4 import BeautifulSoup

def parse_message(msg):
    headers = msg.get("payload", {}).get("headers", [])
    subject = None
    sender = None
    for h in headers:
        if h["name"] == "Subject":
            subject = h["value"]
        elif h["name"] == "From":
            sender = h["value"]

    snippet = msg.get("snippet", "")
    body = ""
    parts = msg.get("payload", {}).get("parts", [])
    if parts:
        for part in parts:
            mime_type = part.get("mimeType", "")
            data = part.get("body", {}).get("data")
            if not data:
                continue
            decoded = base64.urlsafe_b64decode(data).decode("utf-8")
            if mime_type == "text/plain":
                body = decoded
                break
            elif mime_type == "text/html":
                soup = BeautifulSoup(decoded, "html.parser")
                body = soup.get_text()
                break
    else:
        data = msg.get("payload", {}).get("body", {}).get("data")
        if data:
            body = base64.urlsafe_b64decode(data).decode("utf-8")

    return {
        "sender": sender,
        "subject": subject,
        "snippet": snippet,
        "body": body,
    }
