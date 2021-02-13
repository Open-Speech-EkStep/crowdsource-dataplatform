class Visualizer {

    setCanvasCtx($canvas) {
        const canvasCtx = $canvas.getContext('2d');
        const canvasWidth = $canvas.width;
        const canvasHeight = $canvas.height;
        canvasCtx.fillStyle = 'rgb(255, 255, 255, 0.8)';
        canvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0,123,255)';
        return {canvasCtx, canvasWidth, canvasHeight};
    }

    visualize(canvas, analyser) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const setCtx = this.setCanvasCtx;

        function draw() {
            requestAnimationFrame(draw);
            analyser.getByteTimeDomainData(dataArray);
            const {canvasCtx, canvasWidth, canvasHeight} = setCtx(canvas);
            canvasCtx.beginPath();
            const sliceWidth = (canvasWidth * 1.0) / bufferLength;
            let x_coordinate = 0;
            for (let count = 0; count < bufferLength; count++) {
                const verticalHeight = dataArray[count] / 128.0; // uint8
                const y_coordinate = (verticalHeight * canvasHeight) / 2; // uint8
                if (count === 0) {
                    canvasCtx.moveTo(x_coordinate, y_coordinate);
                } else {
                    canvasCtx.lineTo(x_coordinate, y_coordinate);
                }
                x_coordinate += sliceWidth;
            }
            const verticalHeight = canvasHeight / 2;
            canvasCtx.lineTo(canvasWidth, verticalHeight);
            canvasCtx.stroke();
        }
        draw();
    }

    drawCanvasLine($canvas) {
        const {canvasCtx, canvasWidth, canvasHeight} = this.setCanvasCtx($canvas);
        const verticalHeight = canvasHeight / 2;
        canvasCtx.moveTo(0, verticalHeight);
        canvasCtx.lineTo(canvasWidth, verticalHeight);
        canvasCtx.stroke();
    }
}

module.exports = Visualizer;
