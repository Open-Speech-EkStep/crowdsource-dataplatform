import { Levenstein } from '../LevensteinValidator';

describe('Levenstein', () => {
  it('should call validate with english and same text should return true', () => {
    const levenstein = new Levenstein();
    expect(levenstein).toBeInstanceOf(Levenstein);

    let result = levenstein.validate('English', 'test', 'test');

    expect(result).toBe(true);
  });

  it('should call validate with a language which does not exist in the constant array should return true', () => {
    const levenstein = new Levenstein();
    expect(levenstein).toBeInstanceOf(Levenstein);

    let result = levenstein.validate('French', 'test', 'test1234567890');

    expect(result).toBe(true);
  });

  it('should call validate with english and different text should return false', () => {
    const levenstein = new Levenstein();
    expect(levenstein).toBeInstanceOf(Levenstein);

    let result = levenstein.validate('English', 'testone', 'test');

    expect(result).toBeFalsy();
  });
});
