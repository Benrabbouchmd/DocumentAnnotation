import json
import os
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Annotation
from .serializers import AnnotationSerializer


class AnnotationViewSet(viewsets.ModelViewSet):
    queryset = Annotation.objects.all()
    serializer_class = AnnotationSerializer

    @action(detail=False, methods=['post'])
    def export_annotations(self, request):
        data = request.data

        # Create the "exported_annotations" directory
        export_dir = 'exported_annotations'
        if not os.path.exists(export_dir):
            os.makedirs(export_dir)

        # Create a filename for the exported file 
        file_number = 1
        while os.path.exists(f'{export_dir}/exported_annotations_{file_number}.json'):
            file_number += 1
        filename = f'{export_dir}/exported_annotations_{file_number}.json'

        # Write the annotation data to the file.
        with open(filename, 'w') as file:
            json.dump(data, file)

        return Response({'file_path': filename})
