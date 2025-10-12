from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from user.models import UserProfile, User


class UserAdmin(BaseUserAdmin):
    # Fields to display in the list view
    list_display = ('email', 'username', 'role', 'is_staff', 'is_admin', 'is_superuser', 'is_active')
    list_filter = ('role', 'is_staff', 'is_admin', 'is_superuser', 'is_active')

    # Fields to edit when viewing/changing a user
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('username',)}),
        ('Role & Permissions', {'fields': ('role', 'is_staff', 'is_admin', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login',)}),
    )

    # Fields for creating a new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email', 'username', 'role',
                'password1', 'password2', 'is_staff', 'is_admin', 'is_superuser'
            ),
        }),
    )

    search_fields = ('email', 'username')
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions',)

# Register the custom user model and admin
admin.site.register(User, UserAdmin)


admin.site.register(UserProfile)