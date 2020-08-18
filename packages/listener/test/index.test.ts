/**
 *
 * create by ligx
 *
 * @flow
 */

import Listener from '../src';

describe('Listener', () => {
  it('removeListener click', async () => {
    let call = false;
    const cb = () => {
      call = true;
    };
    const mouseEventObj = {
      buttons: 1,
    };
    const listener = new Listener();
    const eventName = 'click';
    const res = listener.on(eventName, cb);
    res.removeListener();
    listener.emit(eventName, mouseEventObj);
    expect(call).toBeFalsy();
  });

  it('removeListener hello', async () => {
    let call = false;
    const cb = () => {
      call = true;
    };
    const mouseEventObj = {
      buttons: 1,
    };
    const listener = new Listener();
    const eventName = 'hello';
    const res = listener.on(eventName, cb);
    res.removeListener();
    listener.emit(eventName, mouseEventObj);
    expect(call).toBeFalsy();
  });

  it('on hello', async () => {
    let cb = (data: any) => {};

    const callPromise = new Promise(res => {
      cb = (data: any) => {
        res(data);
      };
    });
    const mouseEventObj = {
      buttons: 1,
    };
    const listener = new Listener();
    const eventName = 'hello';
    listener.on(eventName, cb);
    listener.emit(eventName, mouseEventObj);
    expect(await callPromise).toBe(mouseEventObj);
  });

  it('on hello outSilence', async () => {
    let cb = (data: any) => {};

    const callPromise = new Promise(res => {
      cb = (data: any) => {
        res(data);
      };
    });
    const mouseEventObj = {
      buttons: 1,
    };
    const listener = new Listener();
    const eventName = 'hello';
    listener.on(eventName, cb);
    listener.once('abc', (data: any) => {
      if (data === 'silence') {
        throw new Error('静默失败');
      }
    });

    listener.silenceBlock('abc', () => {
      listener.emit('abc', 'silence');
      listener.emit(eventName, mouseEventObj);
    });
    let abcCall = (data: any) => {};

    const abcCallPromise = new Promise(res => {
      abcCall = (data: any) => {
        res(data);
      };
    });
    listener.on('abc', abcCall);

    listener.emit('abc', mouseEventObj);

    expect(await callPromise).toBe(mouseEventObj);
    expect(await abcCallPromise).toBe(mouseEventObj);
  });

  it('on hello outSilence cb error', async () => {
    const mouseEventObj = {
      buttons: 1,
    };
    const listener = new Listener();
    listener.once('abc', (data: any) => {
      if (data === 'silence') {
        throw new Error('静默失败');
      }
    });

    try {
      listener.silenceBlock('abc', () => {
        listener.emit('abc', 'silence');
        throw new Error('313131');
      });
    } catch (err) {
      expect(err.message).toBe('313131');
    }

    let abcCall = (data: any) => {};

    const abcCallPromise = new Promise(res => {
      abcCall = (data: any) => {
        res(data);
      };
    });
    listener.on('abc', abcCall);

    listener.emit('abc', mouseEventObj);

    expect(await abcCallPromise).toBe(mouseEventObj);
  });

  it('on hello outSilence array params', async () => {
    const listener = new Listener();
    const eventName = 'hello';
    listener.on(eventName, (data: any) => {
      if (data === 'silence') {
        throw new Error('静默失败');
      }
    });
    listener.on('abc', (data: any) => {
      if (data === 'silence') {
        throw new Error('静默失败');
      }
    });

    listener.silenceBlock(['abc', 'hello'], () => {
      listener.emit('abc', 'silence');
      listener.emit(eventName, 'silence');
    });
    let abcCall = (data: any) => {};

    const abcCallPromise = new Promise(res => {
      abcCall = (data: any) => {
        res(data);
      };
    });
    let cb = (data: any) => {};

    const callPromise = new Promise(res => {
      cb = (data: any) => {
        res(data);
      };
    });
    const mouseEventObj = {
      buttons: 1,
    };
    listener.on(eventName, cb);

    listener.on('abc', abcCall);

    listener.emit('abc', mouseEventObj);
    listener.emit(eventName, mouseEventObj);

    expect(await callPromise).toBe(mouseEventObj);
    expect(await abcCallPromise).toBe(mouseEventObj);
  });

  it('on click', async () => {
    let cb = (data: any) => {};

    const callPromise = new Promise(res => {
      cb = (data: any) => {
        res(data);
      };
    });
    const mouseEventObj = {
      buttons: 1,
    };
    const listener = new Listener();
    const eventName = 'click';
    listener.on(eventName, cb);
    listener.emit(eventName, mouseEventObj);
    expect(await callPromise).toBe(mouseEventObj);
  });

  it('delegate', async () => {
    let cb = (data: any) => {};

    const callPromise = new Promise((resolve: (data: any) => void) => {
      cb = (data: any) => {
        resolve(data);
      };
    });
    const mouseEventObj = {
      buttons: 1,
    };
    const listener = new Listener();
    const delegate = new Listener();
    const eventName = 'click';
    delegate.on(eventName, cb);
    const res = delegate.delegate(eventName, listener);
    expect(res.removeListener).not.toBeNull();
    expect(res.removeListener).not.toBeUndefined();
    listener.emit(eventName, mouseEventObj);
    expect(await callPromise).toBe(mouseEventObj);
  });

  it('takeEventData', async () => {
    const listener = new Listener();
    const mouseEventObj = {
      buttons: 1,
      clientX: 1,
      clientY: 2,
    };
    const interval = setInterval(() => {
      listener.emit('moving', {
        clientX: mouseEventObj.clientX,
        clientY: mouseEventObj.clientY,
      });
    }, 200);
    const data = await listener.takeEventData('moving', 1050);
    clearInterval(interval);
    expect(data).toEqual([
      {
        clientX: 1,
        clientY: 2,
      },
      {
        clientX: 1,
        clientY: 2,
      },
      {
        clientX: 1,
        clientY: 2,
      },
      {
        clientX: 1,
        clientY: 2,
      },
      {
        clientX: 1,
        clientY: 2,
      },
    ]);
  });

  it('awaitEvent', async () => {
    const listener = new Listener();

    const event = 'hello';
    const data = 12341;
    setTimeout(() => {
      listener.emit(event, data);
    }, 1000);

    const res = await listener.awaitEvent(event);
    expect(res).toBe(data);
  });
});
