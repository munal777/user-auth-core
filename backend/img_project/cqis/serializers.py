from rest_framework import serializers


class PDFSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):

        
        if not value or value.size == 0:
            raise serializers.ValidationError("File should not be empty.")

        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("File should be below 10 MB.")
        
        if not value.name.endswith('.pdf'):
            raise serializers.ValidationError("Only PDF files are allowed.")

        return value
        
