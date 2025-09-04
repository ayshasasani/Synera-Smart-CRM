from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from crm import views
from crm.views import CurrentUserView, CustomerViewSet, LeadViewSet, ProductViewSet, RegistrationView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


# Router for CRUD APIs
router = routers.DefaultRouter()
router.register(r'customers', CustomerViewSet)
router.register(r'leads', LeadViewSet)
router.register(r'products', ProductViewSet)

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # API routes (Customers, Leads, Products, etc.)
    path('api/', include(router.urls)),

    path('api/gmail-test/', views.test_fetch_emails, name='test_fetch_emails'),




    # Auth (JWT)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/current-user/', CurrentUserView.as_view(), name='current-user'),

    # dj-rest-auth (moved under /api/auth/ to avoid conflicts)
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),

    # allauth (social login support)
    path('accounts/', include('allauth.urls')),

    # Gmail integration
    path('gmail-auth/', views.gmail_auth_init),
    path('api/gmail/callback/', views.gmail_auth_callback, name='gmail-callback'),
    path('api/gmail/conversations/', views.gmail_conversations, name='gmail-conversations'),

    # Custom features
    path('high-priority-leads/', views.high_priority_leads, name='high_priority_leads'),

    path('registration/', RegistrationView.as_view(), name='registration'),

]
