function visualize(canvas, analyser) {
    const canvasCtx = canvas.getContext('2d');
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw(){
        requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);
        canvasCtx.fillStyle = 'rgb(255, 255, 255, 0.8)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0,123,255)';
        canvasCtx.beginPath();
        const sliceWidth = (WIDTH * 1.0) / bufferLength;
        let x_coordinate = 0;
        for (let count = 0; count < bufferLength; count++) {
            const verticalHeight = dataArray[count] / 128.0; // uint8
            const y_coordinate = (verticalHeight * HEIGHT) / 2; // uint8
            if (count === 0) {
                canvasCtx.moveTo(x_coordinate, y_coordinate);
            } else {
                canvasCtx.lineTo(x_coordinate, y_coordinate);
            }
            x_coordinate += sliceWidth;
        }
        canvasCtx.lineTo(WIDTH, HEIGHT / 2);
        canvasCtx.stroke();
    }
    draw();
}

module.exports = {visualize};
