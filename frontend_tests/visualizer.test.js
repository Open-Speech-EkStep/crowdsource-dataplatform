const {visualize, drawCanvasLine} = require('./../assets/js/visualizer');

const {readFileSync} = require('fs');
const {stringToHTML} = require('./utils');

document.body = stringToHTML(
    readFileSync(`${__dirname}/../views/validator-prompt-page.ejs`, 'UTF-8')
);


describe("visualize",()=>{
    test('should draw single straight line when frequencyBinCount is 1', () => {
        const canvasCtx = {fillStyle:"", fillRect:(e)=>{}, beginPath:()=>{},moveTo:(a,b)=>{},lineTo:(a,b)=>{},stroke:()=>{}};
        jest.spyOn(canvasCtx, 'fillRect');
        jest.spyOn(canvasCtx, 'beginPath');
        jest.spyOn(canvasCtx, 'moveTo');
        jest.spyOn(canvasCtx, 'lineTo');
        jest.spyOn(canvasCtx, 'stroke');


        const canvas = {getContext:(e)=>canvasCtx, width:100, height:50};
            const analyser = {frequencyBinCount:1, getByteTimeDomainData:(e)=>{}};
            jest.spyOn(analyser, 'getByteTimeDomainData');
            jest.spyOn(canvas, 'getContext');

            visualize(canvas, analyser);

            expect(canvas.getContext).toHaveBeenCalledTimes(1);
            expect(canvas.getContext).toHaveBeenCalledWith('2d');
            expect(canvasCtx.fillRect).toHaveBeenCalledTimes(1);
            expect(canvasCtx.fillRect).toHaveBeenCalledWith(0, 0, 100, 50);
            expect(canvasCtx.beginPath).toHaveBeenCalledTimes(1);
            expect(canvasCtx.moveTo).toHaveBeenCalledTimes(1);
            expect(canvasCtx.lineTo).toHaveBeenCalledTimes(1);
            expect(canvasCtx.stroke).toHaveBeenCalledTimes(1);

            jest.clearAllMocks();

    });

    test('should draw five straight line when frequencyBinCount is 5', () => {
        const canvasCtx = {fillStyle:"", fillRect:(e)=>{}, beginPath:()=>{},moveTo:(a,b)=>{},lineTo:(a,b)=>{},stroke:()=>{}};
        jest.spyOn(canvasCtx, 'fillRect');
        jest.spyOn(canvasCtx, 'beginPath');
        jest.spyOn(canvasCtx, 'moveTo');
        jest.spyOn(canvasCtx, 'lineTo');
        jest.spyOn(canvasCtx, 'stroke');


        const canvas = {getContext:(e)=>canvasCtx, width:100, height:50};
        const analyser = {frequencyBinCount:5, getByteTimeDomainData:(e)=>{}};
        jest.spyOn(analyser, 'getByteTimeDomainData');
        jest.spyOn(canvas, 'getContext');

        visualize(canvas, analyser);

        expect(canvas.getContext).toHaveBeenCalledTimes(1);
        expect(canvas.getContext).toHaveBeenCalledWith('2d');
        expect(canvasCtx.fillRect).toHaveBeenCalledTimes(1);
        expect(canvasCtx.fillRect).toHaveBeenCalledWith(0, 0, 100, 50);
        expect(canvasCtx.beginPath).toHaveBeenCalledTimes(1);
        expect(canvasCtx.moveTo).toHaveBeenCalledTimes(1);
        expect(canvasCtx.lineTo).toHaveBeenCalledTimes(5);
        expect(canvasCtx.stroke).toHaveBeenCalledTimes(1);
        jest.clearAllMocks();

    });

})

describe("drawCanvasLine",()=> {
    test('should draw single straight line', () => {
        const $canvas = document.getElementById('myCanvas');
        const canvasCtx = {
            fillStyle: "", fillRect: (e) => {
            }, beginPath: () => {
            }, moveTo: (a, b) => {
            }, lineTo: (a, b) => {
            }, stroke: () => {
            }
        };
        jest.spyOn(canvasCtx, 'fillRect');
        jest.spyOn(canvasCtx, 'beginPath');
        jest.spyOn(canvasCtx, 'moveTo');
        jest.spyOn(canvasCtx, 'lineTo');
        jest.spyOn(canvasCtx, 'stroke');


         $canvas.getContext =  (e) => canvasCtx
        jest.spyOn($canvas, 'getContext');

        drawCanvasLine();
        expect($canvas.getContext).toHaveBeenCalledTimes(1);
        expect($canvas.getContext).toHaveBeenCalledWith('2d');
        expect(canvasCtx.fillRect).toHaveBeenCalledTimes(1);
        expect(canvasCtx.fillRect).toHaveBeenCalledWith(0, 0, 300, 120);
        expect(canvasCtx.moveTo).toHaveBeenCalledTimes(1);
        expect(canvasCtx.lineTo).toHaveBeenCalledTimes(1);
        expect(canvasCtx.stroke).toHaveBeenCalledTimes(1);
        jest.clearAllMocks();

    });
})
