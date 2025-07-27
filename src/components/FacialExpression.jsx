import React, { useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const FaceExpressionDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Load face-api.js models
  const loadModels = async () => {
    const MODEL_URL = '/models'; // public/models folder
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  };

  // Start webcam
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error('Error accessing webcam:', err));
  };

  // Detect expressions


  async function detectMood(){
          const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();
        let mostProbableExpression = 0;
        let _expression ='';

        if(!detections || detections.length === 0){
            console.log("No Face Detected");
            
            return;
        }
        for(const expression of Object.keys(detections[0].expressions)){
            if (detections[0].expressions[expression] > mostProbableExpression) {
                mostProbableExpression = detections[0].expressions[expression];
                _expression = expression;
            }
            
        }

        console.log(_expression);
  }

  loadModels().then(() => {
      startVideo();
    });


  return (
    <div>
      <video ref={videoRef} autoPlay muted width="360" height="280" style={{ position: '' }} />
      <button onClick={detectMood}>Detect mood</button>
    </div>
  );
};

export default FaceExpressionDetector;
