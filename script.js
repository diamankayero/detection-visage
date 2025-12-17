if (!window.FaceDetector) {
    document.getElementById("message").innerHTML = '<h1>FaceDetector non disponible</h1><p>Active le flag Chrome :<br><b>chrome://flags/#enable-experimental-web-platform-features</b></p>';
} else {
    document.getElementById("message").remove();
}

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const faceDetector = window.FaceDetector ? new FaceDetector({ fastMode: true, maxDetectedFaces: 2 }) : null;

async function startCamera() {
    try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = mediaStream;

        video.addEventListener("loadeddata", () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            update();
        });
    } catch (error) {
        console.error("Erreur d'accès à la caméra :", error);
    }
}

async function update() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    if (faceDetector) {
        try {
            const faces = await faceDetector.detect(canvas);
            markFaces(faces);
        } catch (error) {
            console.error("Erreur de détection :", error);
        }
    }
    requestAnimationFrame(update);
}

function markFaces(faces) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "green";

    faces.forEach(face => {
        const { x, y, width, height } = face.boundingBox;
        ctx.strokeRect(x, y, width, height);
    });
}

startCamera();

