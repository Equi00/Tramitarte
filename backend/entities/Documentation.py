from sqlalchemy import Column, String, Integer, ForeignKey, Enum
from sqlalchemy.orm import relationship
from database.Database import Base

class Documentation(Base):
    __tablename__ = "documentation"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_base64 = Column(String, nullable=False)

    process_id = Column(Integer, ForeignKey("processes.id"), nullable=True)
    download_request_id = Column(Integer, ForeignKey("download_requests.id"), nullable=True)

    document_type = Column(String, nullable=False)
    download_request = relationship("DownloadRequest", back_populates="documentation")

    process = relationship("Process", back_populates="documentations")

    __mapper_args__ = {
        "polymorphic_identity": "documentation",
        "polymorphic_on": document_type,
        "with_polymorphic": "*",
    }


class AvoDocumentation(Documentation):
    __tablename__ = "avo_documentation"

    id = Column(Integer, ForeignKey("documentation.id"), primary_key=True)

    process = relationship("Process", back_populates="avo_documentation")

    __mapper_args__ = {
        "polymorphic_identity": "avo",
    }


class UserDocumentation(Documentation):
    __tablename__ = "user_documentation"

    id = Column(Integer, ForeignKey("documentation.id"), primary_key=True)

    process = relationship("Process", back_populates="user_documentation")

    __mapper_args__ = {
        "polymorphic_identity": "user",
    }


class AncestorDocumentation(Documentation):
    __tablename__ = "ancestor_documentation"

    id = Column(Integer, ForeignKey("documentation.id"), primary_key=True)

    process = relationship("Process", back_populates="ancestors_documentation")

    __mapper_args__ = {
        "polymorphic_identity": "ancestor",
    }


class TranslatedDocumentation(Documentation):
    __tablename__ = "translated_documentation"

    id = Column(Integer, ForeignKey("documentation.id"), primary_key=True)

    process = relationship("Process", back_populates="translated_documentation")

    __mapper_args__ = {
        "polymorphic_identity": "translated",
    }


class AttachmentDocumentation(Documentation):
    __tablename__ = "attachment_documentation"

    id = Column(Integer, ForeignKey("documentation.id"), primary_key=True)

    process = relationship("Process", back_populates="attachments_to_translate")

    __mapper_args__ = {
        "polymorphic_identity": "attachment",
    }