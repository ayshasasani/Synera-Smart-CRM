# utils.py
import base64
from email.mime.text import MIMEText
from googleapiclient.discovery import build

def send_gmail_message(credentials, to_email, subject, body):
    service = build('gmail', 'v1', credentials=credentials)

    message = MIMEText(body)
    message['to'] = to_email
    message['subject'] = subject
    raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

    sent_message = service.users().messages().send(
        userId="me",
        body={'raw': raw_message}
    ).execute()

    return sent_message
