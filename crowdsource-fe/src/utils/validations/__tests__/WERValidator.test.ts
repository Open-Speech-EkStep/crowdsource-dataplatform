import { Wer } from '../WERValidator';

describe('Wer', () => {
  const wer = new Wer();

  it('should call validate with english and same text should return true', () => {
    expect(wer).toBeInstanceOf(Wer);

    let result = wer.validate('English', 'test', 'test');

    expect(result).toBe(true);
  });

  it('should call validate with a language that does not exist in the constant should return true', () => {
    expect(wer).toBeInstanceOf(Wer);

    let result = wer.validate('French', 'test', 'ball');

    expect(result).toBe(true);
  });

  it('should call validate with english and different text should return true', () => {
    expect(wer).toBeInstanceOf(Wer);

    let result = wer.validate('English', 'test one', 'add two');

    expect(result).toBeFalsy();
  });
});
