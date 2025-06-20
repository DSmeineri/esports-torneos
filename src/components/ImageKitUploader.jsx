import React, { useState, useEffect } from "react";
import { IKContext, IKUpload, IKImage } from "imagekitio-react";

const publicKey = "public_qBAXvZWM1g8zJL/Oq7vTJ3iPaes=";
const urlEndpoint = "https://ik.imagekit.io/rbsbv0586";
const authEndpoint = "http://localhost:5000/auth"; // Tu backend local

const ImageKitUploader = ({ onUploadSuccess, fileName = "imagen.jpg" }) => {
  const [authData, setAuthData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // Obtener firma del backend
    fetch(authEndpoint)
      .then((res) => res.json())
      .then((data) => setAuthData(data))
      .catch((err) => {
        console.error("Error al obtener auth desde backend:", err);
        alert("No se pudo obtener autenticación de imagen.");
      });
  }, []);

  const handleUploadStart = () => setUploading(true);

  const handleUploadError = (err) => {
    setUploading(false);
    console.error("Error subida imagen:", err);
    alert("❌ Error al subir la imagen. Intenta de nuevo.");
  };

  const handleUploadSuccess = (res) => {
    setUploading(false);
    setImageUrl(res.url);
    onUploadSuccess(res.url);
  };

  if (!authData) return <p>Cargando autenticación...</p>;

  return (
    <IKContext
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticationEndpoint={authEndpoint}
    >
      <IKUpload
        fileName={fileName}
        onUploadStart={handleUploadStart}
        onSuccess={handleUploadSuccess}
        onError={handleUploadError}
        useUniqueFileName={true}
        folder="/avatars"
        accept="image/*"
      />
      {uploading && <p>Subiendo imagen...</p>}
      {imageUrl && (
        <div style={{ marginTop: 10 }}>
          <p>Imagen subida:</p>
          <IKImage
            path={imageUrl.replace(urlEndpoint, "")}
            transformation={[{ height: "150", width: "150" }]}
            alt="Imagen subida"
            style={{ borderRadius: 8 }}
          />
        </div>
      )}
    </IKContext>
  );
};

export default ImageKitUploader;
