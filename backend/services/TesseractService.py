import re
from typing import Optional
from PIL import Image
import pytesseract
from pdf2image import convert_from_bytes
from fastapi import HTTPException
from pypdf import PdfReader
import fitz
import io


class TesseractService:
    def __init__(self, tesseract_path: str = None):
        if tesseract_path:
            pytesseract.pytesseract.tesseract_cmd = tesseract_path

        self.phrase_certificate = "registro del estado civil y capacidad de las personas"
        self.phrase_certificate2 = "registro provincial de las personas"
        self.phrase_birth_certificate = "nacimiento"
        self.phrase_marriage_certificate = "matrimonio"
        self.phrase_death_certificate1 = "defuncion"
        self.phrase_death_certificate2 = "fallecio"

        self.phrase_certificate_italy = "stato civile"
        self.phrase_certificate_italy2 = "Ufficio dello Stato Civile"
        self.phrase_birth_italy_certificate = "nascita"
        self.phrase_death_italy_certificate1 = "certificato di morte"
        self.phrase_death_italy_certificate2 = "morte"

    def recognize_image(self, input_stream) -> str:
        """Extracts text from an image using Tesseract OCR."""
        try:
            image = Image.open(input_stream)
            return pytesseract.image_to_string(image)
        except Exception as e:
            raise HTTPException(status_code=400, detail="Invalid file, this is not an image.")

    def recognize_pdf(self, input_stream) -> str:
        """Extracts text from a PDF using PyPDF2."""
        try:
            reader = PdfReader(input_stream)
            text = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
            return text
        except Exception as e:
            raise HTTPException(status_code=400, detail="Invalid file format, this is not a PDF file.")

    def extract_images_from_pdf_with_ocr(self, input_stream, lang = None) -> str:
        try:
            file_signature = input_stream.read(4)
            input_stream.seek(0) 

            if file_signature != b"%PDF":
                raise HTTPException(status_code=400, detail="Invalid file format, this is not a PDF file.")
            
            pdf_document = fitz.open("pdf", input_stream.read())

            extracted_text = []

            for page_num in range(len(pdf_document)):
                page = pdf_document[page_num]
                images = page.get_images(full=True)

                for img_index, img in enumerate(images):
                    xref = img[0] 
                    base_image = pdf_document.extract_image(xref)
                    image_bytes = base_image["image"]
                    img_pil = Image.open(io.BytesIO(image_bytes))

                    text = pytesseract.image_to_string(img_pil, lang=lang)
                    extracted_text.append(text)

            return "\n".join(extracted_text)
        except Exception as e:
            raise HTTPException(status_code=400, detail="Invalid file format, this is not a PDF file.")

    def is_dni_front(self, input_stream) -> bool:
        """Checks if the image is a front side of a DNI (National ID)."""
        text = self.recognize_image(input_stream).lower()
        return self.contains_phrase_front(text)

    def is_dni_back(self, input_stream) -> bool:
        """Checks if the image is a back side of a DNI (National ID)."""
        text = self.recognize_image(input_stream).lower()
        return self.contains_phrase_back(text)

    def is_certificate(self, input_stream, lang = None) -> bool:
        """Checks if the PDF contains a civil certificate (birth, marriage, death)."""
        text = self.extract_images_from_pdf_with_ocr(input_stream, lang).lower()
        return self.contains_phrase_pdf(text)

    def is_birth_certificate(self, input_stream) -> bool:
        """Checks if the PDF is a birth certificate."""
        text = self.extract_images_from_pdf_with_ocr(input_stream).lower()
        return self.contains_phrase_pdf_birth(text)

    def is_marriage_certificate(self, input_stream) -> bool:
        """Checks if the PDF is a marriage certificate."""
        text = self.extract_images_from_pdf_with_ocr(input_stream).lower()
        return self.contains_phrase_pdf_marriage(text)

    def is_death_certificate(self, input_stream) -> bool:
        """Checks if the PDF is a death certificate."""
        text = self.extract_images_from_pdf_with_ocr(input_stream).lower()
        return self.contains_phrase_pdf_death(text)

    def is_birth_certificate_italy(self, input_stream, lang) -> bool:
        """Checks if the PDF is an Italian birth certificate."""
        text = self.extract_images_from_pdf_with_ocr(input_stream, lang).lower()
        return self.contains_phrase_pdf_birth_italy(text)

    def is_marriage_certificate_italy(self, input_stream, lang) -> bool:
        """Checks if the PDF is an Italian marriage certificate."""
        text = self.extract_images_from_pdf_with_ocr(input_stream, lang).lower()
        return self.contains_phrase_pdf_marriage_italy(text)

    def is_death_certificate_italy(self, input_stream, lang) -> bool:
        """Checks if the PDF is an Italian death certificate."""
        text = self.extract_images_from_pdf_with_ocr(input_stream, lang).lower()
        return self.contains_phrase_pdf_death_italy(text)

    def contains_phrase_pdf_death_italy(self, text: str) -> bool:
        """Checks for phrases related to Italian death certificates."""
        return self.phrase_death_italy_certificate1 in text or self.phrase_death_italy_certificate2 in text

    def contains_phrase_pdf_marriage_italy(self, text: str) -> bool:
        """Checks for phrases related to Italian marriage certificates."""
        return self.phrase_marriage_certificate in text and (
                self.phrase_certificate_italy in text or self.phrase_certificate_italy2 in text)

    def contains_phrase_pdf_birth_italy(self, text: str) -> bool:
        """Checks for phrases related to Italian birth certificates."""
        return self.phrase_birth_italy_certificate in text and (
                self.phrase_certificate_italy in text or self.phrase_certificate_italy2 in text)

    def contains_phrase_pdf_death(self, text: str) -> bool:
        """Checks for phrases related to death certificates."""
        return self.phrase_death_certificate1 in text or self.phrase_death_certificate2 in text

    def contains_phrase_pdf_birth(self, text: str) -> bool:
        """Checks for phrases related to birth certificates."""
        return self.phrase_birth_certificate in text and (
                self.phrase_certificate in text or self.phrase_certificate2 in text)

    def contains_phrase_pdf_marriage(self, text: str) -> bool:
        """Checks for phrases related to marriage certificates."""
        return self.phrase_marriage_certificate in text and (
                self.phrase_certificate in text or self.phrase_certificate2 in text)

    def contains_phrase_pdf(self, text: str) -> bool:
        """Checks for phrases related to any type of civil certificate."""
        text = text.lower().strip()
        return (self.contains_phrase_pdf_birth(text) or
                self.contains_phrase_pdf_marriage(text) or
                self.contains_phrase_pdf_death(text) or
                self.contains_phrase_pdf_birth_italy(text) or
                self.contains_phrase_pdf_marriage_italy(text) or
                self.contains_phrase_pdf_death_italy(text))

    def contains_phrase_front(self, text: str) -> bool:
        """Checks if text contains key phrases for DNI front side."""
        return "registro nacional de las personas" in text.lower()

    def contains_phrase_back(self, text: str) -> bool:
        """Checks if text contains key phrases for DNI back side."""
        text_lower = text.lower()
        phrase_back = "ministro del interior y transporte"
        pattern = self.find_pattern(text)

        return phrase_back in text_lower or bool(pattern)

    def find_pattern(self, text: str):
        """Finds specific ID patterns like 'idargXXX' or 'XXXarg' in text."""
        regex = re.compile(r"(?i)(idarg\w+|\w+arg)")
        return regex.findall(text)
