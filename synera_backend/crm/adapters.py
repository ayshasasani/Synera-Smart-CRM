# crm/adapters.py
from allauth.account.adapter import DefaultAccountAdapter

class CustomAccountAdapter(DefaultAccountAdapter):
    def save_user(self, request, user, form, commit=True):
        # This fixes the _has_phone_field check
        if not hasattr(form, '_has_phone_field'):
            form._has_phone_field = hasattr(form, 'phone')
        return super().save_user(request, user, form, commit)
