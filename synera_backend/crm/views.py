import os
from django.conf import settings
from django.shortcuts import redirect
from django.http import JsonResponse
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import Product, Customer, Lead
from .serializers import (
    ProductSerializer,
    CustomerSerializer,
    LeadSerializer,
    UserSerializer,
    UserRegistrationSerializer
)
from .utils import send_gmail_message
from crm.google.utils import parse_message
from crm.google.gmail_service import get_gmail_service

# ---------------- Gmail Settings ---------------- #
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']


def get_google_client_config():
    """
    Returns Google OAuth client configuration
    """
    return {
        "web": {
            "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
            "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
            "redirect_uris": [settings.GOOGLE_OAUTH2_REDIRECT_URI],
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
        }
    }


# ---------------- Gmail OAuth Views ---------------- #
@api_view(['GET'])
@permission_classes([AllowAny])
def gmail_auth_init(request):
    """
    Redirects user to Google OAuth consent page
    """
    flow = Flow.from_client_config(get_google_client_config(), scopes=SCOPES)
    flow.redirect_uri = settings.GOOGLE_OAUTH2_REDIRECT_URI
    auth_url, state = flow.authorization_url(access_type='offline', prompt='consent')
    request.session['oauth_state'] = state
    return redirect(auth_url)


@api_view(['GET'])
@permission_classes([])  # no authentication needed for the callback
def gmail_auth_callback(request):
    """
    Handles Google OAuth callback and stores credentials in session,
    then redirects back to the frontend React app with a query param.
    """
    state = request.session.get('oauth_state')
    flow = Flow.from_client_config(get_google_client_config(), scopes=SCOPES, state=state)
    flow.redirect_uri = settings.GOOGLE_OAUTH2_REDIRECT_URI
    flow.fetch_token(authorization_response=request.build_absolute_uri())

    credentials = flow.credentials
    # Save credentials in session
    request.session['gmail_token'] = credentials.token
    request.session['refresh_token'] = credentials.refresh_token
    request.session['token_uri'] = credentials.token_uri
    request.session['client_id'] = credentials.client_id
    request.session['client_secret'] = credentials.client_secret
    request.session['scopes'] = credentials.scopes

    # Redirect back to React app with a query parameter indicating success
    frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
    return redirect(f"{frontend_url}/dashboard?gmail=connected")


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def gmail_conversations(request):
    """
    Fetches last 10 emails from Gmail
    """
    try:
        credentials = Credentials(
            token=request.session.get('gmail_token'),
            refresh_token=request.session.get('refresh_token'),
            token_uri=request.session.get('token_uri'),
            client_id=request.session.get('client_id'),
            client_secret=request.session.get('client_secret'),
            scopes=request.session.get('scopes'),
        )

        service = build('gmail', 'v1', credentials=credentials)
        results = service.users().messages().list(userId='me', maxResults=10).execute()
        messages = results.get('messages', [])

        conversation_snippets = []
        for msg in messages:
            full_msg = service.users().messages().get(userId='me', id=msg['id'], format='metadata').execute()
            snippet = full_msg.get('snippet', '')
            conversation_snippets.append({'id': msg['id'], 'snippet': snippet})

        return Response({'messages': conversation_snippets})

    except Exception as e:
        return Response({'error': str(e)}, status=500)


# ---------------- CRM APIs ---------------- #
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def high_priority_leads(request):
    """
    Returns leads with score >= 80 excluding won/lost
    """
    high_priority = Lead.objects.filter(score__gte=80).exclude(status__in=['won', 'lost'])
    serializer = LeadSerializer(high_priority, many=True)
    return Response(serializer.data)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all().order_by('-created_at')
    serializer_class = CustomerSerializer


class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all().order_by('-created_at')
    serializer_class = LeadSerializer

    def perform_create(self, serializer):
        serializer.save(updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class RegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]


# ---------------- Gmail Test Fetch ---------------- #
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_fetch_emails(request):
    try:
        service = get_gmail_service(request)  # pass request
        results = service.users().messages().list(userId='me', labelIds=['INBOX'], maxResults=5).execute()
        messages = results.get('messages', [])

        emails = []
        for msg in messages:
            msg_data = service.users().messages().get(userId='me', id=msg['id']).execute()
            parsed = parse_message(msg_data)
            emails.append(parsed)

        return JsonResponse(emails, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)