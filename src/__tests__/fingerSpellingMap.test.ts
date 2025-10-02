import { fingerSpellingMap } from '../fingerSpellingMap';

describe('fingerSpellingMap', () => {
  test('should contain all hiragana characters', () => {
    expect(fingerSpellingMap).toBeDefined();
    expect(Object.keys(fingerSpellingMap)).toHaveLength(48);
  });

  test('should correctly map basic vowels', () => {
    expect(fingerSpellingMap['A']).toBe('あ');
    expect(fingerSpellingMap['I']).toBe('い');
    expect(fingerSpellingMap['U']).toBe('う');
    expect(fingerSpellingMap['E']).toBe('え');
    expect(fingerSpellingMap['O']).toBe('お');
  });

  test('should correctly map kana rows', () => {
    // か行
    expect(fingerSpellingMap['KA']).toBe('か');
    expect(fingerSpellingMap['KI']).toBe('き');
    expect(fingerSpellingMap['KU']).toBe('く');
    expect(fingerSpellingMap['KE']).toBe('け');
    expect(fingerSpellingMap['KO']).toBe('こ');
    
    // さ行
    expect(fingerSpellingMap['SA']).toBe('さ');
    expect(fingerSpellingMap['SHI']).toBe('し');
    expect(fingerSpellingMap['SU']).toBe('す');
    expect(fingerSpellingMap['SE']).toBe('せ');
    expect(fingerSpellingMap['SO']).toBe('そ');
    
    // た行
    expect(fingerSpellingMap['TA']).toBe('た');
    expect(fingerSpellingMap['CHI']).toBe('ち');
    expect(fingerSpellingMap['TSU']).toBe('つ');
    expect(fingerSpellingMap['TE']).toBe('て');
    expect(fingerSpellingMap['TO']).toBe('と');
  });

  test('should correctly map all remaining characters', () => {
    // な行
    expect(fingerSpellingMap['NA']).toBe('な');
    expect(fingerSpellingMap['NI']).toBe('に');
    expect(fingerSpellingMap['NU']).toBe('ぬ');
    expect(fingerSpellingMap['NE']).toBe('ね');
    expect(fingerSpellingMap['NO']).toBe('の');
    
    // は行
    expect(fingerSpellingMap['HA']).toBe('は');
    expect(fingerSpellingMap['HI']).toBe('ひ');
    expect(fingerSpellingMap['FU']).toBe('ふ');
    expect(fingerSpellingMap['HE']).toBe('へ');
    expect(fingerSpellingMap['HO']).toBe('ほ');
    
    // ま行
    expect(fingerSpellingMap['MA']).toBe('ま');
    expect(fingerSpellingMap['MI']).toBe('み');
    expect(fingerSpellingMap['MU']).toBe('む');
    expect(fingerSpellingMap['ME']).toBe('め');
    expect(fingerSpellingMap['MO']).toBe('も');
    
    // や行
    expect(fingerSpellingMap['YA']).toBe('や');
    expect(fingerSpellingMap['YU']).toBe('ゆ');
    expect(fingerSpellingMap['YO']).toBe('よ');
    
    // ら行
    expect(fingerSpellingMap['RA']).toBe('ら');
    expect(fingerSpellingMap['RI']).toBe('り');
    expect(fingerSpellingMap['RU']).toBe('る');
    expect(fingerSpellingMap['RE']).toBe('れ');
    expect(fingerSpellingMap['RO']).toBe('ろ');
    
    // わ行
    expect(fingerSpellingMap['WA']).toBe('わ');
    expect(fingerSpellingMap['WI']).toBe('ゐ');
    expect(fingerSpellingMap['WE']).toBe('ゑ');
    expect(fingerSpellingMap['WO']).toBe('を');
    
    // ん
    expect(fingerSpellingMap['N']).toBe('ん');
  });
});