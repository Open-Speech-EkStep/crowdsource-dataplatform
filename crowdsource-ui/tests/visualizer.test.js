const Visualizer = require('./../src/assets/js/visualizer');
const {stringToHTML} = require('./utils');
document.body = stringToHTML('<canvas id="test_canvas"></canvas>');


describe("visualizer", () => {
  const $canvas = document.getElementById('test_canvas');

  const visualizer = new Visualizer();

  const testCanvasCtx = {
    fillStyle: "", fillRect: () => {
    }, beginPath: () => {
    }, moveTo: () => {
    }, lineTo: () => {
    }, stroke: () => {
    }
  };

  describe("setCanvas", () => {
    test('should set canvas after initializing visualizer', () => {
      const canvas = {getContext: () => testCanvasCtx, width: 100, height: 50};
      jest.spyOn(canvas, 'getContext');
      jest.spyOn(testCanvasCtx, 'fillRect');
      const {canvasCtx, canvasWidth, canvasHeight} = visualizer.setCanvasCtx(canvas);

      expect(canvas.getContext).toHaveBeenCalledWith('2d')
      expect(canvasWidth).toBe(100)
      expect(canvasHeight).toBe(50)
      expect(canvasCtx.fillStyle).toBe('rgb(255, 255, 255, 0.8)')
      expect(canvasCtx.fillRect).toHaveBeenCalledWith(0, 0, 100, 50)
      expect(canvasCtx.lineWidth).toBe(2)
      expect(canvasCtx.strokeStyle).toBe('rgb(0,123,255)')
      jest.clearAllMocks();
    })
  })

  describe('visualize', () => {
    beforeEach(() => {
      jest.spyOn(visualizer, 'setCanvasCtx').mockImplementation()
      visualizer.setCanvasCtx.mockReturnValue({canvasCtx: testCanvasCtx, width: 100, height: 50})
      jest.spyOn(testCanvasCtx, 'fillRect');
      jest.spyOn(testCanvasCtx, 'beginPath');
      jest.spyOn(testCanvasCtx, 'moveTo');
      jest.spyOn(testCanvasCtx, 'lineTo');
      jest.spyOn(testCanvasCtx, 'stroke');
    })

    afterEach(() => {
      jest.clearAllMocks();
    })

    test('should draw single straight line when frequencyBinCount is 1', () => {
      const analyser = {
        frequencyBinCount: 1, getByteTimeDomainData: () => {
        }
      };
      jest.spyOn(analyser, 'getByteTimeDomainData');

      visualizer.visualize($canvas, analyser);

      expect(visualizer.setCanvasCtx).toHaveBeenCalled()
      expect(testCanvasCtx.beginPath).toHaveBeenCalledTimes(1);
      expect(testCanvasCtx.moveTo).toHaveBeenCalledTimes(1);
      expect(testCanvasCtx.lineTo).toHaveBeenCalledTimes(1);
      expect(testCanvasCtx.stroke).toHaveBeenCalledTimes(1);
    });

    test('should draw five straight line when frequencyBinCount is 5', () => {
      const analyser = {
        frequencyBinCount: 5, getByteTimeDomainData: () => {
        }
      };
      jest.spyOn(analyser, 'getByteTimeDomainData');

      visualizer.visualize($canvas, analyser);

      expect(visualizer.setCanvasCtx).toHaveBeenCalled()
      expect(testCanvasCtx.beginPath).toHaveBeenCalledTimes(1);
      expect(testCanvasCtx.moveTo).toHaveBeenCalledTimes(1);
      expect(testCanvasCtx.lineTo).toHaveBeenCalledTimes(5);
      expect(testCanvasCtx.stroke).toHaveBeenCalledTimes(1);
    });
  })


  describe("drawCanvasLine", () => {
    test('should draw single straight line', () => {

      jest.spyOn(visualizer, 'setCanvasCtx').mockImplementation()
      visualizer.setCanvasCtx.mockReturnValue({canvasCtx: testCanvasCtx, width: 100, height: 50})
      jest.spyOn(testCanvasCtx, 'fillRect');
      jest.spyOn(testCanvasCtx, 'beginPath');
      jest.spyOn(testCanvasCtx, 'moveTo');
      jest.spyOn(testCanvasCtx, 'lineTo');
      jest.spyOn(testCanvasCtx, 'stroke');

      visualizer.drawCanvasLine($canvas);

      expect(visualizer.setCanvasCtx).toHaveBeenCalled()
      expect(testCanvasCtx.moveTo).toHaveBeenCalled();
      expect(testCanvasCtx.lineTo).toHaveBeenCalled();
      expect(testCanvasCtx.stroke).toHaveBeenCalled();
      jest.clearAllMocks();
    });
  })
})

