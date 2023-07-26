import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ExportService } from '../services/export.service';

interface Annotation {
  start: number;
  end: number;
  label: string;
  text: string;
}

@Component({
  selector: 'app-document-annotation',
  templateUrl: './document-annotation.component.html',
  styleUrls: ['./document-annotation.component.css'],
  providers: [ExportService],
})
export class DocumentAnnotationComponent {
  labelColors: { [label: string]: string } = {};
  selectedColor: { [label: string]: string } = {};
  labelsInput: string = '';
  labels: string[] = [];
  selectedLabel: string = '';
  documentText: string =
    'Sergei Prokofiev (1891–1953) was a Russian composer, pianist, and conductor. As the creator of works across numerous music genres, he is regarded as one of the major composers of the 20th century. His works include operas such as The Gambler, The Fiery Angel and The Love for Three Oranges; the suite Lieutenant Kijé; the ballet Romeo and Juliet and Peter and the Wolf. Altogether during his adult life, he composed seven operas, seven symphonies, eight ballets, five piano concertos, two violin concertos, a cello concerto, a symphony-concerto for cello and orchestra, and nine completed piano sonatas.';
  annotations: Annotation[] = [];
  error: string = '';

  constructor(
    private sanitizer: DomSanitizer,
    private exportService: ExportService
  ) {}

  private generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  addLabels() {
    if (this.labelsInput.trim() !== '') {
      const newLabels = this.labelsInput
        .split(',')
        .map((label) => label.trim());
      newLabels.forEach((label) => {
        if (label !== '' && !this.labels.includes(label)) {
          const color = this.generateRandomColor();
          this.labels.push(label);
          this.labelColors[label] = color;
        }
      });
      this.labelsInput = '';
    }
  }

  onLabelSelected(label: string) {
    this.selectedLabel = label;
    this.selectedColor[label] = this.labelColors[label];
  }

  annotateText() {
    const selectedText = window.getSelection()?.toString();
    if (selectedText && this.selectedLabel !== '') {
      const startIndex = this.documentText.indexOf(selectedText);
      const endIndex = startIndex + selectedText.length;

      const existingAnnotationIndex = this.annotations.findIndex(
        (annotation) =>
          annotation.start === startIndex && annotation.end === endIndex
      );

      if (existingAnnotationIndex !== -1) {
        // Replace the old label with the new one for the existing annotation.
        this.annotations[existingAnnotationIndex].label = this.selectedLabel;
      } else {
        // Add a new annotation if there's no existing one.
        this.annotations.push({
          start: startIndex,
          end: endIndex,
          label: this.selectedLabel,
          text: selectedText,
        });
      }

      // Apply highlighting to the document text.
      this.documentText =
        this.documentText.slice(0, startIndex) +
        `<span class="highlighted" style="background-color: ${
          this.selectedColor[this.selectedLabel]
        }">${selectedText}</span>` +
        this.documentText.slice(endIndex);

      this.error = '';
    } else {
      this.error = 'Please select a label and highlight text to annotate.';
    }
  }

  getHighlightedText(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.documentText);
  }

  exportAnnotations() {
    if (this.annotations.length === 0) {
      this.error = 'No annotations to export.';
      return;
    }

    const annotationData = {
      document: this.documentText,
      annotations: this.annotations,
    };

    console.log('Exporting annotations:', annotationData);

    this.exportService.exportAnnotations(annotationData).subscribe(
      (response) => {
        console.log('Export successful:', response);
      },
      (error) => {
        console.error('Export error:', error);
        this.error = 'Error exporting annotations.';
      }
    );
  }
}
