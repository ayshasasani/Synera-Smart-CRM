import os
import pickle
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from django.conf import settings

SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]

def get_gmail_service(request=None):
    """
    Returns a Gmail API service object.
    If `request` is provided, uses session-based credentials.
    Otherwise, falls back to local pickle token (installed app flow).
    """

    creds = None

    # Session-based credentials
    if request:
        if request.session.get("gmail_token"):
            from google.oauth2.credentials import Credentials
            creds = Credentials(
                token=request.session.get("gmail_token"),
                refresh_token=request.session.get("refresh_token"),
                token_uri=request.session.get("token_uri"),
                client_id=request.session.get("client_id"),
                client_secret=request.session.get("client_secret"),
                scopes=request.session.get("scopes"),
            )
        else:
            raise Exception("Gmail not authenticated. Call /api/gmail/init/ first.")

    # Fallback to local pickle token (for development/testing)
    else:
        token_path = os.path.join(os.path.dirname(__file__), "token.pickle")
        creds_path = os.path.join(os.path.dirname(__file__), "credentials.json")

        if os.path.exists(token_path):
            with open(token_path, "rb") as token_file:
                creds = pickle.load(token_file)

        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
                creds = flow.run_local_server(port=0)  # 0 lets OS pick a free port
            with open(token_path, "wb") as token_file:
                pickle.dump(creds, token_file)

    service = build("gmail", "v1", credentials=creds)
    return service
