from fastapi import HTTPException
import pytest
from fastapi.testclient import TestClient
from main import app 
import base64
import os

client = TestClient(app)

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

def encode_file_to_base64(filepath):
    with open(filepath, "rb") as file:
        return base64.b64encode(file.read()).decode("utf-8")

def test_recognize_image():
    with open(TEST_DNI_FRONT, "rb") as file:
        files = {"img": (TEST_DNI_FRONT, file, "image/png")}
        response = client.post("/api/ocr/image", files=files)

    assert response.status_code == 200
    assert isinstance(response.json(), str)

def test_recognize_image_failed():
    with open(TEST_BIRTH_CERTIFICATE_PDF, "rb") as file:
        files = {"img": (TEST_BIRTH_CERTIFICATE_PDF, file, "application/pdf")}
        response = client.post("/api/ocr/image", files=files)

    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid file, this is not an image."}

def test_recognize_pdf():
    with open(TEST_BIRTH_CERTIFICATE_PDF, "rb") as file:
        files = {"file": (TEST_BIRTH_CERTIFICATE_PDF, file, "application/pdf")}
        response = client.post("/api/ocr/pdf", files=files)

    assert response.status_code == 200
    assert isinstance(response.json(), str)

def test_recognize_pdf_failed():
    with open(TEST_DNI_FRONT, "rb") as file:
        files = {"file": (TEST_DNI_FRONT, file, "image/png")}
        response = client.post("/api/ocr/pdf", files=files)

    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid file format, this is not a PDF file."}

def test_is_dni_front():
    with open(TEST_DNI_FRONT, "rb") as file:
        files = {"img": (TEST_DNI_FRONT, file, "image/png")}
        response = client.post("/api/ocr/image/is_dni_front", files=files)

    assert response.status_code == 200
    assert response.json() == True

def test_is_dni_front_failed():
    with open(TEST_DNI_BACK, "rb") as file:
        files = {"img": (TEST_DNI_BACK, file, "image/png")}
        response = client.post("/api/ocr/image/is_dni_front", files=files)

    assert response.status_code == 200
    assert response.json() == False

def test_is_dni_back():
    with open(TEST_DNI_BACK, "rb") as file:
        files = {"img": (TEST_DNI_BACK, file, "image/png")}
        response = client.post("/api/ocr/image/is_dni_back", files=files)

    assert response.status_code == 200
    assert response.json() == True

def test_is_dni_back_failed():
    with open(TEST_DNI_FRONT, "rb") as file:
        files = {"img": (TEST_DNI_FRONT, file, "image/png")}
        response = client.post("/api/ocr/image/is_dni_back", files=files)

    assert response.status_code == 200
    assert response.json() == False

def test_is_certificate():
    with open(TEST_BIRTH_CERTIFICATE_PDF, "rb") as file:
        files = {"pdf": (TEST_BIRTH_CERTIFICATE_PDF, file, "application/pdf")}
        response = client.post("/api/ocr/pdf/is_certificate", files=files)

    assert response.status_code == 200
    assert response.json() == True

def test_is_certificate_failed():
    with open(TEST_INVALID_CERTIFICATE, "rb") as file:
        files = {"pdf": (TEST_INVALID_CERTIFICATE, file, "application/pdf")}
        response = client.post("/api/ocr/pdf/is_certificate", files=files)

    assert response.status_code == 200
    assert response.json() == False

def test_recognize_images_in_pdf():
    with open(TEST_BIRTH_CERTIFICATE_PDF, "rb") as file:
        files = {"pdf": (TEST_BIRTH_CERTIFICATE_PDF, file, "application/pdf")}
        response = client.post("/api/ocr/pdf/text_from_img", files=files)

    assert response.status_code == 200
    assert isinstance(response.json(), str)

def test_recognize_images_in_pdf_failed():
    with open(TEST_DNI_BACK, "rb") as file:
        files = {"pdf": (TEST_DNI_BACK, file, "image/png")}
        response = client.post("/api/ocr/pdf/text_from_img", files=files)

    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid file format, this is not a PDF file."}

def test_is_marriage_certificate():
    with open(TEST_MARRIAGE_CERTIFICATE_PDF, "rb") as file:
        files = {"pdf": (TEST_MARRIAGE_CERTIFICATE_PDF, file, "application/pdf")}
        response = client.post("/api/ocr/pdf/is_marriage", files=files)

    assert response.status_code == 200
    assert response.json() == True

def test_is_marriage_failed_certificate():
    with open(TEST_BIRTH_CERTIFICATE_PDF, "rb") as file:
        files = {"pdf": (TEST_BIRTH_CERTIFICATE_PDF, file, "application/pdf")}
        response = client.post("/api/ocr/pdf/is_marriage", files=files)

    assert response.status_code == 200
    assert response.json() == False

def test_is_birth_certificate():
    with open(TEST_BIRTH_CERTIFICATE_PDF, "rb") as file:
        files = {"pdf": (TEST_BIRTH_CERTIFICATE_PDF, file, "application/pdf")}
        response = client.post("/api/ocr/pdf/is_birth", files=files)

    assert response.status_code == 200
    assert response.json() == True

def test_is_birth_certificate_failed():
    with open(TEST_DEATH_CERTIFICATE_PDF, "rb") as file:
        files = {"pdf": (TEST_DEATH_CERTIFICATE_PDF, file, "application/pdf")}
        response = client.post("/api/ocr/pdf/is_birth", files=files)

    assert response.status_code == 200
    assert response.json() == False

def test_is_death_certificate():
    with open(TEST_DEATH_CERTIFICATE_PDF, "rb") as file:
        files = {"pdf": (TEST_DEATH_CERTIFICATE_PDF, file, "application/pdf")}
        response = client.post("/api/ocr/pdf/is_death", files=files)

    assert response.status_code == 200
    assert response.json() == True

def test_is_death_certificate_failed():
    with open(TEST_BIRTH_CERTIFICATE_PDF, "rb") as file:
        files = {"pdf": (TEST_BIRTH_CERTIFICATE_PDF, file, "application/pdf")}
        response = client.post("/api/ocr/pdf/is_death", files=files)

    assert response.status_code == 200
    assert response.json() == False

def test_is_birth_italy_certificate():
    with open(TEST_BIRTH_CERTIFICATE_TRADUCTION_PDF, "rb") as file:
        files = {"pdf": (TEST_BIRTH_CERTIFICATE_TRADUCTION_PDF, file, "application/pdf")}
        response = client.post("/api/ocr/pdf/is_birth_italy", files=files)

    assert response.status_code == 200
    assert response.json() == True

def test_is_birth_italy_certificate_failed():
    with open(TEST_BIRTH_CERTIFICATE_PDF, "rb") as file:
        files = {"pdf": (TEST_BIRTH_CERTIFICATE_PDF, file, "application/pdf")}
        response = client.post("/api/ocr/pdf/is_birth_italy", files=files)

    assert response.status_code == 200
    assert response.json() == False

def test_is_marriage_italy_certificate():
    with open(TEST_MARRIAGE_CERTIFICATE_TRADUCTION_PDF, "rb") as file:
        files = {"pdf": (TEST_MARRIAGE_CERTIFICATE_TRADUCTION_PDF, file, "application/pdf")}
        response = client.post("/api/ocr/pdf/is_marriage_italy", files=files)

    assert response.status_code == 200
    assert response.json() == True

def test_is_marriage_italy_certificate_failed():
    with open(TEST_MARRIAGE_CERTIFICATE_PDF, "rb") as file:
        files = {"pdf": (TEST_MARRIAGE_CERTIFICATE_PDF, file, "application/pdf")}
        response = client.post("/api/ocr/pdf/is_marriage_italy", files=files)

    assert response.status_code == 200
    assert response.json() == False

def test_is_death_italy_certificate():
    with open(TEST_DEATH_CERTIFICATE_TRADUCTION_PDF, "rb") as file:
        files = {"pdf": (TEST_DEATH_CERTIFICATE_TRADUCTION_PDF, file, "application/pdf")}
        response = client.post("/api/ocr/pdf/is_death_italy", files=files)

    assert response.status_code == 200
    assert response.json() == True

def test_is_death_italy_certificate_failed():
    with open(TEST_DEATH_CERTIFICATE_PDF, "rb") as file:
        files = {"pdf": (TEST_DEATH_CERTIFICATE_PDF, file, "application/pdf")}
        response = client.post("/api/ocr/pdf/is_death_italy", files=files)

    assert response.status_code == 200
    assert response.json() == False