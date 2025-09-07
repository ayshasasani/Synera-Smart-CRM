from rest_framework import serializers
from django.contrib.auth import get_user_model
from dj_rest_auth.registration.serializers import RegisterSerializer
from .models import Customer, Lead, Profile, Product
from .ml.utils import calculate_lead_score

User = get_user_model()


# -----------------------------
# Customer Serializer
# -----------------------------
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            'id', 'name', 'email', 'phone',
            'company', 'created_at', 'address', 'notes'
        ]
        read_only_fields = ['id', 'created_at']


# -----------------------------
# Lead Serializer
# -----------------------------
class LeadSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(),
        source='customer',
        write_only=True
    )
    score = serializers.SerializerMethodField()
    sentiment = serializers.CharField(read_only=True)
    sentiment_score = serializers.FloatField(read_only=True)
    updated_by = serializers.CharField(source='updated_by.username', read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def get_score(self, obj):
        """Calculate lead score dynamically"""
        return calculate_lead_score(obj)

    def validate_customer_id(self, value):
        """Ensure the selected customer belongs to the current user"""
        request = self.context.get('request')
        if request and value.owner != request.user:
            raise serializers.ValidationError("You cannot assign a lead to this customer.")
        return value

    class Meta:
        model = Lead
        fields = [
            'id',
            'customer',
            'customer_id',
            'title',
            'description',
            'status',
            'score',
            'sentiment',
            'sentiment_score',
            'created_at',
            'updated_by',
            'updated_at'
        ]
        read_only_fields = [
            'id', 'customer', 'created_at', 'score',
            'sentiment', 'sentiment_score', 'updated_by', 'updated_at'
        ]


# -----------------------------
# Product Serializer
# -----------------------------
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


# -----------------------------
# User Serializer
# -----------------------------
class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='profile.role', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']
        read_only_fields = ['id', 'role']


# -----------------------------
# User Registration Serializer
# -----------------------------
class UserRegistrationSerializer(RegisterSerializer):
    # Required fields
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password1 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    # Profile fields
    phone = serializers.CharField(required=False, allow_blank=True)
    company = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    position = serializers.CharField(required=False, allow_blank=True)
    linkedin = serializers.URLField(required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=Profile.ROLE_CHOICES, default=Profile.ROLE_SALES)

    def validate(self, data):
        """Ensure password1 and password2 match"""
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return data

    def get_cleaned_data(self):
        """Return validated data including profile fields"""
        return {
            'username': self.validated_data.get('username', ''),
            'email': self.validated_data.get('email', ''),
            'password1': self.validated_data.get('password1', ''),
            'phone': self.validated_data.get('phone', ''),
            'company': self.validated_data.get('company', ''),
            'address': self.validated_data.get('address', ''),
            'position': self.validated_data.get('position', ''),
            'linkedin': self.validated_data.get('linkedin', ''),
            'role': self.validated_data.get('role', Profile.ROLE_SALES),
        }

    def save(self, request):
        """Create the User and associated Profile"""
        user = super().save(request)
        profile_data = self.get_cleaned_data()

        Profile.objects.update_or_create(
            user=user,
            defaults={
                'phone': profile_data['phone'],
                'company': profile_data['company'],
                'address': profile_data['address'],
                'position': profile_data['position'],
                'linkedin': profile_data['linkedin'],
                'role': profile_data['role'],
            }
        )
        return user
