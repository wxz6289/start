declare global {
  interface Window {
    start: {
      handlers: {
        ping: () => Promise<string>;
        setTitle: (title: string) => Promise<void>;
        openFile: () => Promise<string | undefined>;
        onUpdateCounter: (callback: (value: number) => void) => void;
        counterValue: (value: number) => Promise<void>;
      };
      versions?: Record<string, () => string>;
    };
  }
}

for (const version in window.start.versions) {
  const versions = window.start.versions;
  if (Object.prototype.hasOwnProperty.call(versions, version)) {
    const element = versions[version];
    console.log(`${version}: ${element()}`);
  }
}

