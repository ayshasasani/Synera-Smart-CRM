from django.db import models
from django.contrib.auth.models import User
from textblob import TextBlob  # pip install textblob
from .ml.utils import calculate_lead_score  # ML scoring function


# -----------------------------
# Customer
# -----------------------------
class Customer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    company = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


# -----------------------------
# Lead
# -----------------------------
class Lead(models.Model):
    STATUS_NEW = 'new'
    STATUS_CONTACTED = 'contacted'
    STATUS_QUALIFIED = 'qualified'
    STATUS_LOST = 'lost'
    STATUS_WON = 'won'

    STATUS_CHOICES = [
        (STATUS_NEW, 'New'),
        (STATUS_CONTACTED, 'Contacted'),
        (STATUS_QUALIFIED, 'Qualified'),
        (STATUS_LOST, 'Lost'),
        (STATUS_WON, 'Won'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='leads')
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default=STATUS_NEW)

    # Scoring & Sentiment
    score = models.FloatField(default=0)
    sentiment = models.CharField(max_length=20, blank=True, null=True)
    sentiment_score = models.FloatField(default=0.0)

    # Tracking
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='updated_leads'
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.customer.name}"

    def analyze_sentiment(self):
        """Analyze sentiment using TextBlob"""
        if self.description:
            blob = TextBlob(self.description)
            polarity = blob.sentiment.polarity
            self.sentiment_score = polarity
            if polarity > 0.1:
                self.sentiment = 'Positive'
            elif polarity < -0.1:
                self.sentiment = 'Negative'
            else:
                self.sentiment = 'Neutral'
        else:
            self.sentiment = 'N/A'
            self.sentiment_score = 0.0

    def save(self, *args, **kwargs):
        self.analyze_sentiment()
        try:
            self.score = calculate_lead_score(self)
        except Exception as e:
            self.score = 0
            print(f"Lead scoring error: {e}")
        super().save(*args, **kwargs)


# -----------------------------
# Profile (extended user)
# -----------------------------
class Profile(models.Model):
    ROLE_ADMIN = 'admin'
    ROLE_SALES = 'sales'

    ROLE_CHOICES = [
        (ROLE_ADMIN, 'Admin'),
        (ROLE_SALES, 'Sales Agent'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=ROLE_SALES)

    # Professional details
    phone = models.CharField(max_length=20, blank=True, null=True)
    company = models.CharField(max_length=255, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)

    # Gmail Integration fields
    gmail_token = models.TextField(blank=True, null=True)
    gmail_refresh_token = models.TextField(blank=True, null=True)
    gmail_token_uri = models.TextField(blank=True, null=True)
    gmail_client_id = models.TextField(blank=True, null=True)
    gmail_client_secret = models.TextField(blank=True, null=True)
    gmail_scopes = models.JSONField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['user__username']

    def __str__(self):
        return f"{self.user.username} - {self.role}"


# -----------------------------
# Product
# -----------------------------
class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stock = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Product'
        verbose_name_plural = 'Products'

    def __str__(self):
        return f"{self.name} (${self.price})"
