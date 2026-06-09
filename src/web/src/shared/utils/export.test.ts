import { triggerDownload } from './export';

describe('triggerDownload', () => {
  beforeAll(() => {
    global.URL.createObjectURL = vi.fn(() => 'blob:test');
    global.URL.revokeObjectURL = vi.fn();
  });

  it('creates a download link and clicks it', () => {
    const blob = new Blob(['test'], { type: 'text/csv' });
    const click = vi.fn();
    document.createElement = vi.fn().mockReturnValue({
      href: '',
      download: '',
      click,
    });

    triggerDownload(blob, 'test.csv');

    expect(click).toHaveBeenCalledOnce();
    expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
  });

  it('sets the download attribute with provided filename', () => {
    const blob = new Blob(['data'], { type: 'text/csv' });
    let downloadAttr = '';
    document.createElement = vi.fn().mockReturnValue({
      href: '',
      set download(v: string) { downloadAttr = v; },
      get download() { return downloadAttr; },
      click: vi.fn(),
    });

    triggerDownload(blob, 'relatorio.csv');
    expect(downloadAttr).toBe('relatorio.csv');
  });

  it('revokes the object URL after download', () => {
    const blob = new Blob(['x']);
    document.createElement = vi.fn().mockReturnValue({
      href: '',
      download: '',
      click: vi.fn(),
    });

    triggerDownload(blob, 'f.csv');
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test');
  });
});
