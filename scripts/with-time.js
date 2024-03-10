import EventEmitter from './event-emitter.js';

class WithTime extends EventEmitter {
  execute(asyncFunc, ...args) {
    // emit event start, end, data received
    // call asyncFunc with args specified
    // compute the time it takes to execute asyncFunc

    this.emit('begin');

    console.time('asyncFunc');

    asyncFunc(...args)
      .then((data) => {
        this.emit('data', data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        this.emit('end');
        console.timeEnd('asyncFunc')
      });
  }
}

const fetchFromUrl = async (url) => {
  // fetch from https://jsonplaceholder.typicode.com/posts/1
  // transform to JSON

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    });
}


const withTime = new WithTime();

withTime.on('begin', () => console.log('About to execute'));
withTime.on('data', (data) => console.log('Data: ', data));
withTime.on('end', () => console.log('Done with execute'));

withTime.execute(fetchFromUrl, 'https://jsonplaceholder.typicode.com/posts/1');

console.log(withTime.rawListeners("end"));
