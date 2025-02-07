from fastapi import HTTPException
import pytest
import base64
import os
import io
from services.TesseractService import TesseractService

TEST_FILES_PATH = "test_files"
TEST_DNI_FRONT = os.path.join(TEST_FILES_PATH, "dni_front_argentina.jpg")
TEST_DNI_BACK = os.path.join(TEST_FILES_PATH, "dni_back_argentina.jpg")
TEST_BIRTH_CERTIFICATE_PDF = os.path.join(TEST_FILES_PATH, "birth_certificate.pdf")
TEST_BIRTH_CERTIFICATE_TRADUCTION_PDF = os.path.join(TEST_FILES_PATH, "birth_certificate_TRADUCTION.pdf")
TEST_DEATH_CERTIFICATE_PDF = os.path.join(TEST_FILES_PATH, "death_certificate.pdf")
TEST_DEATH_CERTIFICATE_TRADUCTION_PDF = os.path.join(TEST_FILES_PATH, "death_certificate_TRADUCTION.pdf")
TEST_MARRIAGE_CERTIFICATE_PDF = os.path.join(TEST_FILES_PATH, "marriage_certificate.pdf")
TEST_MARRIAGE_CERTIFICATE_TRADUCTION_PDF = os.path.join(TEST_FILES_PATH, "marriage_certificate_TRADUCTION.pdf")
TEST_INVALID_FILE = os.path.join(TEST_FILES_PATH, "doc1.docx")
TEST_INVALID_IMAGE = os.path.join(TEST_FILES_PATH, "text.jpg")
TEST_INVALID_CERTIFICATE = os.path.join(TEST_FILES_PATH, "MK-Prüfungen_-_Niveau_B1.pdf")

def encode_to_base64(file_path):
    with open(file_path, "rb") as file:
        return base64.b64encode(file.read()).decode("utf-8")

def decode_from_base64(base64_content):
    return io.BytesIO(base64.b64decode(base64_content))


@pytest.fixture
def tesseract_service():
    return TesseractService()

def test_recognize_image(tesseract_service):
    base64_code = encode_to_base64(TEST_DNI_FRONT)
    extracted_text = tesseract_service.recognize_image(decode_from_base64(base64_code))

    assert extracted_text is not None
    assert len(extracted_text) > 5  

def test_recognize_pdf(tesseract_service):
    # This test needs a PDF file with text content, not an image in a PDF.
    base64_code = encode_to_base64(TEST_BIRTH_CERTIFICATE_PDF)
    extracted_text = tesseract_service.recognize_pdf(decode_from_base64(base64_code))

    assert extracted_text is not None

def test_extract_images_from_pdf_with_ocr(tesseract_service):
    base64_code = encode_to_base64(TEST_BIRTH_CERTIFICATE_PDF)
    extracted_text = tesseract_service.extract_images_from_pdf_with_ocr(decode_from_base64(base64_code))

    assert extracted_text is not None
    assert len(extracted_text) > 5

def test_is_certificate(tesseract_service):
    base64_code = encode_to_base64(TEST_DEATH_CERTIFICATE_PDF)
    assert tesseract_service.is_certificate(decode_from_base64(base64_code)) == True


def test_is_birth_certificate(tesseract_service):
    base64_code = encode_to_base64(TEST_BIRTH_CERTIFICATE_PDF)
    assert tesseract_service.is_birth_certificate(decode_from_base64(base64_code)) == True


def test_is_marriage_certificate(tesseract_service):
    base64_code = encode_to_base64(TEST_MARRIAGE_CERTIFICATE_PDF)
    assert tesseract_service.is_marriage_certificate(decode_from_base64(base64_code)) == True


def test_is_death_certificate(tesseract_service):
    base64_code = encode_to_base64(TEST_DEATH_CERTIFICATE_PDF)
    assert tesseract_service.is_death_certificate(decode_from_base64(base64_code)) == True


def test_is_dni_front(tesseract_service):
    base64_code = encode_to_base64(TEST_DNI_FRONT)
    assert tesseract_service.is_dni_front(decode_from_base64(base64_code)) == True


def test_is_dni_back(tesseract_service):
    base64_code = encode_to_base64(TEST_DNI_BACK)
    assert tesseract_service.is_dni_back(decode_from_base64(base64_code)) == True

def test_invalid_image_format(tesseract_service):
    base64_code = encode_to_base64(TEST_BIRTH_CERTIFICATE_PDF)

    with pytest.raises(HTTPException) as exception:
        tesseract_service.recognize_image(decode_from_base64(base64_code))

    assert exception.value.status_code == 500
    assert exception.value.detail == "Invalid file, this is not an image." 

def test_invalid_file_format(tesseract_service):
    base64_code = encode_to_base64(TEST_INVALID_FILE)

    with pytest.raises(HTTPException) as exception:
        tesseract_service.recognize_pdf(decode_from_base64(base64_code))

    assert exception.value.status_code == 500
    assert exception.value.detail == "Invalid file format, this is not a PDF file." 

def test_invalid_certificate(tesseract_service):
    base64_code = encode_to_base64(TEST_INVALID_CERTIFICATE)

    bool = tesseract_service.is_certificate(decode_from_base64(base64_code))

    assert bool == False

def test_is_birth_certificate_failed(tesseract_service):
    base64_code = encode_to_base64(TEST_DEATH_CERTIFICATE_PDF)
    assert tesseract_service.is_birth_certificate(decode_from_base64(base64_code)) == False

def test_is_marriage_certificate_failed(tesseract_service):
    base64_code = encode_to_base64(TEST_DEATH_CERTIFICATE_PDF)
    assert tesseract_service.is_marriage_certificate(decode_from_base64(base64_code)) == False


def test_is_death_certificate_failed(tesseract_service):
    base64_code = encode_to_base64(TEST_BIRTH_CERTIFICATE_PDF)
    assert tesseract_service.is_death_certificate(decode_from_base64(base64_code)) == False


def test_is_dni_front_failed(tesseract_service):
    base64_code = encode_to_base64(TEST_DNI_BACK)
    assert tesseract_service.is_dni_front(decode_from_base64(base64_code)) == False


def test_is_dni_back_failed(tesseract_service):
    base64_code = encode_to_base64(TEST_DNI_FRONT)
    assert tesseract_service.is_dni_back(decode_from_base64(base64_code)) == False

def test_is_certificate_italian(tesseract_service):
    base64_code = encode_to_base64(TEST_DEATH_CERTIFICATE_TRADUCTION_PDF)
    assert tesseract_service.is_certificate(decode_from_base64(base64_code), "ita") == True

def test_is_birth_certificate_italian(tesseract_service):
    base64_code = encode_to_base64(TEST_BIRTH_CERTIFICATE_TRADUCTION_PDF)
    assert tesseract_service.is_birth_certificate_italy(decode_from_base64(base64_code), "ita") == True

def test_is_marriage_certificate_italian(tesseract_service):
    base64_code = encode_to_base64(TEST_MARRIAGE_CERTIFICATE_TRADUCTION_PDF)
    assert tesseract_service.is_marriage_certificate_italy(decode_from_base64(base64_code), "ita") == True

def test_is_death_certificate_italian(tesseract_service):
    base64_code = encode_to_base64(TEST_DEATH_CERTIFICATE_TRADUCTION_PDF)
    assert tesseract_service.is_death_certificate_italy(decode_from_base64(base64_code), "ita") == True

def test_is_birth_certificate_italian_failed(tesseract_service):
    base64_code = encode_to_base64(TEST_BIRTH_CERTIFICATE_PDF)
    assert tesseract_service.is_birth_certificate_italy(decode_from_base64(base64_code), "ita") == False

def test_is_marriage_certificate_italian_failed(tesseract_service):
    base64_code = encode_to_base64(TEST_MARRIAGE_CERTIFICATE_PDF)
    assert tesseract_service.is_marriage_certificate_italy(decode_from_base64(base64_code), "ita") == False

def test_is_death_certificate_italian_failed(tesseract_service):
    base64_code = encode_to_base64(TEST_DEATH_CERTIFICATE_PDF)
    assert tesseract_service.is_death_certificate_italy(decode_from_base64(base64_code), "ita") == False