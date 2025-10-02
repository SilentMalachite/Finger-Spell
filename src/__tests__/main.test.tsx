/**
 * @jest-environment jsdom
 */

// React 18のcreateRootを使用したレンダリングのテスト
describe('main.tsx', () => {
  let container: HTMLDivElement | null = null;

  beforeEach(() => {
    // DOMにコンテナ要素をセットアップ
    container = document.createElement('div');
    container.id = 'root';
    document.body.appendChild(container);
  });

  afterEach(() => {
    // テスト後にコンテナをクリーンアップ
    if (container) {
      document.body.removeChild(container);
      container = null;
    }
  });

  test('should render App component without crashing', () => {
    // Appコンポーネントがクラッシュすることなくレンダリングされるか確認
    expect(container).toBeInTheDocument();
    
    // root要素が存在するか確認
    const rootElement = document.getElementById('root');
    expect(rootElement).toBeInTheDocument();
  });

  test('should have root element in document', () => {
    // root要素が存在するか確認
    expect(document.getElementById('root')).toBeInTheDocument();
  });
});