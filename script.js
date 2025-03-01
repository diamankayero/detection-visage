if (window.FaceDetector) document.getElementById("message").remove();

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const faceDetector = new FaceDetector({ fastMode: true, maxDetectedFaces: 2 });

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
    try {
        const faces = await faceDetector.detect(canvas);
        markFaces(faces);
    } catch (error) {
        console.error("Erreur de détection :", error);
    }
    requestAnimationFrame(update);
}

function markFaces(faces) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "green";

    faces.forEach(face => {
        const { x, y, width, height } = face.boundingBox;
        ctx.beginPath();
        ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
        ctx.stroke();
    });
}

startCamera();
