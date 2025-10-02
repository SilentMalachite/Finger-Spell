import { fingerSpellingMap } from '../fingerSpellingMap';

describe('fingerSpellingMap', () => {
  test('should contain all hiragana characters', () => {
    expect(fingerSpellingMap).toBeDefined();
    expect(Object.keys(fingerSpellingMap)).toHaveLength(83); // Updated to include voiced, semi-voiced, and small characters
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

  test('should correctly map voiced characters', () => {
    // 濁音
    expect(fingerSpellingMap['GA']).toBe('が');
    expect(fingerSpellingMap['GI']).toBe('ぎ');
    expect(fingerSpellingMap['GU']).toBe('ぐ');
    expect(fingerSpellingMap['GE']).toBe('げ');
    expect(fingerSpellingMap['GO']).toBe('ご');

    expect(fingerSpellingMap['ZA']).toBe('ざ');
    expect(fingerSpellingMap['JI']).toBe('じ');
    expect(fingerSpellingMap['ZU']).toBe('ず');
    expect(fingerSpellingMap['ZE']).toBe('ぜ');
    expect(fingerSpellingMap['ZO']).toBe('ぞ');

    expect(fingerSpellingMap['DA']).toBe('だ');
    expect(fingerSpellingMap['DI']).toBe('ぢ');
    expect(fingerSpellingMap['DU']).toBe('づ');
    expect(fingerSpellingMap['DE']).toBe('で');
    expect(fingerSpellingMap['DO']).toBe('ど');

    expect(fingerSpellingMap['BA']).toBe('ば');
    expect(fingerSpellingMap['BI']).toBe('び');
    expect(fingerSpellingMap['BU']).toBe('ぶ');
    expect(fingerSpellingMap['BE']).toBe('べ');
    expect(fingerSpellingMap['BO']).toBe('ぼ');
  });

  test('should correctly map semi-voiced characters', () => {
    // 半濁音
    expect(fingerSpellingMap['PA']).toBe('ぱ');
    expect(fingerSpellingMap['PI']).toBe('ぴ');
    expect(fingerSpellingMap['PU']).toBe('ぷ');
    expect(fingerSpellingMap['PE']).toBe('ぺ');
    expect(fingerSpellingMap['PO']).toBe('ぽ');
  });

  test('should correctly map small characters', () => {
    // 小書き文字
    expect(fingerSpellingMap['SMALL_A']).toBe('ぁ');
    expect(fingerSpellingMap['SMALL_I']).toBe('ぃ');
    expect(fingerSpellingMap['SMALL_U']).toBe('ぅ');
    expect(fingerSpellingMap['SMALL_E']).toBe('ぇ');
    expect(fingerSpellingMap['SMALL_O']).toBe('ぉ');
    
    expect(fingerSpellingMap['SMALL_YA']).toBe('ゃ');
    expect(fingerSpellingMap['SMALL_YU']).toBe('ゅ');
    expect(fingerSpellingMap['SMALL_YO']).toBe('ょ');
    
    expect(fingerSpellingMap['SMALL_TSU']).toBe('っ');
    expect(fingerSpellingMap['SMALL_WA']).toBe('ゎ');
  });
});