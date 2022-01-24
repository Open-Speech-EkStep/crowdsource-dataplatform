import { TruthyValidator } from '../TruthyValidator';

describe('TruthyValidator', () => {
  const truthyValidator = new TruthyValidator();

  it('should always return true when validate is called', () => {
    expect(truthyValidator).toBeInstanceOf(TruthyValidator);

    let result = truthyValidator.validate('English', 'text A', 'text B');

    expect(result).toBe(true);
  });
});
